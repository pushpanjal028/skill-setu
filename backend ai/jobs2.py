from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS
import fitz
import requests
import google.genai as genai
from pymongo import MongoClient
from datetime import datetime, timezone
import json
import logging
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)
ai_client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))
ADZUNA_ID = os.getenv("ADZUNA_ID")
ADZUNA_KEY = os.getenv("ADZUNA_KEY")
client = MongoClient(os.getenv("MONGO_DB_URI"))
db = client['SkillSetuDB']
def extract_resume_text(pdf_file, max_words=300):
    pdf_file.seek(0)
    words = []
    with fitz.open(stream=pdf_file.read(), filetype="pdf") as doc:
        for page in doc:
            words.extend(page.get_text().split())
            if len(words) >= max_words:
                break
    return " ".join(words[:max_words])
def analyze_with_ai(prompt):
    try:
        response = ai_client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        return getattr(response, "text", "") or "[]"
    except Exception as e:
        logging.error(f"Gemini Error: {e}")
        return "[]"
def safe_parse_json(text):
    try:
        text = text.strip().replace("```json", "").replace("```", "")
        return json.loads(text)
    except Exception as e:
        logging.warning(f"JSON parse failed: {e}")
        return []
@app.route('/analyze_jobs_with_resume', methods=['POST'])
def analyze_jobs_with_resume():
    try:
        user_id = request.form.get("user_id")
        job_title = request.form.get("job_title")
        location = request.form.get("location")
        job_type = request.form.get("job_type", "full_time")
        resume_file = request.files.get("resume")
        if not user_id or not job_title or not location or not resume_file:
            return jsonify({"error": "Missing required fields"}), 400
        if not resume_file.filename.endswith(".pdf"):
            return jsonify({"error": "Only PDF allowed"}), 400
        resume_excerpt = extract_resume_text(resume_file)
        adzuna_url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            'app_id': ADZUNA_ID,
            'app_key': ADZUNA_KEY,
            'results_per_page': 3,
            'what': job_title,
            'where': location,
            'full_time': 1 if job_type == "full_time" else 0
        }
        try:
            job_response = requests.get(adzuna_url, params=params, timeout=5)
            job_response.raise_for_status()
        except requests.RequestException as e:
            logging.error(f"Adzuna Error: {e}")
            return jsonify({"error": "Job API unavailable"}), 503
        raw_jobs = job_response.json().get('results', [])
        if not raw_jobs:
            return jsonify({"status": "success", "jobs": []})
        jobs_text = "\n".join([
            f"Job {i+1}: {job.get('title')} - {job.get('description','')[:300]}"
            for i, job in enumerate(raw_jobs)
        ])
        prompt = f"""
You are an AI career assistant.
Return ONLY valid JSON. No explanation. No markdown.
Format:
[
  {{"job_index":1,"missing_skills":["skill1","skill2"]}}
]
Resume:
{resume_excerpt}
Jobs:
{jobs_text}
"""
        ai_output = analyze_with_ai(prompt)
        parsed_output = safe_parse_json(ai_output)
        analyzed_jobs = []
        for i, job in enumerate(raw_jobs):
            job_skills = next(
                (
                    item.get("missing_skills", [])
                    for item in parsed_output
                    if item.get("job_index") == i + 1
                ),
                []
            )
            skill_links = [
                {
                    "skill_name": skill,
                    "tutorial_url": f"https://www.youtube.com/results?search_query={skill.replace(' ','+')}+tutorial"
                }
                for skill in job_skills
            ]
            analyzed_jobs.append({
                "title": job.get('title'),
                "company": job.get('company', {}).get('display_name'),
                "description": job.get('description', '')[:200] + "...",
                "missing_skills_data": skill_links,
                "apply_link": job.get('redirect_url')
            })
        db["Skills"].update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "last_active": datetime.now(timezone.utc),
                    "last_input": {
                        "job_title": job_title,
                        "location": location
                    }
                },
                "$push": {
                    "search_history": {
                        "$each": [{
                            "timestamp": datetime.now(timezone.utc),
                            "job_title": job_title,
                            "results": analyzed_jobs
                        }],
                        "$slice": -10
                    }
                }
            },
            upsert=True
        )
        return jsonify({"status": "success", "jobs": analyzed_jobs})
    except Exception as e:
        logging.error(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500
@app.route('/get_saved_jobs', methods=['GET'])
def get_saved_jobs():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    user_doc = db["Skills"].find_one(
        {"user_id": user_id},
        {"_id": 0}
    )
    if not user_doc:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "status": "success",
        "search_history": user_doc.get("search_history", [])
    })
if __name__ == "__main__":
    app.run(debug=True, port=5001)