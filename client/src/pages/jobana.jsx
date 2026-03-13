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

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("user_id", "user123");
    formData.append("job_title", jobTitle);
    formData.append("location", location);
    formData.append("resume", resume);

    try {

      const res = await axios.post(
        "http://localhost:5001/analyze_jobs_with_resume",
        formData
      );

      setJobs(res.data.jobs);

      // collect missing skills for graph
      const skillList = [];

      res.data.jobs.forEach(job => {
        job.missing_skills_data.forEach(skill => {
          skillList.push(skill.skill_name);
        });
      });

      setSkills(skillList);

    } catch (err) {

      console.error(err);
      alert("Error analyzing jobs");

    }

  };

  const chartData = {
    labels: skills,
    datasets: [
      {
        label: "Missing Skills Frequency",
        data: skills.map(() => 1),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold text-center mb-8">
        💼 Job Analysis Dashboard
      </h1>

      {/* Form */}

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
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full"
          required
        />

        <button
          className="bg-blue-600 text-white w-full py-3 rounded"
        >
          Analyze Jobs
        </button>

      </form>

      {/* Graph */}

      {skills.length > 0 && (

        <div className="bg-white shadow-md p-6 mt-10 rounded-lg">

          <h2 className="text-xl font-semibold mb-4">
            📊 Missing Skills Graph
          </h2>

          <Bar data={chartData} />

        </div>

      )}

      {/* Job Results */}

      {jobs.length > 0 && (

        <div className="mt-10 grid md:grid-cols-2 gap-6">

          {jobs.map((job, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow"
            >

              <h2 className="text-lg font-bold">
                {job.title}
              </h2>

              <p className="text-gray-500 mb-2">
                {job.company}
              </p>

              <p className="text-sm mb-4">
                {job.description}
              </p>

              <h3 className="font-semibold">
                Missing Skills
              </h3>

              <ul className="list-disc ml-5">

                {job.missing_skills_data.map((skill, i) => (

                  <li key={i}>

                    {skill.skill_name}

                    <a
                      href={skill.tutorial_url}
                      target="_blank"
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