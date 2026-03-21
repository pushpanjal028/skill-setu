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
mongo_uri = os.getenv("MONGO_DB_URI")
client = MongoClient(mongo_uri)
skill_db = client["SkillSetuDB"]
skills_collection = skill_db["Skills"]
blue_db = client["BlueCollar"]
workers_collection = blue_db["workers"]
@app.route('/profile', methods=['POST'])
def get_profile():
    try:
        if not request.is_json:
            return jsonify({"error":"Invalid JSON"}),400
        data = request.get_json()
        user_id = data.get("user_id")
        email = data.get("email")
        if not user_id and not email:
            return jsonify({"error":"user_id or email required"}),400
        query = {"user_id":user_id} if user_id else{"email":email}
        skill_doc = skills_collection.find_one(query,{"_id":0})
        if not skill_doc:
            return jsonify({
                "status":"success",
                "user":{
                    "name":"User",
                    "email":email
                },
                "jobData":[],
                "skills":[],
                "skillAnalysis":None,
                "blueCollar":{"jobs":[]},
                "message":"No activity found"
            })
        user_data = {
            "name": skill_doc.get("name"),
            "email":skill_doc.get("email")
        }
        job_data = []
        for entry in skill_doc.get("search_history",[]):
            for job in entry.get("results",[]):
                job_data.append({
                    "title":job.get("title"),
                    "comapny":job.get("company"),
                    "missingSkills":[
                        s.get("skill_name")
                        for s in job.get("missing_skills_data",[])
                    ],
                    "apply_link":job.get("apply_link")
                })
        skills = skill_doc.get("know_skills",[])
        skill_analysis = None
        if skill_doc.get("match_score") is not None:
            skill_analysis = {
                "score": skill_doc.get("match_score"),
                "matched_skills":skill_doc("matched_skills",[]),
                "roadmap":skill_doc.get("roadmap",[])
            }
        blue_collar_jobs = []
        if skill_doc.get("interest_field"):
            field = skill_doc.get("interest_field")
            workers = list(workers_collection.find({
                "profession":{"$regex":field,"$option":"i"}
            }).limit(5))
            blue_collar_jobs = [
                {
                    "name":w.get("name"),
                    "profession":w.get("profession"),
                    "experience":w.get("experience"),
                    "location":w.get("location")
                }
                for w in workers
            ]
        return jsonify({
            "status":"success",
            "user":user_data,
            "jobData":job_data,
            "skills":skills,
            "skillAnalysis": skill_analysis,
            "blueCollar":{
                "jobs":blue_collar_jobs
            },
            "message":"Profile loaded"
        })
    except Exception as e:
        logging.error(f"Profile Error: {e}")
        return jsonify({"error":str(e)}),500
if __name__ == "__main__":
    app.run(debug=True,port=5004)