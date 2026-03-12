from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import requests
import google.genai as genai
from pymongo import MongoClient
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Gemini client
ai_client = genai.Client(api_key="AIzaSyDM-qrxK7rQ2pVX6czxqEkv9kPD7kkAIhU")

# Adzuna credentials
ADZUNA_ID = "2111fce7"
ADZUNA_KEY = "ecabe773bf8e94f9b07aed606f2c459b"

# MongoDB connection
URI = "mongodb+srv://coder_hack:Sankalp2026@cluster0.slx9flr.mongodb.net/?appName=Cluster0"
client = MongoClient(URI)
db = client['SkillSetuDB']
collection = db['Skills']

# -------------------------------
# Resume extraction
# -------------------------------
def extract_resume_text(pdf_file):
    text = ""
    with fitz.open(stream=pdf_file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

# -------------------------------
# Analyze jobs with resume
# -------------------------------
@app.route('/analyze_jobs_with_resume', methods=['POST'])
def analyze_jobs():
    try:
        user_id = request.form.get("user_id")
        job_title = request.form.get("job_title")
        location = request.form.get("location")
        job_type = request.form.get("job_type", "full_time")
        resume_file = request.files.get("resume")

        if not all([user_id, job_title, location, resume_file]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        resume_text = extract_resume_text(resume_file)
        is_full_time = 1 if job_type == "full_time" else 0

        adzuna_url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            'app_id': ADZUNA_ID,
            'app_key': ADZUNA_KEY,
            'results_per_page': 5,
            'what': job_title,
            'where': location,
            'full_time': is_full_time,
            'content-type': 'application/json'
        }
        job_response = requests.get(adzuna_url, params=params)
        if job_response.status_code != 200:
            return jsonify({"status": "error", "message": "Adzuna API Error"}), 500

        raw_jobs = job_response.json().get('results', [])
        analyzed_jobs = []

        for job in raw_jobs:
            job_desc = job.get('description', '')
            prompt = f"""Identify key technical skills missing in this Resume for this Job.
            Resume: {resume_text[:1500]}
            Job Description: {job_desc}
            Return ONLY the missing skill names separated by commas"""

            ai_res = ai_client.models.generate_content(
                model="models/gemini-2.5-flash",
                contents=prompt
            )
            missing_skills = [s.strip() for s in ai_res.text.split(",") if s.strip()]
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

        # Save to Skills collection
        filter_criteria = {"user_id": user_id}
        update_data = {
            "$set": {
                "last_active": datetime.now(),
                "latest_input": {
                    "job_title": job_title,
                    "location": location,
                    "job_type": job_type
                },
                "current_resume_text": resume_text[:1000]
            },
            "$push": {
                "search_history": {
                    "timestamp": datetime.now(),
                    "job_title": job_title,
                    "results": analyzed_jobs
                }
            }
        }
        collection.update_one(filter_criteria, update_data, upsert=True)

        return jsonify({
            "status": "success",
            "user_id": user_id,
            "jobs_found": len(analyzed_jobs),
            "jobs": analyzed_jobs
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# -------------------------------
# Get saved jobs
# -------------------------------
@app.route('/get_saved_jobs', methods=['GET'])
def get_saved_jobs():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    user_doc = collection.find_one({"user_id": user_id}, {"_id": 0})
    if not user_doc:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify({"status": "success", "search_history": user_doc.get("search_history", [])})

# -------------------------------
# Workforce analytics
# -------------------------------
def get_market_analytics(job_title, location, user_id):
    adzuna_url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    params = {
        'app_id': ADZUNA_ID,
        'app_key': ADZUNA_KEY,
        'results_per_page': 20,
        'what': job_title,
        'where': location,
        'content-type': 'application/json'
    }
    response = requests.get(adzuna_url, params=params)
    if response.status_code != 200:
        raise Exception("Adzuna API error")

    raw_jobs = response.json().get('results', [])
    if not raw_jobs:
        raise Exception("No jobs found")

    all_descriptions = " ".join([j.get('description', '') for j in raw_jobs])

    user_record = collection.find_one({"user_id": user_id})
    if not user_record:
        raise Exception("User record not found")

    user_skills = user_record.get("current_resume_text", "")

    prompt = f"""
    Analyze these 20 job descriptions for the role '{job_title}': {all_descriptions[:3000]}
    Based on this, return a JSON object with:
    1. 'top_market_skills': A list of the 5 most demanded skills and their frequency (0-20).
    2. 'employment_stats': Estimated 'demand_score' (1-100) and 'avg_salary_index' (1-100).
    3. 'user_comparison': Compare these top 5 market skills with the user's skills: {user_skills}.
       Assign the user a 'proficiency_score' (0-100) for each of the top 5 skills.
    Return only valid JSON.
    """

    ai_res = ai_client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    clean_json = ai_res.text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean_json)
    except json.JSONDecodeError:
        raise Exception("Invalid JSON returned from AI")

@app.route('/get_workforce_graphs', methods=['GET'])
def get_graphs():
    user_id = request.args.get("user_id")
    job_title = request.args.get("job_title")
    location = request.args.get("location")
    try:
        analytics_data = get_market_analytics(job_title, location, user_id)
        return jsonify(analytics_data)
    except Exception as e:
        print(f"Analytics Error: {e}")
        return jsonify({"error": str(e)}), 500

# -------------------------------
# Run server
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)
