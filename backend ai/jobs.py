from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS
import fitz
import requests
import google.genai as genai
from pymongo import MongoClient
from datetime import datetime, timezone

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Gemini client
ai_client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))

# Adzuna credentials
ADZUNA_ID = os.getenv("ADZUNA_ID")
ADZUNA_KEY = os.getenv("ADZUNA_KEY")

# MongoDB connection
URI = "mongodb+srv://coder_hack:Sankalp2026@cluster0.slx9flr.mongodb.net/?appName=Cluster0"
client = MongoClient(URI)
db = client['SkillSetuDB']
collection = db['Skills']


def extract_resume_text(pdf_file):
    """Extract text from uploaded PDF resume."""
    text = ""
    with fitz.open(stream=pdf_file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text


@app.route('/analyze_jobs_with_resume', methods=['POST'])
def analyze_jobs_with_resume():
    try:
        # 1. Capture Form Data
        user_id = request.form.get("user_id")
        job_title = request.form.get("job_title")
        location = request.form.get("location")
        job_type = request.form.get("job_type", "full_time")
        resume_file = request.files.get("resume")

        if not all([user_id, job_title, location, resume_file]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        # 2. Extract Resume Text
        resume_text = extract_resume_text(resume_file)

        # 3. Adzuna API Call
        is_full_time = 1 if job_type == "full_time" else 0
        adzuna_url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            'app_id': ADZUNA_ID,
            'app_key': ADZUNA_KEY,
            'results_per_page': 5,
            'what': job_title,
            'where': location,
            'full_time': is_full_time,
        }

        job_response = requests.get(adzuna_url, params=params)
        raw_jobs = job_response.json().get('results', [])

        analyzed_jobs = []
        for job in raw_jobs:
            job_desc = job.get('description', '')
            resume_excerpt = " ".join(resume_text.split()[:300])  # safe truncation

            # 4. Gemini Analysis
            prompt = (
                f"Identify technical skills missing in this Resume for this Job. "
                f"Resume: {resume_excerpt} Job Description: {job_desc} "
                f"Return ONLY the missing skill names separated by commas."
            )

            try:
                ai_res = ai_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if hasattr(ai_res, "text"):
                       text_out = ai_res.text
                elif hasattr(ai_res, "candidates"):
                    text_out = ai_res.candidates[0].content.parts[0].text
                else:
                     text_out = ""
                missing_skills = [s.strip() for s in text_out.split(",") if s.strip()]
            except Exception as e:
                print("Gemini error:", e)
                missing_skills = []

            # 5. Build YouTube Links
            skill_links = []
            for skill in missing_skills:
                query = f"Learn {skill} for beginners tutorial 2026".replace(" ", "+")
                yt_link = f"https://www.youtube.com/results?search_query={query}"
                skill_links.append({"skill_name": skill, "tutorial_url": yt_link})

            analyzed_jobs.append({
                "title": job.get('title'),
                "company": job.get('company', {}).get('display_name'),
                "description": job_desc[:200] + "...",
                "missing_skills_data": skill_links,
                "apply_link": job.get('redirect_url')
            })

        # 6. Database Update
        db.Skills.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "last_active": datetime.now(timezone.utc),
                    "latest_input": {"job_title": job_title, "location": location},
                },
                "$push": {
                    "search_history": {
                        "timestamp": datetime.now(timezone.utc),
                        "job_title": job_title,
                        "results": analyzed_jobs
                    }
                }
            },
            upsert=True
        )

        return jsonify({"status": "success", "jobs": analyzed_jobs})

    except Exception as e:
        print(f"Error: {e}")  # Log for debugging
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/get_saved_jobs', methods=['GET'])
def get_saved_jobs():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    user_doc = db["Skills"].find_one({"user_id": user_id}, {"_id": 0})
    if not user_doc:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify({"status": "success", "search_history": user_doc.get("search_history", [])})


if __name__ == "__main__":
    app.run(debug=True, port=5001)