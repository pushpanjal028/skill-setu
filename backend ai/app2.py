from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import logging
from skillanalyzer import (
    get_ai_generated_required_skills,
    calculate_user_proficiency
)
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)
URI = os.getenv("MONGO_DB_URI")
if not URI:
    raise ValueError("MONGO_DB_URI not found in .env")
client = MongoClient(URI)
db = client['SkillSetuDB']
users_collection = db['Skills']
cache_collection = db['SkillsCache']
# users_collection.create_index("user_id", unique=True, sparse=True)
cache_collection.create_index("field", unique=True)
def get_required_skills(field):
    field = field.lower().strip()
    cached = cache_collection.find_one({"field": field})
    if cached:
        return cached["skills"]
    logging.info(f"AI CALL for field: {field}")
    skills = get_ai_generated_required_skills(field)
    cache_collection.update_one(
        {"field": field},
        {
            "$setOnInsert": {
                "skills": skills,
                "created_at": datetime.utcnow(),
                "source": "ai"
            }
        },
        upsert=True
    )
    return skills
def normalize_skills(skills):
    return [s.lower().strip() for s in skills]
def generate_analysis(known_skills, interest_field):
    required_skills = get_required_skills(interest_field)
    score, matched = calculate_user_proficiency(
        known_skills,
        required_skills
    )
    matched_set = set([m.lower() for m in matched])
    missing = [
        s['skill'] for s in required_skills
        if s['skill'].lower() not in matched_set
    ]
    roadmap = []
    for s in missing[:5]:
        query = s.replace(" ", "+")
        roadmap.append({
            "skill": s,
            "url": f"https://www.youtube.com/results?search_query={query}+tutorial"
        })
    return score, matched, roadmap
@app.route('/analyze_proficiency', methods=['POST'])
def analyze_proficiency():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid JSON"}), 400
        data = request.get_json()
        user_id = data.get("user_id")
        interest_field = data.get("interest_field", "Data Science")
        known_skills = normalize_skills(data.get("known_skills", []))
        education = data.get("education", "")
        experience_years = data.get("experience_years", 0)

        if not isinstance(known_skills, list):
            return jsonify({"error": "known_skills must be a list"}), 400
        score, matched, roadmap = generate_analysis(
            known_skills,
            interest_field
        )
        result_doc = {
            "user_id": user_id,
            "education": education,
            "experience_years": experience_years,
            "interest_field": interest_field,
            "known_skills": known_skills,
            "match_score": score,
            "matched_skills": matched,
            "roadmap": roadmap,
            "timestamp": datetime.utcnow()
        }
        if user_id:
            users_collection.update_one(
                {"user_id": user_id},
                {"$set": result_doc},
                upsert=True
            )
        else:
            users_collection.insert_one(result_doc)
        return jsonify({
            "status": "success",
            "match_score": f"{score}%",
            "matched_skills": matched,
            "roadmap": roadmap
        })
    except Exception as e:
        logging.error(str(e))
        return jsonify({"status": "error", "message": str(e)}), 500
@app.route('/update_skills', methods=['POST'])
def update_skills():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid JSON"}), 400
        data = request.get_json()
        user_id = data.get("user_id")
        new_skills = normalize_skills(data.get("new_skills", []))
        if not user_id:
            return jsonify({"error": "user_id required"}), 400
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        updated_skills = list(set(user.get("known_skills", []) + new_skills))
        score, matched, roadmap = generate_analysis(
            updated_skills,
            user.get("interest_field", "Data Science")
        )
        users_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "known_skills": updated_skills,
                    "match_score": score,
                    "matched_skills": matched,
                    "roadmap": roadmap,
                    "timestamp": datetime.utcnow()
                }
            }
        )
        return jsonify({
            "status": "success",
            "match_score": f"{score}%",
            "matched_skills": matched,
            "roadmap": roadmap
        })
    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": str(e)}), 500
@app.route('/update_interest', methods=['POST'])
def update_interest():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid JSON"}), 400
        data = request.get_json()
        user_id = data.get("user_id")
        new_interest = data.get("new_interest")
        if not user_id or not new_interest:
            return jsonify({"error": "user_id and new_interest required"}), 400
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        score, matched, roadmap = generate_analysis(
            user.get("known_skills", []),
            new_interest
        )
        users_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "interest_field": new_interest,
                    "match_score": score,
                    "matched_skills": matched,
                    "roadmap": roadmap,
                    "timestamp": datetime.utcnow()
                }
            }
        )
        return jsonify({
            "status": "success",
            "match_score": f"{score}%",
            "matched_skills": matched,
            "roadmap": roadmap
        })
    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": str(e)}), 500
@app.route('/get_workforce_graphs', methods=['GET'])
def get_workforce_graph():
    try:
        interest_field = request.args.get("job_title", "Data Science")

        required_skills = get_required_skills(interest_field)

        top_market_skills = [
            {"skill": s["skill"], "frequency": int(s["weight"] * 20)}
            for s in required_skills[:5]
        ]

        demand_score = int(sum(s["weight"] for s in required_skills[:5]) * 100)

        employment_stats = {
            "demand_score": demand_score,
            "avg_salary_index": int(demand_score * 0.8)
        }

        user_comparison = [
            {"skill": s["skill"], "proficiency_score": int(s["weight"] * 100)}
            for s in required_skills[:5]
        ]

        return jsonify({
            "top_market_skills": top_market_skills,
            "employment_stats": employment_stats,
            "user_comparison": user_comparison
        })

    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)