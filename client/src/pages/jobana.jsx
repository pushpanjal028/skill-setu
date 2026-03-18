import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const JobAnalysis = () => {

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [resume, setResume] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!resume) {
      alert("Please upload resume first");
      return;
    }

    setJobs([]);
    setSkills([]);
    setLoading(true);
    setSearched(true);

    const formData = new FormData();
    formData.append("user_id", "user123");
    formData.append("job_title", jobTitle);
    formData.append("location", location);
    formData.append("resume", resume);

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

      console.log("Backend Response:", res.data);

      const jobsData = res.data.jobs || [];
      setJobs(jobsData);

      const skillList = [];

      jobsData.forEach(job => {
        job.missing_skills_data?.forEach(skill => {
          skillList.push(skill.skill_name);
        });
      });
      setSkills(skillList);
      // save data
      localStorage.setItem("jobAnalysis", JSON.stringify(jobsData));


    } catch (err) {

      console.error(err.response?.data || err.message);
      alert("Server error");

    }

    setLoading(false);

  };

  const chartData = {
    labels: skills,
    datasets: [
      {
        label: "Missing Skills",
        data: skills.map(() => 1),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return (

    <div className="min-h-screen  bg-gray-300 p-10">

      <h1 className="text-3xl font-bold text-center mb-8">
        💼 Job Analysis Dashboard
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded-lg max-w-xl mx-auto space-y-4"
      >

        <input
          type="text"
          placeholder="Job Title (Data Scientist)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Location (India)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze Jobs"}
        </button>

      </form>

      {/* NO JOB MESSAGE */}

      {searched && jobs.length === 0 && !loading && (

        <div className="text-center mt-10 text-gray-600">

          <h2 className="text-xl font-semibold">
            No jobs found for this search
          </h2>

          <p className="mt-2">
            Try a different job title or location.
          </p>

        </div>

      )}

      {/* GRAPH */}

      {skills.length > 0 && (

        <div className="bg-white shadow-md p-6 mt-10 md:grid-flow-row rounded-lg max-w-4xl mx-auto">

          <h2 className="text-xl font-semibold mb-4 text-center">
            📊 Missing Skills Graph
          </h2>

          <Bar data={chartData} />

        </div>

      )}

      {/* JOB RESULTS */}

      {jobs.length > 0 && (

        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {jobs.map((job, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >

              <h2 className="text-lg font-bold text-blue-600">
                {job.title}
              </h2>

              <p className="text-gray-500 mb-2">
                {job.company}
              </p>

              <p className="text-sm mb-4">
                {job.description}
              </p>

              <h3 className="font-semibold mb-2">
                Missing Skills
              </h3>

              <ul className="list-disc ml-5">

                {job.missing_skills_data?.map((skill, i) => (

                  <li key={i}>

                    {skill.skill_name}

                    <a
                      href={skill.tutorial_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 ml-2"
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
                className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Apply
              </a>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default JobAnalysis;