import React, { useState } from "react";

function Profile() {

  const [user] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : [];
  });

  const [jobData] = useState(() => {
    const data = localStorage.getItem("jobAnalysis");
    return data ? JSON.parse(data) : [];
  });

  const [skills] = useState(() => {
    const data = localStorage.getItem("skills");
    return data ? JSON.parse(data) : [];
  });

  const [skillAnalysis] = useState(() => {
    const data = localStorage.getItem("skillAnalysis");
    return data ? JSON.parse(data) : [];
  });

  const [blueCollar] = useState(() => {
    const data = localStorage.getItem("blueCollar");
    return data ? JSON.parse(data) : [];
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* USER INFO */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* JOB ANALYSIS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">
            💼 Job Analysis Progress
          </h2>

          <p>Total Jobs Analyzed: {jobData.length}</p>
          <p>Total Missing Skills: {skills.length}</p>
        </div>

        {/* SKILL ANALYSIS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">
            🧠 Skill Analysis
          </h2>

          {skillAnalysis ? (
            <pre className="text-sm text-gray-600">
              {JSON.stringify(skillAnalysis, null, 2)}
            </pre>
          ) : (
            <p>No data yet</p>
          )}
        </div>

        {/* BLUE COLLAR */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">
            🔧 Blue Collar Work
          </h2>

          {blueCollar ? (
            <pre className="text-sm text-gray-600">
              {JSON.stringify(blueCollar, null, 2)}
            </pre>
          ) : (
            <p>No data yet</p>
          )}
        </div>

      </div>

    </div>
  );
}

export default Profile;