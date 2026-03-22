
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import logging
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# MongoDB Connection
mongo_uri = os.getenv("MONGO_DB_URI")
client = MongoClient(mongo_uri)

skill_db = client["SkillSetuDB"]
skills_collection = skill_db["Skills"]

blue_db = client["BlueCollar"]
workers_collection = blue_db["workers"]


# ✅ FIXED: Changed POST → GET (BEST PRACTICE)
@app.route('/profile', methods=['GET'])
def get_profile():
    try:
        # ✅ GET 
        email = request.args.get("email")

        if not email:
            return jsonify({"error": "email required"}), 400

        # ✅ Find user
        skill_doc = skills_collection.find_one({"email": email}, {"_id": 0})

        # ✅ If no data found
        if not skill_doc:
            return jsonify({
                "status": "success",
                "user": {
                    "name": email.split("@")[0],
                    "email": email
                },
                "jobData": [],
                "skills": [],
                "skillAnalysis": [],
                "blueCollar": {"jobs": []},
                "message": "No activity found"
            })

        # ✅ User info
        name = skill_doc.get("name")

        if not name or name.strip().lower() == "user":
           name = skill_doc.get("email").split("@")[0]
        user_data = {
            "name": name,
            "email": skill_doc.get("email")
        }

        # ✅ Job Data
        job_data = []
        for entry in skill_doc.get("search_history", []):
            for job in entry.get("results", []):
                job_data.append({
                    "title": job.get("title"),
                    "company": job.get("company"),
                    "missingSkills": [
                        s.get("skill_name")
                        for s in job.get("missing_skills_data", [])
                    ],
                    "apply_link": job.get("apply_link")
                })

        # ✅ FIXED: correct field name
        skills = skill_doc.get("known_skills", [])

        # ✅ FIXED: safe skill analysis
        skill_analysis = []
        if skill_doc.get("match_score") is not None:
            skill_analysis = skill_doc.get("matched_skills", [])

        # ✅ Blue Collar Jobs
        blue_collar_jobs = []
        interest = skill_doc.get("interest_field") 
        
        if skill_doc.get("interest_field"):
            field = skill_doc.get("interest_field")

            workers = list(workers_collection.find({
                "profession": {"$regex": field, "$options": "i"}  # ✅ FIXED typo
            }).limit(5))

            blue_collar_jobs = [
                {
                    "name": w.get("name"),
                    "profession": w.get("profession"),
                    "experience": w.get("experience"),
                    "location": w.get("location")
                }
                for w in workers
            ]

        return jsonify({
            "status": "success",
            "user": user_data,
            "jobData": job_data,
            "skills": skills,
            "skillAnalysis": skill_analysis,
            "blueCollar": {
                "jobs": blue_collar_jobs
            },
            "message": "Profile loaded"
        })

    except Exception as e:
        logging.error(f"Profile Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5004)