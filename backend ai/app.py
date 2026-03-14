from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from skillanalyzer import get_ai_generated_required_skills, calculate_user_proficiency
from datetime import datetime
app = Flask(__name__)
CORS(app)
URI = "mongodb+srv://coder_hack:Sankalp2026@cluster0.slx9flr.mongodb.net/?appName=Cluster0"
client = MongoClient(URI)
db = client['SkillSetuDB']
collection = db['Skills']
@app.route('/analyze_proficiency', methods=['POST'])
def analyze_proficiency():
    try:
        data = request.json
        user_id = data.get("user_id", None) 
        interest_field = data.get("interest_field", "Data Science")
        known_skills = data.get("known_skills", [])
        education = data.get("education", "")
        experience_years = data.get("experience_years", 0)
        required_skills = get_ai_generated_required_skills(interest_field)
        score, matched = calculate_user_proficiency(known_skills, required_skills)
        missing = [s['skill'] for s in required_skills if s['skill'] not in matched]
        roadmap = []
        for s in missing[:5]:
            query = str(s).replace(" ", "+")
            roadmap.append({
                "skill": s,
                "url": f"https://www.youtube.com/results?search_query=learn+{query}"
            })
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
            collection.update_one({"user_id": user_id}, {"$set": result_doc}, upsert=True)
        else:
            collection.insert_one(result_doc)
        return jsonify({
            "status": "success",
            "match_score": f"{score}%",
            "matched_skills": matched,
            "roadmap": roadmap
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
@app.route('/update_skills', methods=['POST'])
def update_skills():
    """Endpoint to add new skills to an existing user profile"""
    try:
        data = request.json
        user_id = data.get("user_id")
        new_skills = data.get("new_skills", [])
        if not user_id:
            return jsonify({"status": "error", "message": "user_id required"}), 400
        user = collection.find_one({"user_id": user_id})
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        updated_skills = list(set(user.get("known_skills", []) + new_skills))
        required_skills = get_ai_generated_required_skills(user.get("interest_field", "Data Science"))
        score, matched = calculate_user_proficiency(updated_skills, required_skills)
        missing = [s['skill'] for s in required_skills if s['skill'] not in matched]
        roadmap = []
        for s in missing[:5]:
            query = str(s).replace(" ", "+")
            roadmap.append({
                "skill": s,
                "url": f"https://www.youtube.com/results?search_query=learn+{query}"
            })
        collection.update_one(
            {"user_id": user_id},
            {"$set": {
                "known_skills": updated_skills,
                "match_score": score,
                "matched_skills": matched,
                "roadmap": roadmap,
                "timestamp": datetime.utcnow()
            }}
        )
        return jsonify({
            "status": "success",
            "match_score": f"{score}%",
            "matched_skills": matched,
            "roadmap": roadmap
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

        
@app.route('/update_interest', methods=['POST'])
def update_interest():
    """Endpoint to change interest field for a user"""
    try:
        data = request.json
        user_id = data.get("user_id")
        new_interest = data.get("new_interest")
        if not user_id or not new_interest:
            return jsonify({"status": "error", "message": "user_id and new_interest required"}), 400
        user = collection.find_one({"user_id": user_id})
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        required_skills = get_ai_generated_required_skills(new_interest)
        score, matched = calculate_user_proficiency(user.get("known_skills", []), required_skills)
        missing = [s['skill'] for s in required_skills if s['skill'] not in matched]
        roadmap = []
        for s in missing[:5]:
            query = str(s).replace(" ", "+")
            roadmap.append({
                "skill": s,
                "url": f"https://www.youtube.com/results?search_query=learn+{query}"
            })
        collection.update_one(
            {"user_id": user_id},
            {"$set": {
                "interest_field": new_interest,
                "match_score": score,
                "matched_skills": matched,
                "roadmap": roadmap,
                "timestamp": datetime.utcnow()
            }}
        )
        return jsonify({
            "status": "success",
            "match_score": f"{score}%",
            "matched_skills": matched,
            "roadmap": roadmap
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
# ------------------------------
# Workforce Graph Route
# ------------------------------
@app.route('/get_workforce_graphs', methods=['GET'])
def get_workforce_graphs():

    try:
        interest_field = request.args.get("job_title", "Data Science")

        required_skills = get_ai_generated_required_skills(interest_field)

        top_market_skills = []

        for s in required_skills[:5]:
            top_market_skills.append({
                "skill": s["skill"],
                "frequency": int(s["weight"] * 20)
            })

        employment_stats = {
            "demand_score": 80,
            "avg_salary_index": 70
        }

        user_comparison = []

        for s in required_skills[:5]:
            user_comparison.append({
                "skill": s["skill"],
                "proficiency_score": int(s["weight"] * 100)
            })

        return jsonify({
            "top_market_skills": top_market_skills,
            "employment_stats": employment_stats,
            "user_comparison": user_comparison
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------------------
# Run Server
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)
