import google.genai as genai
from sentence_transformers import SentenceTransformer, util
import torch
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))

model_bert = SentenceTransformer('all-MiniLM-L6-v2')
def get_ai_generated_required_skills(interest_field):
    prompt = (
        f"Act as a professional career counselor and industry expert. "
        f"For the career field of '{interest_field}' list exactly 15 essential skills "
        f"that a candidate must have to be employable in 2026. "
        f"IMPORTANT: Provide ONLY the skill names separated by commas."
    )
    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        
        print("DEBUG Gemini response:", response)
        text_out = getattr(response, "text", None)
        if not text_out and hasattr(response, "result"):
            candidates = getattr(response.result, "candidates", [])
            if candidates and candidates[0].content.parts:
                text_out = candidates[0].content.parts[0].text
        if not text_out:
            print("DEBUG: No text found in Gemini response")
            return []
        if text_out:
         text_out = text_out.replace("\n", " ").replace("Skills:", "")
    # remove parentheses and "e.g." fragments
         text_out = text_out.replace("(", "").replace(")", "").replace("e.g.", "")
         ai_skills_list = [s.strip().lower() for s in text_out.split(",") if s.strip()]

        ai_skills_list = [s.strip() for s in text_out.split(",") if s.strip()]
        print(f"DEBUG: Gemini suggested these skills: {ai_skills_list}")
        goal_embeddings = model_bert.encode(interest_field, convert_to_tensor=True)
        skill_embeddings = model_bert.encode(ai_skills_list, convert_to_tensor=True)
        cosine_scores = util.cos_sim(goal_embeddings, skill_embeddings)[0]
        required_skills = []
        for i, skill in enumerate(ai_skills_list):
            required_skills.append({
                "skill": skill,
                "weight": float(cosine_scores[i])
            })
        return required_skills
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return []
def calculate_user_proficiency(known_skills, industry_required_skills):
    if not industry_required_skills:
        return 0.0, []

    matched_skills = []
    user_points = 0
    total_possible_points = sum(s['weight'] for s in industry_required_skills)

    for req in industry_required_skills:
        req_name = req['skill'].lower().strip()
        req_embedding = model_bert.encode(req_name, convert_to_tensor=True)

        for us in known_skills:
            us_clean = us.lower().strip()
            us_embedding = model_bert.encode(us_clean, convert_to_tensor=True)

            # semantic similarity instead of substring
            sim = util.cos_sim(us_embedding, req_embedding).item()
            if sim > 0.7:  # threshold for match
                matched_skills.append(req['skill'])
                user_points += req['weight']
                break

    score_percentage = (user_points / total_possible_points) * 100 if total_possible_points > 0 else 0
    return round(score_percentage, 2), matched_skills
