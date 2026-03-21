import React, { useEffect, useState } from "react";

function Profile() {

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [jobData, setJobData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [blueCollar, setBlueCollar] = useState(null);

  useEffect(() => {
   const storedUser = JSON.parse(localStorage.getItem("user"));

if (!storedUser) {
  console.log("No user found");
  return;
}
    fetch("http://localhost:5000/profile", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email: storedUser.email })
})
.then(res => {
  if (!res.ok) throw new Error("Server error");
  return res.json();
})
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setJobData(data.jobData || []);
        setSkills(data.skills || []);
        setSkillAnalysis(data.skillAnalysis || null);
        setBlueCollar(data.blueCollar || null);
      })
      .catch(err => console.log("Error:", err));

  }, []);

  // ✅ Progress (no useEffect)
  const progress =
    (jobData.length > 0 ? 30 : 0) +
    (skills.length > 0 ? 30 : 0) +
    (skillAnalysis?.score ? 40 : 0);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <span>👤 {user?.name || "Guest"}</span>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* USER */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* PROGRESS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2>🚀 Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2">{progress}% completed</p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-5 rounded-xl">
            Jobs: {jobData.length}
          </div>

          <div className="bg-green-100 p-5 rounded-xl">
            Skills: {skills.length}
          </div>

          <div className="bg-yellow-100 p-5 rounded-xl">
            Score: {skillAnalysis?.score || "N/A"}
          </div>
        </div>

        {/* JOB DATA */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2>💼 Job Analysis</h2>

          {jobData.length > 0 ? (
            <ul>
              {jobData.map((job, i) => (
                <li key={i}>
                  {job.title} → {job.missingSkills?.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p>No data</p>
          )}
        </div>

        {/* BLUE COLLAR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2>🔧 Blue Collar</h2>

          {blueCollar?.jobs?.length ? (
            <ul>
              {blueCollar.jobs.map((j, i) => (
                <li key={i}>{j}</li>
              ))}
            </ul>
          ) : (
            <p>No data</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;