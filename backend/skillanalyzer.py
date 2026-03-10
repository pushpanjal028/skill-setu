import pandas as pd
import numpy as np
import re
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import datetime
from difflib import SequenceMatcher
from fuzzywuzzy import fuzz
from nltk.corpus import wordnet
app = Flask(__name__)
CORS(app)
URI = "mongodb+srv://coder_hack:Sankalp2026@cluster0.slx9flr.mongodb.net/?appName=Cluster0"
client = MongoClient(URI)
db = client['Skillsetu']
collection = db['users']
DOMAIN_KEYWORDS = {"Technology":["software","python","data","web","programming","ai","cloud","network","developer","ui&ux","code","system","hacking","security","cyber","ai","machine","java","script","cloud","network","sql","api"],"Business & Finance":["management","accounting","marketing","sales","finance","strategy","project"],"Arts & Design":["graphic","design","creative","media","music","art","drawing","ui","ux"],"Healthcare":["medical","health","nursing","clinical","therapy","patient"]}
def get_categorized_data():
    try:
        df = pd.read_csv("esco_skills.csv")
        df['skill_search'] = df['preferredLabel'].fillna('').astype(str).str.lower().str.strip()
        def assign_category(skill_text):
            for domain, keywords in DOMAIN_KEYWORDS.items():
                if any(kw in skill_text for kw in keywords):
                    return domain
            return "General"
        df['category'] = df['skill_search'].apply(assign_category)
        return df
    except Exception as e:
        print(f"CSV Load Error: {e}")
        return pd.DataFrame(columns = ['preferredLabel','category'])
def is_similar(a, b, threshold=80):
    partial = fuzz.partial_ratio(a.lower(), b.lower())
    token = fuzz.token_sort_ratio(a.lower(), b.lower())
    return partial >= threshold and token >= threshold
def expand_synonyms(word):
    synonyms = set()
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            synonyms.add(lemma.name().lower())
    return synonyms
@app.route('/get_skills_by_domain',methods = ['POST'])
def get_skills_by_domain():
    data = request.json
    selected_domain = data.get("domain","Technology")
    df = get_categorized_data()
    filtered = df[df['category'] == selected_domain]['preferredLabel'].unique().tolist()
    return jsonify({"status":"success","count":len(filtered),"skills":filtered[:50]})
@app.route('/analyze_skills',methods = ['POST'])
def analyze_skills():
    data = request.json 
    user_id = data.get("user_id","Guest")
    user_skills = [str(s).strip().lower() for s in data.get("skills",[])]
    manual_skills = data.get("skills",[])
    career_goal = data.get("career_goal","")
    experience = data.get("experience","")
    try:
        df = pd.read_csv("esco_skills.csv")
        all_skills = df['preferredLabel'].str.lower().tolist()
        vectorizer = TfidfVectorizer(analyzer = 'word',stop_words = 'english',ngram_range = (1,2))
        all_texts = [career_goal.lower()] + all_skills
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        scores = cosine_similarity(tfidf_matrix[0:1],tfidf_matrix[1:])[0]
        top_indices = scores.argsort()[-15:][::-1]
        required_skills = [all_skills[i] for i in top_indices] 
        matched = [s for s in manual_skills 
           if any(is_similar(s, r) for r in required_skills)]

        missing = [r for r in required_skills 
           if not any(is_similar(m, r) for m in user_skills)]

        raw_score = (len(matched)/len(required_skills)) *100 if required_skills else 0
        final_score = round(raw_score,2)
        roadmap = []
        for s in missing:
            safe_name = str(s).replace(" ","+")
            roadmap.append({"skill":s,"google":f"https://www.google.com/search?q=learn+{safe_name}","yt":f"https://www.youtube.com/results?search_query=learn+{safe_name}+course"})
        db_entry = {"user_id": user_id, "goal": career_goal,"score": final_score,"matched_skills":matched,"missing_skills":missing,"roadmap":roadmap,"timestamp":datetime.datetime.now().isoformat()}
        collection.update_one({"user_id":user_id},{"$set":db_entry},upsert=True)
        print("Required skills:", required_skills)
        print("Matched skills:", matched)
        print("Missing skills:", missing)

        return jsonify({"status": "success","data": db_entry})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}),500
if __name__ == "__main__":
   app.run(port=5001,debug = True)