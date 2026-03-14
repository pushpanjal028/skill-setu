from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
import uuid
import google.genai as genai

# Load variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app) # Crucial for your React frontend

DATA_FILE = "workers.json"

# Initialize the modern Gemini Client
client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))

# Utility functions
def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/")
def home():
    return "AI Career Guidance Backend Running"

@app.route("/add_worker", methods=["POST"])
def add_worker():
    data = load_data()
    req = request.json

    if not req.get("name") or not req.get("profession"):
        return jsonify({"error": "Name and profession are required"}), 400

    worker = {
        "id": str(uuid.uuid4()),
        "name": req.get("name"),
        "profession": req.get("profession"),
        "experience": req.get("experience"),
        "location": req.get("location")
    }

    data.append(worker)
    save_data(data)
    return jsonify({"message": "Worker added successfully", "worker": worker})

@app.route("/workers", methods=["GET"])
def get_workers():
    data = load_data()
    profession = request.args.get("profession")
    location = request.args.get("location")

    if profession:
        data = [w for w in data if w["profession"].lower() == profession.lower()]
    if location:
        data = [w for w in data if w["location"].lower() == location.lower()]

    return jsonify(data)


@app.route("/career_guidance", methods=["POST"])
def career_guidance():
    req = request.json
    profession = req.get("profession")
    experience = req.get("experience", 0)
    location = req.get("location", "Not specified")

    prompt = (
        f"Suggest career paths, business opportunities, digital tools, "
        f"and training programs for a {profession} with {experience} years "
        f"of experience in {location}. Provide practical and modern recommendations."
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Safely extract text
        guidance_text = ""
        if hasattr(response, "text"):
            guidance_text = response.text
        elif hasattr(response, "candidates"):
            # Some SDK versions return nested candidates
            guidance_text = response.candidates[0].content.parts[0].text
        else:
            guidance_text = str(response)

        return jsonify({
            "profession": profession,
            "experience": experience,
            "location": location,
            "guidance": guidance_text
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)