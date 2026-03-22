
import React, { useState } from "react";
import axios from "axios";

const SkillAnalysis = () => {

  const [interest, setInterest] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const email = localStorage.getItem("email"); // ✅ GET EMAIL

  try {
    const response = await axios.post(
      "http://localhost:5000/analyze_proficiency",
      {
        email: email, // ✅ SEND EMAIL
        name: name,   // ✅ SEND NAME
        interest_field: interest,
        known_skills: skills.split(",").map(s => s.trim()),
        education: education,
        experience_years: Number(experience)
      }
    );

    setResult(response.data);

    // ✅ Save locally for quick UI
    localStorage.setItem("skillAnalysis", JSON.stringify(response.data));

  } catch (error) {
    console.error(error);
    alert("API Error");
  }

  setLoading(false);
};
  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          🚀 Skill Setu – AI Skill Analyzer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Enter your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border p-3 mb-4 rounded"
          />

          <input
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Interest Field (Ex: Data Science)"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            required
          />

          <input
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Known Skills (Ex: python, react, node)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <input
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Education (Ex: B.Tech CSE)"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Experience (Years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? "Analyzing..." : "Analyze Skills"}
          </button>

        </form>

        {result && (

          <div className="mt-8 grid md:grid-cols-2 gap-10 justify-end p-6">

            <div className="bg-blue-50 p-4 rounded-lg mb-4">

              <h2 className="text-xl font-semibold text-blue-700">
                🎯 Match Score: {result.match_score}
              </h2>

            </div>

            <div className="mb-4">

              <h3 className="font-semibold text-lg mb-2">
                ✅ Matched Skills
              </h3>

              <ul className="list-disc list-inside text-gray-700">

                {result.matched_skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}

              </ul>

            </div>

            <div>

              <h3 className="font-semibold text-lg mb-2">
                📚 Learning Roadmap
              </h3>

              <ul className="space-y-2">

                {result.roadmap.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">

                    <span>{item.skill}</span>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Learn
                    </a>

                  </li>
                ))}

              </ul>

            </div>

          </div>

        )}

      </div>

    </div>

  );
};

export default SkillAnalysis;
