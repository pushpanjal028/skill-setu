from flask import Flask,request,jsonify
from flask_cors import CORS
import os
import requests
import google.genai as genai
from pymongo import MongoClient
from dotenv import load_dotenv
import textwrap
import random
load_dotenv()
app = Flask(__name__)
CORS(app)
ai_client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))
ADZUNA_ID = os.getenv("ADZUNA_ID")
ADZUNA_KEY = os.getenv("ADZUNA_KEY")
URI = os.getenv("MONGO_DB_URI")
client = MongoClient(URI) if URI else None
db = client['SkillSetuDB'] if client is not None else None
user_collection = db['Users'] if db is not None else None
def fetch_jobs(job_title,location =""):
    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
    params = {
        "app_id":ADZUNA_ID,
        "app_key":ADZUNA_KEY,
        "what":job_title,
        "where":location,
        "results_per_page":50,
        "content-type":"application/json"
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return []
    return response.json().get("results",[])
@app.route("/get_workforce_graphs",methods=["GET"])
def get_workforce_graphs():
    job_title = request.args.get("job_title")
    user_id = request.args.get("user_id")
    location = request.args.get("location","")
    if not job_title:
        return jsonify({"error":"job_title required"}),400
    jobs = fetch_jobs(job_title,location)
    job_texts = " ".join([job.get("description","")for job in jobs[:10]])
    prompt_skills = textwrap.dedent(f""" Extract top 10 technical skills for the following job descriptions. Job Descriptions:{job_texts} Return as JSON: {{"top_market_skills": [{{"skill":"skill_name","frequency":value}}....]}}""").strip()
    try:
        ai_res = ai_client.models.generate_content(
            model = "models/gemini-2.5-flash",
            contents=prompt_skills
        )
        raw_text = ai_res.text
        start = raw_text.find("{")
        end = raw_text.find("}") +1
        market_skills_data = raw_text[start:end]
        market_skills_json = eval(market_skills_data)
    except Exception as e:
        market_skills_json = {
            "top_market_skills":[
            {"skill":"Python","frequency":random.randit(10,50)},
            {"skill":"SQL","frequency":random.randit(5,30)},
            {"skill":"Machine Learning","frequency":random.randint(5,20)}
            ]
        }
    user_skills_json =[]
    if user_id and user_collection:
        user_doc = user_collection.find_one({"user_id":user_id})
        if user_doc and "skills" in user_doc:
            for skill in user_doc["skills"]:
                user_skills_json.append({"skill":skill,"proficiency_score":random.randint(50,100)})
    stats = {
        "employment_stats": {
            "demand_score":random.randint(60,100),
            "avg_salary_index":random.randint(50,100)
        }
    }
    return jsonify({
        "top_market_skills":market_skills_json.get("top_market_skills",[]),
        "user_comparison":user_skills_json,
        "employment_stats":stats["employment_stats"]
    })
@app.route("/add_user_skills",methods=["POST"])
def add_user_skills():
    data = request.json
    user_id = data.get("user_id")
    skills = data.get("skills",[])
    if not user_id or not skills:
        return jsonify({"error":"user_id and skills required"}),400
    if user_collection:
        user_collection.update_one(
            {"user_id":user_id},
            {"$set":{"skills":skills}},
            upsert=True
        ) 
    return jsonify({"status":"success"})
if __name__ == "__main__":
    app.run(debug=True, port=5003)