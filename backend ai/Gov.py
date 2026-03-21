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
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['SkillSetDB']
collection = db['users']

@app.route('/download-csv', methods=['GET'])
def download_csv():
    try:
        # 1. Fetch data from Atlas
        data = list(collection.find())
        if not data:
            return jsonify({"error": "No data found"}), 404

        # 2. Convert to DataFrame and clean
        df = pd.DataFrame(data)
        if '_id' in df.columns:
            df.drop(columns=['_id'], inplace=True)

        # 3. Create a "Buffer" (Temporary memory storage)
        # This avoids saving a physical file on your computer/server
        buffer = io.BytesIO()
        df.to_csv(buffer, index=False, encoding='utf-8')
        buffer.seek(0)

        # 4. Send the file to the browser
        return send_file(
            buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name='sankalp_student_report.csv'
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)