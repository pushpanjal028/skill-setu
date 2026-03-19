import google.genai as genai
from sentence_transformers import SentenceTransformer, util
import os
from dotenv import load_dotenv
from functools import lru_cache
import logging
load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_KEY"))
model_bert = SentenceTransformer('all-MiniLM-L6-v2')
logging.basicConfig(level=logging.INFO)
@lru_cache(maxsize=50)
def get_ai_generated_required_skills(interest_field):
    prompt = (
        f"Act as professional career counselor."
        f"For '{interest_field}', list exactly 15 essential skills."
        f"- Only comma-separated skill names\n"
        f"- No numbering\n"
        f"- No explanation\n"
        f"- No extra text\n"
        )
    try:
        response = client.models.generate_content(
            model = "models/gemini-2.5-flash",
            contents = prompt
        )
        text_out = getattr(response, "text",None)
        if not text_out and hasattr(response, "result"):
            candidates = response.candidates
            if candidates and candidates[0].content.parts:
                text_out = candidates[0].content.parts[0].text
        if not text_out:
            logging.error("No text returned from Gemini")
            return[]
        text_out = (
            text_out.replace("\n"," ")
            .replace("Skills:","")
            .replace("(","")
            .replace(")","")
            .replace("e.g.","")
        )
        ai_skills_list = [
            s.strip().lower()
            for s in text_out.split(",")
            if s.strip()
            ]
        ai_skills_list = list(set(ai_skills_list))
        if not ai_skills_list:
            return [
                    {"skill": "communication", "weight": 0.8},
                    {"skill": "problem solving", "weight": 0.9}
                ]
        logging.info(f"AI Skills for {interest_field}: {ai_skills_list}")
        goal_embedding = model_bert.encode(interest_field, convert_to_tensor=True)
        skill_embeddings = model_bert.encode(ai_skills_list, convert_to_tensor=True)
        cosine_scores = util.cos_sim(goal_embedding, skill_embeddings)[0]
        required_skills = [
            {
                "skill":skill,
                "weight": max(0,float(cosine_scores[i]))
            }
            for i, skill in enumerate(ai_skills_list)
        ]
        return required_skills
    except Exception as e:
        logging.error(f"AI Generation Error:{e}")
        return []
def calculate_user_proficiency(known_skills,industry_required_skills):
    if not known_skills:
     return 0.0, []
    if not industry_required_skills:
        return 0.0,[]
    known_skills_clean = [s.lower().strip() for s in known_skills]
    known_embeddings = model_bert.encode(known_skills_clean,convert_to_tensor = True)
    required_names = [s['skill'].lower().strip() for s in industry_required_skills]
    required_embeddings = model_bert.encode(required_names, convert_to_tensor = True)
    similarity_matrix = util.cos_sim(known_embeddings, required_embeddings)
    matched_skills = []
    user_points = 0
    total_possible_points = sum(s['weight'] for s in industry_required_skills)
    for j, req in enumerate(industry_required_skills):
        for i in range(len(known_skills_clean)):
            sim = similarity_matrix[i][j].item()
            if sim>0.5:
                matched_skills.append(req['skill'])
                user_points += req['weight']
                break
    score_percentage = (
        (user_points/total_possible_points)*100
        if total_possible_points>0 else 0
    )
    return round(score_percentage,2),matched_skills