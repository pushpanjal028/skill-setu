from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS
import fitz
import requests
import google.genai as genai
from pymongo import MongoClient
from datetime import datetime, timezone
import logging

# -------------------- INIT --------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

# Gemini client
ai_client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))

# Adzuna
ADZUNA_ID = os.getenv("ADZUNA_ID")
ADZUNA_KEY = os.getenv("ADZUNA_KEY")

# MongoDB
URI = os.getenv("Mongo_DB_URI")
client = MongoClient(URI)
db = client['SkillSetuDB']

# -------------------- HELPERS --------------------
def extract_resume_text(pdf_file):
    """Extract text from PDF safely."""
    text = ""
    file_bytes = pdf_file.read()

    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()

    return text


def analyze_with_gemini(prompt):
    """Robust Gemini response parser."""
    try:
        ai_res = ai_client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )

        text_out = getattr(ai_res, "text", None)

        if not text_out:
            text_out = ""
            for candidate in getattr(ai_res, "candidates", []):
                for part in getattr(candidate.content, "parts", []):
                    if hasattr(part, "text"):
                        text_out += part.text

        skills = [
            s.strip() for s in text_out.replace("\n", " ").split(",") if s.strip()
        ]

        return list(set(skills))  # remove duplicates

    except Exception as e:
        logging.error(f"Gemini error: {e}")
        return []


# -------------------- ROUTES --------------------
@app.route('/analyze_jobs_with_resume', methods=['POST'])
def analyze_jobs_with_resume():
    try:
        # 1. Input
        user_id = request.form.get("user_id")
        job_title = request.form.get("job_title")
        location = request.form.get("location")
        job_type = request.form.get("job_type", "full_time")
        resume_file = request.files.get("resume")

        # Validation
        if not all([user_id, job_title, location, resume_file]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        if len(job_title) > 100 or len(location) > 100:
            return jsonify({"status": "error", "message": "Invalid input"}), 400

        # 2. Resume Text
        resume_text = extract_resume_text(resume_file)
        resume_excerpt = " ".join(resume_text.split()[:150])

        # 3. Job API
        is_full_time = 1 if job_type == "full_time" else 0
        adzuna_url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

        params = {
            'app_id': ADZUNA_ID,
            'app_key': ADZUNA_KEY,
            'results_per_page': 3,
            'what': job_title,
            'where': location,
            'full_time': is_full_time,
        }

        job_response = requests.get(adzuna_url, params=params, timeout=5)

        if job_response.status_code != 200:
            return jsonify({"status": "error", "message": "Job API failed"}), 500

        raw_jobs = job_response.json().get('results', [])

        analyzed_jobs = []

        # 4. Process Jobs
        for job in raw_jobs:
            job_desc = job.get('description', '')

            prompt = f"""
You are an expert career advisor.

Compare the resume and job description.

List ONLY the technical skills that are missing from the resume but required for the job.

Rules:
- Output only a comma-separated list
- No explanations
- No extra text

Resume:
{resume_excerpt}

Job Description:
{job_desc}
"""

            missing_skills = analyze_with_gemini(prompt)

            # 5. YouTube links
            skill_links = []
            for skill in missing_skills:
                query = f"{skill} tutorial for beginners".replace(" ", "+")
                yt_link = f"https://www.youtube.com/results?search_query={query}"

                skill_links.append({
                    "skill_name": skill,
                    "tutorial_url": yt_link
                })

            analyzed_jobs.append({
                "title": job.get('title'),
                "company": job.get('company', {}).get('display_name'),
                "description": job_desc[:200] + "...",
                "missing_skills_data": skill_links,
                "apply_link": job.get('redirect_url')
            })

        # 6. Save to MongoDB (limit history)
        db.Skills.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "last_active": datetime.now(timezone.utc),
                    "latest_input": {
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
        logging.error(f"Server error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/get_saved_jobs', methods=['GET'])
def get_saved_jobs():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400

    user_doc = db["Skills"].find_one({"user_id": user_id}, {"_id": 0})

    if not user_doc:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify({
        "status": "success",
        "search_history": user_doc.get("search_history", [])
    })


# -------------------- RUN --------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)