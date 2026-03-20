import React, { useState } from "react";
import axios from "axios";

const JobAnalysis = () => {

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("full_time"); // 🔥 NEW
  const [resume, setResume] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Upload resume first");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", "user123");
    formData.append("job_title", jobTitle);
    formData.append("location", location);
    formData.append("job_type", jobType); // 🔥 SEND THIS
    formData.append("resume", resume);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/analyze_jobs_with_resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setJobs(res.data.jobs || []);
      

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Backend error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold text-center mb-8">
        💼 Job Analyzer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4"
      >

        {/* JOB TITLE */}
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        {/* LOCATION */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        {/* 🔥 JOB TYPE DROPDOWN */}
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
        </select>

        {/* FILE */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <button className="bg-blue-600 text-white w-full py-3 rounded">
          {loading ? "Analyzing..." : "Analyze Jobs"}
        </button>

      </form>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-6 text-blue-600">
          🤖 AI is analyzing your resume...
        </div>
      )}

      {/* RESULTS */}
      {jobs.length > 0 && !loading && (
        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-5 rounded shadow">

              <h2 className="text-lg font-bold text-blue-600">
                {job.title}
              </h2>

              <p className="text-gray-500">
                {job.company}
              </p>

              <p className="text-sm mt-2">
                {job.description}
              </p>

              <h3 className="mt-3 font-semibold">
                Missing Skills:
              </h3>

              <ul className="list-disc ml-5">
                {job.missing_skills_data?.map((skill, i) => (
                  <li key={i}>
                    {skill.skill_name}
                    <a
                      href={skill.tutorial_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 ml-2"
                    >
                      Learn
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href={job.apply_link}
                target="_blank"
                rel="noreferrer"
                className="block mt-4 bg-green-600 text-white text-center py-2 rounded"
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