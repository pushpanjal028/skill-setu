from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import google.genai as genai
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ MongoDB Setup
MONGO_URI = os.getenv("MONGO_DB_URI")
client_mongo = MongoClient(MONGO_URI)
db = client_mongo["BlueCollar"]
workers_collection = db["workers"]

# ✅ Gemini Setup
ai_client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))


@app.route("/")
def home():
    return "AI Career Guidance Backend Running 🚀"


# ✅ ADD WORKER
@app.route("/add_worker", methods=["POST"])
def add_worker():
    req = request.json

    worker = {
        "name": req.get("name"),
        "user_id": req.get("user_id"),   # 🔥 IMPORTANT
        "profession": req.get("profession"),
        "experience": int(req.get("experience", 0)),
        "location": req.get("location", "Not specified")
    }

    result = workers_collection.insert_one(worker)
    worker["_id"] = str(result.inserted_id)

    return jsonify({"message": "Worker added", "worker": worker})


# ✅ GET WORKERS
@app.route("/workers", methods=["GET"])
def get_worker():
    user_id = request.args.get("user_id")  # 🔥 IMPORTANT

    query = {}

    if user_id:
        query["user_id"] = user_id

    workers = list(workers_collection.find(query))

    for w in workers:
        w["_id"] = str(w["_id"])

    return jsonify(workers)
    profession = request.args.get("profession")
    location = request.args.get("location")
    name = request.args.get("name")
    email = request.args.get("email")  # 🔥 ADD THIS

    query = {}

    if profession:
        query["profession"] = {"$regex": profession, "$options": "i"}

    if location:
        query["location"] = {"$regex": location, "$options": "i"}

    if name:
        query["name"] = {"$regex": f"^{name}$", "$options": "i"}

    if email:
        query["email"] = email   # 🔥 BEST MATCH

    workers = list(workers_collection.find(query))

    for w in workers:
        w["_id"] = str(w["_id"])

    return jsonify(workers)



@app.route("/career_guidance", methods=["POST"])
def career_guidance():
    req = request.json

    profession = req.get("profession")
    experience = int(req.get("experience", 0))
    location = req.get("location", "Not specified")

    if not profession:
        return jsonify({"error": "Profession required"}), 400

    prompt = f"""
Return ONLY valid JSON. No explanation, no headings, no markdown.

Format:
{{
  "Career Paths": ["..."],
  "Business Opportunities": ["..."],
  "Recommended Digital Tools": ["..."],
  "Training Programs": ["..."]
}}

For a {profession} with {experience} years experience in {location}.
"""

    try:
        response = ai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()

        print("\n🔥 RAW GEMINI RESPONSE:\n", text)

        # ✅ CLEAN TEXT (REMOVE EXTRA STUFF)
        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:
            text = text[start:end + 1]

        print("\n✅ CLEAN JSON:\n", text)

        # ✅ PARSE JSON
        try:
            guidance_json = json.loads(text)
        except Exception as e:
            print("JSON ERROR:", e)

            # 🔥 FINAL FALLBACK (NEVER EMPTY)
            guidance_json = {
                "Career Paths": [text],
                "Business Opportunities": [text],
                "Recommended Digital Tools": [text],
                "Training Programs": [text]
            }

        return jsonify({
            "profession": profession,
            "experience": experience,
            "location": location,
            "guidance": guidance_json
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5002)