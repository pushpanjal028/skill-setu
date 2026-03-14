from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import requests
import google.genai as genai
from pymongo import MongoClient
from datetime import datetime
app = Flask(__name__)
CORS(app)
ai_client = genai.Client(api_key="AIzaSyDk3-bPVrlj0zC1gqHO1m0Vq0DU9S6X9tY")
ADZUNA_ID = "2111fce7"
ADZUNA_KEY = "0506a66df98a15f338bb27892ec294d5"
URI = "mongodb+srv://coder_hack:Sankalp2026@cluster0.slx9flr.mongodb.net/?appName=Cluster0"
client = MongoClient(URI)
db = client['SkillSetuDB']
collection = db['Skills']
def extract_resume_text(pdf_file):
    text = ""
    with fitz.open(stream=pdf_file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text
@app.route('/analyze_jobs_with_resume', methods = ['POST'])
def analyze_jobs():
    try:
        user_id = request.form.get("user_id")
        job_title = request.form.get("job_title")
        location = request.form.get("location")
        job_type = request.form.get("job_type", "full_time")
        resume_file = request.files.get("resume")
        if not all([user_id,job_title,location,resume_file]):
            return jsonify({"status": "error","message":"Missing required fields"}),400
        resume_text = extract_resume_text(resume_file)
        is_full_time = 1 if job_type == "full_time" else 0
        adzuna_url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            'app_id': "2111fce7",
            'app_key': "ecabe773bf8e94f9b07aed606f2c459b",
            'results_per_page':5,
            'what': job_title,
            'where': location,
            'full_time': is_full_time,
            'content-type':'application/json'
        }
        job_response = requests.get(adzuna_url, params=params)
        if job_response.status_code != 200:
            return jsonify({"status":"error","message":"Adzuna API Error"}),500
        raw_jobs = job_response.json().get('results',[])
        analyzed_jobs = []
        for job in raw_jobs:
            job_desc = job.get('description','')
            prompt = f""" Identify key technical skills missing in this Resume for this Job. Resume: {resume_text[:1500]} Job Description: {job_desc} Return ONLY the missing skill names seperated by commas"""
            ai_res = ai_client.models.generate_content(
             model="models/gemini-2.5-flash",
             contents=prompt
            )
            missing_skills = [s.strip() for s in ai_res.text.split(",") if s.strip()]
            skill_links = []
            for skill in missing_skills:
                query = f"Learn {skill} for beginners tutorial 2026".replace(" ","+")
                yt_link = f"https://www.youtube.com/results?search_query={query}"
                skill_links.append({"skill_name":skill,"tutorial_url":yt_link})
            analyzed_jobs.append({"title": job.get('title'),"company":job.get('company',{}).get('display_name'),"description":job_desc[:200]+ "...","missing_skills_data":skill_links,"apply_link":job.get('redirect_url')
            })
        job_analysis_collection = db["Skills"]
        filter_criteria = {"user_id":user_id}
        update_data = {
            "$set" : {
                "last_active": datetime.now(), "latest_input":{
                    "job_title": job_title,"location":location,"job_type":job_type
                },"current_resume_text": resume_text[:1000]
            },"$push": {"search_history":{
                "timestamp":datetime.now(), "job_title": job_title,"results": analyzed_jobs
            }}
        }
        job_analysis_collection.update_one(filter_criteria, update_data, upsert=True)
        # record = {
        #         "user_id": user_id,"timestamp": datetime.now(),"input_criteria":{
        #             "job_title": job_title, "location": location,"job_type":job_type
        #         },
        #         "job_results": analyzed_jobs
        #     }
        return jsonify({"status":"success","user_id":user_id,"jobs_found":len(analyzed_jobs),"jobs":analyzed_jobs})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}),500
@app.route('/get_saved_jobs', methods=['GET'])
def get_saved_jobs():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"status": "error", "message": "user_id required"}), 400
    job_analysis_collection = db["Skills"]
    user_doc = job_analysis_collection.find_one({"user_id": user_id}, {"_id": 0})
    if not user_doc:
        return jsonify({"status": "error", "message": "User not found"}), 404
    return jsonify({"status": "success", "search_history": user_doc.get("search_history", [])})
if __name__ == "__main__":
    app.run(debug=True,port=5001)