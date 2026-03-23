import React, { useState } from "react";
import axios from "axios";

const JobAnalysis = () => {

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("full_time");
  const [resume, setResume] = useState(null);
  const [name, setName] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Upload resume first");
      return;
    }

    const email = localStorage.getItem("email");

    if (!email) {
      alert("User not logged in properly");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", email);
    formData.append("job_title", jobTitle);
    formData.append("location", location);
    formData.append("job_type", jobType);
    formData.append("resume", resume);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/analyze_jobs_with_resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setJobs(res.data.jobs || []);

    } catch (error) {
      console.error(error);
      alert("Backend error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">

      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        💼 Job Analyzer
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">💼</span>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Job Title"
            required
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">📍</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            required
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">⏱️</span>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
          </select>
        </div>

        <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600">
            📄 Upload Resume
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
            />
          </label>

          {resume && (
            <p className="text-sm text-green-600 mt-2">
              ✔ {resume.name}
            </p>
          )}
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg shadow-md">
          {loading ? "Analyzing..." : "Analyze Jobs"}
        </button>

      </form>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-6 text-blue-600">
          🤖 AI is analyzing your resume...
        </div>
      )}

      {/* JOB CARDS */}
      {jobs.length > 0 && !loading && (
        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-lg">

              <h2 className="text-lg font-bold text-blue-600">
                {job.title}
              </h2>

              <p className="text-gray-600">
                {job.company}
              </p>

              <p className="text-sm mt-2 text-gray-500">
                {job.description}
              </p>

              <h3 className="mt-3 font-semibold text-gray-700">
                Missing Skills:
              </h3>

              <ul className="list-disc ml-5 text-gray-600">
                {job.missing_skills_data?.map((skill, i) => (
                  <li key={i}>{skill.skill_name}</li>
                ))}
              </ul>

              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="block mt-4 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded"
              >
                Apply Now
              </a>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default JobAnalysis;