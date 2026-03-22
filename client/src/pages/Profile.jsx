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
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  // 📡 FETCH PROFILE + EMAIL BASED BLUE COLLAR
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");

        if (!email) {
          navigate("/login");
          return;
        }

        // ✅ PROFILE (5004)
        const res = await axios.get("http://localhost:5004/profile", {
          params: { email }
        });

        const data = res.data;

        console.log("PROFILE DATA:", data);

        setUser(data.user || {});
        setSkills(data.skills || []);
        setSkillAnalysis(data.skillAnalysis || []);
        setJobData(data.jobData || []);

        // 🔥 EMAIL BASED FILTER (FINAL FIX)
        const userId = data?.user?._id;

        console.log("USER ID:", userId);

        const workersRes = await axios.get("http://127.0.0.1:5002/workers", {
          params: { user_id: userId }
        });

        console.log("FILTERED WORKERS:", workersRes.data);

        setBlueCollar(workersRes.data || []);

      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Backend error");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // ❌ BLOCK UI IF NOT LOGGED IN
  const isLoggedIn = localStorage.getItem("user");
  if (!isLoggedIn) return null;

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Loading profile...
      </div>
    );
  }

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8">

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
            <h3 className="text-lg font-semibold mb-3">🧠 Your Skills</h3>

            {skills.length > 0 ? (
              <ul className="list-disc list-inside">
                {skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No skills added</p>
            )}
          </div>

          {/* SKILL ANALYSIS */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">✅ Skill Analysis</h3>

            {skillAnalysis.length > 0 ? (
              <ul className="list-disc list-inside">
                {skillAnalysis.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No analysis available</p>
            )}
          </div>

          {/* JOB DATA */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">💼 Job Analysis</h3>

            {jobData.length > 0 ? (
              jobData.map((job, i) => (
                <div key={i} className="mb-2 p-2 bg-white rounded shadow">
                  <p className="font-semibold">{job.title}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No job analysis available</p>
            )}
          </div>

          {/* 🔥 BLUE COLLAR FINAL */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">
              🔧 Your Blue Collar Data
            </h3>

            {blueCollar.length > 0 ? (
              blueCollar.map((worker, i) => (
                <div key={i} className="mb-2 p-2 bg-white rounded shadow">
                  <p className="font-semibold">{worker.profession}</p>
                  <p className="text-sm text-gray-500">👤 {worker.name}</p>
                  <p className="text-xs text-gray-400">📍 {worker.location}</p>
                  <p className="text-xs text-gray-400">
                    🧰 {worker.experience} years
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No data found for your account
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;