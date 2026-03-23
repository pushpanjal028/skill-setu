import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillAnalysis, setSkillAnalysis] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [blueCollar, setBlueCollar] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  // 📡 FETCH DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");

        const res = await axios.get("http://localhost:5004/profile", {
          params: { email }
        });

        const data = res.data;

        console.log("PROFILE DATA:", data);

        setUser(data.user || {});
        setSkills(data.skills || []);
        setSkillAnalysis(data.skillAnalysis || []);
        setJobData(data.jobData || []);

        // 🔥 BLUE COLLAR
        const userId = data?.user?._id;

        const workersRes = await axios.get("http://127.0.0.1:5002/workers", {
          params: { user_id: userId }
        });

        setBlueCollar(workersRes.data || []);

      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            👤 User Dashboard
          </h1>

          <h2 className="text-xl mt-2">
            Welcome,{" "}
            <span className="font-semibold">
              {user?.name || user?.email?.split("@")[0]}
            </span>
          </h2>

          <p className="text-gray-500">{user?.email}</p>

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* SKILLS */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">🧠 Your Skills</h3>

            {skills.length > 0 ? (
              <ul className="list-disc ml-5">
                {skills.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : <p>No skills</p>}
          </div>

          {/* SKILL ANALYSIS */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">✅ Skill Analysis</h3>

            {skillAnalysis.length > 0 ? (
              <ul className="list-disc ml-5">
                {skillAnalysis.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : <p>No analysis</p>}
          </div>

        </div>

        {/* 🔥 JOB ANALYSIS (UPGRADED UI) */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-yellow-600">
            💼 Job Analysis
          </h3>

          {jobData.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">

              {jobData.map((job, i) => (
                <div key={i} className="bg-yellow-50 p-4 rounded shadow">

                  <h4 className="font-bold text-blue-600">
                    {job.title}
                  </h4>

                  <p className="text-gray-500">{job.company}</p>

                  {/* Missing Skills */}
                  {job.missingSkills?.length > 0 && (
                    <>
                      <p className="mt-2 font-semibold">Missing Skills:</p>
                      <ul className="list-disc ml-5 text-sm">
                        {job.missingSkills.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Apply */}
                  {job.apply_link && (
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="block mt-3 bg-green-600 text-white text-center py-1 rounded"
                    >
                      Apply
                    </a>
                  )}

                </div>
              ))}

            </div>
          ) : (
            <p>No job analysis available</p>
          )}
        </div>

        {/* 🔧 BLUE COLLAR */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-purple-600">
            🔧 Blue Collar Data
          </h3>

          {blueCollar.length > 0 ? (
            blueCollar.map((w, i) => (
              <div key={i} className="bg-purple-50 p-3 mb-2 rounded shadow">
                <p className="font-semibold">{w.profession}</p>
                <p>👤 {w.name}</p>
                <p>📍 {w.location}</p>
              </div>
            ))
          ) : (
            <p>No data found</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;