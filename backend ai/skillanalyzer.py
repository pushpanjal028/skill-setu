import google.genai as genai
from sentence_transformers import SentenceTransformer, util
import torch
client = genai.Client(api_key="AIzaSyC8OmEWPTtPbS7NMGtNJxOgUyWi6LUfpfI")
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
    user_skills_clean = [str(s).lower().strip() for s in known_skills]
    matched_skills = []
    user_points = 0
    total_possible_points = sum(s['weight'] for s in industry_required_skills)
    for req in industry_required_skills:
        req_name = req['skill'].lower().strip()
        is_match = False
        for us in user_skills_clean:
            if us in req_name or req_name in us:
                is_match = True
                break
        if is_match:
            matched_skills.append(req['skill'])
            user_points += req['weight']
    score_percentage = (user_points / total_possible_points) * 100 if total_possible_points > 0 else 0
    return round(score_percentage, 2), matched_skills