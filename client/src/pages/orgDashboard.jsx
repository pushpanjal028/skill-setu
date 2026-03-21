import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OrgDashboard() {

  const [analytics, setAnalytics] = useState({
    users: 0,
    topSkill: "",
    unemployment: 0,
    skills: []
  });

  // 🔌 Fetch backend data
  useEffect(() => {
    fetch("http://localhost:5000/GovernmentNGO")
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {
        // fallback demo data
        setAnalytics({
          users: 1200,
          topSkill: "React",
          unemployment: 32,
          skills: [120, 90, 60, 40]
        });
      });
  }, []);

  const chartData = {
    labels: ["React", "Python", "Data Entry", "Welding"],
    datasets: [
      {
        label: "User Skills",
        data: analytics.skills,
      },
    ],
  };

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <aside className="w-64 h-screen bg-gray-800 text-white p-5 fixed">
        <h1 className="text-2xl font-bold mb-6">Skill Setu</h1>
        <ul className="space-y-4">
          <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
          <li className="hover:text-blue-400 cursor-pointer">Users</li>
          <li className="hover:text-blue-400 cursor-pointer">Analytics</li>
          <li className="hover:text-blue-400 cursor-pointer">Post Job</li>
        </ul>
      </aside>

      {/* MAIN */}
      <div className="ml-64 w-full bg-gray-100 min-h-screen">

        {/* NAVBAR */}
        <nav className="bg-white shadow p-4 flex justify-between">
          <h2 className="text-xl font-semibold">NGO Dashboard</h2>
          <span>Admin</span>
        </nav>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-5 bg-blue-100 rounded-lg shadow">
              <h3>Total Users</h3>
              <p className="text-2xl font-bold">{analytics.users}</p>
            </div>

            <div className="p-5 bg-green-100 rounded-lg shadow">
              <h3>Top Skill</h3>
              <p className="text-2xl font-bold">{analytics.topSkill}</p>
            </div>

            <div className="p-5 bg-yellow-100 rounded-lg shadow">
              <h3>Unemployment</h3>
              <p className="text-2xl font-bold">{analytics.unemployment}%</p>
            </div>

          </div>

          {/* CHART */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="mb-4 font-semibold">Skill Distribution</h3>
            <Bar data={chartData} />
          </div>

          {/* USERS TABLE (Flowbite Style) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="mb-4 font-semibold">Users</h3>

            <table className="w-full text-left border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Skill</th>
                  <th className="p-2">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">React</td>
                  <td className="p-2">120</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Python</td>
                  <td className="p-2">90</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* JOB FORM */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="mb-4 font-semibold">Post Job</h3>

            <form className="grid gap-4 md:grid-cols-2">
              <input className="p-2 border rounded" placeholder="Job Title" />
              <input className="p-2 border rounded" placeholder="Skills Required" />
              <input className="p-2 border rounded" placeholder="Location" />

              <button className="bg-blue-500 text-white p-2 rounded col-span-2">
                Post Job
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}