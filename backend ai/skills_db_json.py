import json
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
client = MongoClient(os.getenv("MONGO_DB_URI"))
db = client["SkillSetuDB"]
collection = db["SkillCache"]
with open("skill_db.json") as f:
  data = json.load(f)
collection.insert_many(data)
print("Skills database inserted successfully")