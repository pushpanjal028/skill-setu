// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend
// } from "recharts";

// function WorkforceGraph() {

//   const [skills, setSkills] = useState([]);
//   const [userSkills, setUserSkills] = useState([]);
//   const [stats, setStats] = useState([]);

//   useEffect(() => {

//     axios.get("http://127.0.0.1:5000/get_workforce_graphs", {
//       params: {
//         job_title: "Data Science"
//       }
//     })
//     .then((res) => {

//       console.log("API DATA:", res.data);

//       const data = res.data;

//       const skillGraph = data.top_market_skills.map((s) => ({
//         name: s.skill,
//         value: s.frequency
//       }));

//       const userSkillGraph = data.user_comparison.map((s) => ({
//         name: s.skill,
//         value: s.proficiency_score
//       }));

//       const statGraph = [
//         {
//           name: "Demand Score",
//           value: data.employment_stats.demand_score
//         },
//         {
//           name: "Salary Index",
//           value: data.employment_stats.avg_salary_index
//         }
//       ];

//       setSkills(skillGraph);
//       setUserSkills(userSkillGraph);
//       setStats(statGraph);

//     })
//     .catch((error) => {
//       console.error("Graph Fetch Error:", error);
//     });

//   }, []);

//   const COLORS = ["#6366F1", "#10B981"];

//   return (
//     <div className="min-h-screen bg-gray-100 p-10">

//       <h1 className="text-3xl font-bold text-center mb-10">
//         Workforce Analytics Dashboard
//       </h1>

//       {/* -------- MARKET SKILLS GRAPH -------- */}

//       <div className="bg-white rounded-xl shadow p-6 mb-10 h-[400px]">

//         <h2 className="text-xl font-semibold mb-4">
//           Top Market Skills
//         </h2>

//         <ResponsiveContainer width="100%" height="90%">
//           <BarChart data={skills}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="#6366F1" />
//           </BarChart>
//         </ResponsiveContainer>

//       </div>

//       {/* -------- USER SKILL GRAPH -------- */}

//       <div className="bg-white rounded-xl shadow p-6 mb-10 h-[400px]">

//         <h2 className="text-xl font-semibold mb-4">
//           Your Skills vs Market
//         </h2>

//         <ResponsiveContainer width="100%" height="90%">
//           <BarChart data={userSkills}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="#10B981" />
//           </BarChart>
//         </ResponsiveContainer>

//       </div>

//       {/* -------- JOB MARKET PIE GRAPH -------- */}

//       <div className="bg-white rounded-xl shadow p-6 h-[400px]">

//         <h2 className="text-xl font-semibold mb-4">
//           Job Market Strength
//         </h2>

//         <ResponsiveContainer width="100%" height="90%">
//           <PieChart>

//             <Pie
//               data={stats}
//               dataKey="value"
//               nameKey="name"
//               outerRadius={120}
//               label
//             >
//               {stats.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index]} />
//               ))}
//             </Pie>

//             <Tooltip />
//             <Legend />

//           </PieChart>
//         </ResponsiveContainer>

//       </div>

//     </div>
//   );
// }

// export default WorkforceGraph;

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function WorkforceGraph() {

  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {

    axios.get("http://127.0.0.1:5000/get_workforce_graphs", {
      params: { job_title: "Data Science" }
    })
    .then((res) => {

      console.log("API DATA:", res.data);
      const data = res.data;

      // ✅ Safe checks (important)
      const skillGraph = (data.top_market_skills || []).map((s) => ({
        name: s.skill,
        value: s.frequency
      }));

      const userSkillGraph = (data.user_comparison || []).map((s) => ({
        name: s.skill,
        value: s.proficiency_score
      }));

      const statGraph = [
        {
          name: "Demand Score",
          value: data?.employment_stats?.demand_score || 0
        },
        {
          name: "Salary Index",
          value: data?.employment_stats?.avg_salary_index || 0
        }
      ];

      setSkills(skillGraph);
      setUserSkills(userSkillGraph);
      setStats(statGraph);

    })
    .catch((error) => {
      console.error("Graph Fetch Error:", error.response || error.message);
    });

  }, []);

  const COLORS = ["#6366F1", "#10B981"];

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold text-center mb-10">
        Workforce Analytics Dashboard
      </h1>

      {/* -------- MARKET SKILLS GRAPH -------- */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Top Market Skills
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* -------- USER SKILL GRAPH -------- */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Your Skills vs Market
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* -------- JOB MARKET PIE GRAPH -------- */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Job Market Strength
        </h2>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {stats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default WorkforceGraph;