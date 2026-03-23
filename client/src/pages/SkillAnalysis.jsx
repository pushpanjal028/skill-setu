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

    const email = localStorage.getItem("email");

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze_proficiency",
        {
          email: email,
          name: name,
          interest_field: interest,
          known_skills: skills.split(",").map(s => s.trim()),
          education: education,
          experience_years: Number(experience)
        }
      );

      setResult(response.data);
      localStorage.setItem("skillAnalysis", JSON.stringify(response.data));

    } catch (error) {
      console.error(error);
      alert("API Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">

      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        🧠 Skill Gap Analysis
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto space-y-5"
      >

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">👤</span>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-10 border p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">🎯</span>
          <input
            type="text"
            placeholder="Interest Field (Ex: Data Science)"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            required
            className="w-full pl-10 border p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">🛠️</span>
          <input
            type="text"
            placeholder="Known Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            className="w-full pl-10 border p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">🎓</span>
          <input
            type="text"
            placeholder="Education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full pl-10 border p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">⏳</span>
          <input
            type="number"
            placeholder="Experience (Years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full pl-10 border p-3 rounded-lg"
          />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg shadow-md">
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>

      </form>

      {/* RESULT */}
      {result && (
        <div className="mt-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

          {/* MATCH SCORE */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-blue-600">
              🎯 Match Score
            </h2>
            <p className="text-3xl font-bold mt-2">
              {result.match_score}%
            </p>
          </div>

          {/* MATCHED SKILLS */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-lg mb-3 text-green-600">
              ✅ Matched Skills
            </h3>
            <ul className="list-disc ml-5 text-gray-600">
              {result.matched_skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* ROADMAP */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-lg mb-3 text-purple-600">
              📚 Learning Roadmap
            </h3>

            <ul className="space-y-3">
              {result.roadmap.map((item, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded flex justify-between">
                  <span>{item.skill}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-semibold"
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
  );
};

export default SkillAnalysis;