from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import uuid
import google.genai as genai
from pymongo import MongoClient
from bson.objectid import ObjectId
load_dotenv()
app = Flask(__name__)
CORS(app)
MONGO_URI = os.getenv("MONGO_DB_URI")
client_mongo = MongoClient(MONGO_URI)
db = client_mongo["BlueCollar"]
workers_collection = db["workers"]
ai_client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))
@app.route("/")
def home():
    return "AI Career Guidance Backend Running"
@app.route("/add_worker",methods=["POST"])
def add_worker():
    req = request.json
    if not req.get("name") or not req.get("profession"):
        return jsonify({"error":"Name and profession are required"}),400
    worker = {
        "name":req.get("name"),
        "profession":req.get("profession"),
        "experience":int(req.get("experience",0)),
        "location":req.get("location","Not specified")
    }
    result = workers_collection.insert_one(worker)
    worker["_id"]= str(result.inserted_id)
    return jsonify({"message":"Worker added successfully","worker":worker})
@app.route("/workers",methods=["GET"])
def get_worker():
    profession = request.args.get("profession")
    location = request.args.get("location")
    query = {}
    if profession:
        query["profession"] = {"$regex": f"^{profession}$","$options":"i"}
    if location:
        query["location"] = {"$regex":f"^{location}$","$options":"i"}
    workers = list(workers_collection.find(query))
    for w in workers:
        w["_id"] = str(w["_id"])
    return jsonify(workers)
@app.route("/career_guidance",methods=["POST"])
def career_guidance():
    req = request.json
    profession = req.get("profession")
    experience = int(req.get("experience",0))
    location = req.get("location","Not specified")
    if not profession:
        return jsonify({"error":"Profession is required"}),400
    prompt = (
        f"Provide structured career guidance for a {profession} with {experience} years"
        f"of experience in {location}. Include sections:"
        f"1.Career Paths, 2.Business Opportunities,3. Recommended Digital Tools,"
        f"4. Training Programs. Return JSON format only."
    )
    try:
        response = ai_client.models.generate_content(
            model = "gemini-2.5-flash",
            contents=prompt
        )
        guidance_text = getattr(response, "text",None)
        if not guidance_text and hasattr(response,"candidate"):
            guidance_text = response.candidates[0].content.parts[0].text
        guidance_text = guidance_text or {}
        import json
        try:
            guidance_json = json.loads(guidance_text)
        except json.JSONDecodeError:
            guidance_json = {"raw":guidance_text}
        return jsonify({
            "profession":profession,
            "experience":experience,
            "location":location,
            "guidance":guidance_json
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error":str(e)}),500
if __name__ == "__main__":
    app.run(debug=True, port=5000)