import os
import io
import pandas as pd
from flask import Flask, send_file, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS # Needed if your React frontend is on a different port

load_dotenv()
app = Flask(__name__)
CORS(app) # Allows your frontend to talk to this backend

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_DB_URI")
client = MongoClient(MONGO_URI)
db = client['SkillSetuDB']
collection = db['users']




@app.route('/download-csv', methods=['GET'])
def download_csv():
    try:
        data = list(collection.find())

        if not data:
            return jsonify({"error": "No data found"}), 404

        df = pd.DataFrame(data)

        if "_id" in df.columns:
            df.drop(columns=["_id"], inplace=True)

        buffer = io.BytesIO()
        df.to_csv(buffer, index=False, encoding='utf-8')
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name='sankalp_student_report.csv'
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Server Running on 5005 ✅"

if __name__ == "__main__":
    app.run(port=5005, debug=True)