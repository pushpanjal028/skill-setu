# Skill Setu 🚀
### AI-Powered Career Guidance System

**🏆 Top 40 Finalist at SANKALP Hackathon 2026 (MNNIT Prayagraj)**

Skill Setu is an end-to-end employability engine designed to bridge the gap between localized workforce skills and real-time industry demands. The platform parses user resumes, identifies skill deficiencies, and dynamically generates region-specific job opportunities and career recommendations.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, HTML5, JAVASCRIPT
- **Backend:** Python (Flask), Python Libraries - PYMONGO, PYMUFPDF, FLASK CORS
- **Database:** MongoDB Atlas
- **AI/ML:** Gemini API (for skill-gap analysis and resume processing), SENTENCE TRANSFORMERS, COSINE SIMILARITY, TORCH, HUGGING FACE
- **APIs:** Adzuna API (for live, region-specific job opportunities)

---

## ✨ Key Features

- **Resume Parsing & Skill-Gap Analysis:** Extracts skills from PDF resumes and maps them against current industry requirements using Gemini.
- **Dynamic Recommendations:** Generates highly targeted skill-upgradation paths based on identified professional deficiencies.
- **Localized Job Mapping:** Fetches real-time localized job openings using external API integration.

---

## 🏗️ System Architecture & API Endpoints

The backend is built as a scalable RESTful service handling structured JSON payloads.

### Key API Endpoints:
- `POST /api/upload-resume` - Handles PDF processing and skill extraction.
- `GET /api/jobs?region=<location>` - Fetches real-time regional job data from Adzuna.
- `POST /api/recommendations` - Generates AI-driven career and skill roadmaps.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- MongoDB installed locally or MongoDB Atlas URI

### Installation & Setup

1. **Clone the repository:**
 ```bash
   git clone https://github.com/pushpanjal028/skill-setu.git
   cd skill-setu
```
2.Create a Virtual Environment:
  ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
```
3. Install Dependencies:
   ```bash
   pip install -r requirements.txt
   ```

👥 Contributors
Aastha Srivastava - Backend Developer & AI Integration

Pushpanjal Shukla - Core Developer / Repo Owner / Frontend Integration & UI Development

Ananya Yadav - Product Pitching, Presentation Design & Component Support
