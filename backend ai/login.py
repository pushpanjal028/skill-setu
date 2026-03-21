from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from flask_cors import CORS
import os


app = Flask(__name__)

# ✅ Proper CORS
CORS(app)
client = MongoClient(os.getenv("MONGO_DB_URI"))
db = client['SkillSetuDB']


@app.route("/profile", methods=["POST"])
def profile():
    try:
        data = request.get_json(force=True)  # ✅ force parse

        email = data.get("email")

        if not email:
            return jsonify({"error": "Email required"}), 400

        user = db.users.find_one({"email": email})

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user": {
                "name": user.get("name"),
                "email": user.get("email")
            },
            "jobData": user.get("jobData", []),
            "skills": user.get("skills", []),
            "skillAnalysis": user.get("skillAnalysis", {}),
            "blueCollar": user.get("blueCollar", {})
        }), 200

    except Exception as e:
        print("ERROR:", e)   # 🔥 see error in terminal
        return jsonify({"error": "Server error"}), 500