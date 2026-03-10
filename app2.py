import os
import pandas as pd
import spacy
import requests
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process
import re
app = Flask(__name__)
CORS(app)
nlp = spacy.load("en_core_web_md")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
URI = "mongodb+srv://coder_hack:Sankalp2026@cluster0.slx9flr.mongodb.net/?appName=Cluster0"
client = MongoClient(URI)
db = client['SkillSetuDB']
collection = db['users']
def load_esco():
    path = os.path.join(BASE_DIR, "esco_skills.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        df['preferredLabel'] = df['preferredLabel'].str.lower().str.strip()
        df = df[
            df['hiddenLabels'].str.contains("software|developer|programming|python|sql|javascript", case=False, na=False)
            | df['description'].str.contains("software|developer|programming|python|sql|javascript", case=False, na=False)
        ]
        return set(df['preferredLabel'].unique())
    return set()
def load_stackoverflow_skills(path):
    if not os.path.exists(path):
        return set()
    df = pd.read_csv(path)
    skills = set()
    for col in ["LanguageWorkedWith", "DatabaseWorkedWith", "WebframeWorkedWith"]:
        if col in df.columns:
            df[col].dropna().apply(lambda x: skills.update([s.strip().lower() for s in str(x).split(';')]))
    return skills
ESCO_SKILLS = load_esco()
MODERN_SKILLS = load_stackoverflow_skills("survey_results_public.csv")
EXTRA_SKILLS = {"django", "flask", "fastapi", "react", "angular", "vue.js", "svelte",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "postgresql", "mongodb", "redis", "graphql", "microservices","Generative AI","Prompt Engineering","AI model fine-turning","Cybersecurity","Cloud","AI"}
HYBRID_SKILLS = ESCO_SKILLS.union(MODERN_SKILLS)
HYBRID_SKILLS = HYBRID_SKILLS.union(EXTRA_SKILLS)
HYBRID_SKILLS = {s.lower() for s in HYBRID_SKILLS}
def match_skill(word, skills, threshold=70):
    match = process.extractOne(word, skills)
    if match:
        skill, score, _ = match
        return skill if score >= threshold else None
    return None
NORMALIZE = {
    "ai": "Artificial Intelligence",
    "cloud": "Cloud Computing",
    "r": "R programming",
    "c": "C programming",
    "c++": "C++",
    "go": "Go language",
    "js": "JavaScript",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "nlp": "Natural Language Processing"
}
def normalize_skill(skill):
    return NORMALIZE.get(skill.lower(), skill)
def extract_skills_dynamic(text, skills):
    if not text:
        return []
    doc = nlp(text.lower())
    found = set()
    tokens = [t.lemma_ for t in doc if not t.is_stop and t.is_alpha]
    for i, word in enumerate(tokens):
        # Single word
        skill = match_skill(word, skills)
        if skill and len(skill) > 1:
            if len(skill) <= 3:
                if skill in text.lower():
                    found.add(normalize_skill(skill))
            elif re.search(rf"\b{re.escape(skill)}\b", text.lower()):
                found.add(normalize_skill(skill))

        # Two-word phrase
        if i < len(tokens) - 1:
            phrase = f"{word} {tokens[i+1]}"
            skill = match_skill(phrase, skills)
            if skill and len(skill) > 1:
                if len(skill) <= 3:
                    if skill in text.lower():
                        found.add(normalize_skill(skill))
                elif re.search(rf"\b{re.escape(skill)}\b", text.lower()):
                    found.add(normalize_skill(skill))
        if i < len(tokens) - 2:
            phrase3 = f"{word} {tokens[i+1]} {tokens[i+2]}"
            skill = match_skill(phrase3, skills)
            if skill and len(skill) > 1:
                if len(skill) <= 3:
                    if skill in text.lower():
                        found.add(normalize_skill(skill))
                elif re.search(rf"\b{re.escape(skill)}\b", text.lower()):
                    found.add(normalize_skill(skill))
    return list(found)
def get_real_job_description(job_title,location):
    APP_ID = "2111fce7"
    APP_KEY = "c6bb8a813bb0bd60bd4c69df85d44e5b"
    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1?app_id={APP_ID}&app_key={APP_KEY}&results_per_page=1&what={job_title}&where={location}"
    try:
        r = requests.get(url,timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data.get('results'):
                return data['results'][0].get('description',"")
    except:
        pass
    return ""
def calculate_match_score(resume_text,job_desc):
    if not resume_text or not job_desc:
        return 0.0
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume_text, job_desc])
    sim = cosine_similarity(tfidf[0:1],tfidf[1:2])
    return round(float(sim[0][0])*100,2)
@app.route("/upload_resume",methods = ["POST"])
def upload_resume():
    try:
        user_id = request.form.get("user_id","Guest")
        job_title = request.form.get("job_title","Software Engineer")
        location = request.form.get("location","India")
        file = request.files.get("resume")
        if not file:
            return jsonify({"error":"No file uploaded"}),400
        with pdfplumber.open(file) as pdf:
            raw_resume = " ".join([page.extract_text() for page in pdf.pages if page.extract_text()])
            resume_skills = extract_skills_dynamic(raw_resume,HYBRID_SKILLS)
            real_desc = get_real_job_description(job_title,location)
            job_skills = extract_skills_dynamic(real_desc,HYBRID_SKILLS)
            missing_skills = list(set(job_skills)-set(resume_skills))
            match_score = calculate_match_score(raw_resume,real_desc)
            # safe_skill = str(missing_skills).replace(" ","+")
            roadmap = [{"skill": s,"yt":f"https://www.youtube.com/results?search_query=learn+{str(s).replace(' ','+')}+course","google":f"https://www.google.com/search?q=learn+{str(s).replace(' ','+')}"}for s in missing_skills]
            analysis = {"user_id":user_id,"job_title":job_title,"match_score":match_score,"resume_skills": resume_skills,  
            "job_skills": job_skills, "missing_skills":missing_skills,"job_description": real_desc,"roadmap":roadmap,"timestamp":datetime.now().isoformat()}
            collection.update_one({"user_id":user_id},{"$set":{"analysis":analysis}},upsert = True)
            analysis["summary"] = f"You match {match_score}% of the requirements for a {job_title} role in {location}. Focus on learning {', '.join(missing_skills[:3])} to improve your chances!"
            return jsonify({"status":"Success","data":analysis})
    except Exception as e:
        return jsonify({"error":str(e)}),500
if __name__ == "__main__":
    app.run(port = 5001,debug = True)