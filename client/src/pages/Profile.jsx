// import React, { useState } from "react";

// function Profile() {

//   const [user] = useState(() => {
//     const data = localStorage.getItem("user");
//     return data ? JSON.parse(data) : [];
//   });

//   const [jobData] = useState(() => {
//     const data = localStorage.getItem("jobAnalysis");
//     return data ? JSON.parse(data) : [];
//   });

//   const [skills] = useState(() => {
//     const data = localStorage.getItem("skills");
//     return data ? JSON.parse(data) : [];
//   });

//   const [skillAnalysis] = useState(() => {
//     const data = localStorage.getItem("skillAnalysis");
//     return data ? JSON.parse(data) : [];
//   });

//   const [blueCollar] = useState(() => {
//     const data = localStorage.getItem("blueCollar");
//     return data ? JSON.parse(data) : [];
//   });

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">

//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* USER INFO */}
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-2xl font-bold">{user?.name}</h2>
//           <p className="text-gray-500">{user?.email}</p>
//         </div>

//         {/* JOB ANALYSIS */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-3">
//             💼 Job Analysis Progress
//           </h2>

//           <p>Total Jobs Analyzed: {jobData.length}</p>
//           <p>Total Missing Skills: {skills.length}</p>
//         </div>

//         {/* SKILL ANALYSIS */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-3">
//             🧠 Skill Analysis
//           </h2>

//           {skillAnalysis ? (
//             <pre className="text-sm text-gray-600">
//               {JSON.stringify(skillAnalysis, null, 2)}
//             </pre>
//           ) : (
//             <p>No data yet</p>
//           )}
//         </div>

//         {/* BLUE COLLAR */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-3">
//             🔧 Blue Collar Work
//           </h2>

//           {blueCollar ? (
//             <pre className="text-sm text-gray-600">
//               {JSON.stringify(blueCollar, null, 2)}
//             </pre>
//           ) : (
//             <p>No data yet</p>
//           )}
//         </div>

//       </div>

//     </div>
//   );
// }

// export default Profile;

import React, { useEffect, useState } from "react";

function Profile() {

  // ✅ Initialize directly from localStorage (FIX)
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const [jobData, setJobData] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [blueCollar, setBlueCollar] = useState(null);

  useEffect(() => {

    fetch("http://localhost:5000/profile")
      .then(res => res.json())
      .then(data => {
        setUser(prev => data.user || prev);
        setJobData(data.jobData || []);
        setSkills(data.skills || []);
        setSkillAnalysis(data.skillAnalysis || null);
        setBlueCollar(data.blueCollar || null);
      })
      .catch(() => {
        console.log("Backend not working, using local data");

        setJobData(JSON.parse(localStorage.getItem("jobAnalysis")) || []);
        setSkills(JSON.parse(localStorage.getItem("skills")) || []);
        setSkillAnalysis(JSON.parse(localStorage.getItem("skillAnalysis")) || null);
        setBlueCollar(JSON.parse(localStorage.getItem("blueCollar")) || null);
      });

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <span className="text-gray-600">{user?.name || "Guest"}</span>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* USER CARD */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">{user?.name || "No Name"}</h2>
          <p className="text-gray-500">{user?.email || "No Email"}</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-blue-100 p-5 rounded-xl shadow">
            <h3>Total Jobs Analyzed</h3>
            <p className="text-2xl font-bold">{jobData.length}</p>
          </div>

          <div className="bg-green-100 p-5 rounded-xl shadow">
            <h3>Skills Count</h3>
            <p className="text-2xl font-bold">{skills.length}</p>
          </div>

          <div className="bg-yellow-100 p-5 rounded-xl shadow">
            <h3>Skill Score</h3>
            <p className="text-2xl font-bold">
              {skillAnalysis?.score || "N/A"}
            </p>
          </div>

        </div>

        {/* JOB TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">💼 Job Analysis</h2>

          {jobData.length > 0 ? (
            <table className="w-full border text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Job</th>
                  <th className="p-2">Missing Skills</th>
                </tr>
              </thead>
              <tbody>
                {jobData.map((job, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{job.title || "N/A"}</td>
                    <td className="p-2">
                      {job.missingSkills?.join(", ") || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No job data</p>
          )}
        </div>

        {/* SKILL ANALYSIS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">🧠 Skill Analysis</h2>

          {skillAnalysis ? (
            <div className="space-y-2">
              <p><b>Score:</b> {skillAnalysis.score}</p>
              <p><b>Recommended Skills:</b> {skillAnalysis.recommended?.join(", ")}</p>
            </div>
          ) : (
            <p>No analysis available</p>
          )}
        </div>

        {/* BLUE COLLAR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">🔧 Blue Collar Opportunities</h2>

          {blueCollar ? (
            <ul className="list-disc ml-6">
              {blueCollar.jobs?.map((job, i) => (
                <li key={i}>{job}</li>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;