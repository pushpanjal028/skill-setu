// import React, { useEffect, useState } from 'react';
// import { Bar, Radar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from 'chart.js';

// ChartJS.register(
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement
// );

// const WorkforceGraphs = ({ userId, jobTitle, location }) => {
//   const [analyticsData, setAnalyticsData] = useState(null);

//   useEffect(() => {
//     fetch(`http://127.0.0.1:5002/get_workforce_graphs?user_id=${userId}&job_title=${jobTitle}&location=${location}`)
//       .then(res => res.json())
//       .then(data => setAnalyticsData(data))
//       .catch(err => console.error("Error fetching graph data:", err));
//   }, [userId, jobTitle, location]);

//   if (!analyticsData) return <div>Loading Workforce Insights...</div>;

//   const barData = {
//     labels: analyticsData.top_market_skills.map(s => s.skill),
//     datasets: [{
//       label: 'Market Demand (Mentions in Live Jobs)',
//       data: analyticsData.top_market_skills.map(s => s.frequency),
//       backgroundColor: 'rgba(54,162,235,0.6)',
//       borderColor: 'rgba(54,162,235,1)',
//       borderWidth: 1,
//     }]
//   };

//   const radarData = {
//     labels: analyticsData.user_comparison.map(s => s.skill),
//     datasets: [
//       {
//         label: 'Industry Standard',
//         data: analyticsData.user_comparison.map(() => 90),
//         backgroundColor: 'rgba(255,99,132,0.2)',
//         borderColor: 'rgb(255,99,132)',
//         pointBackgroundColor: 'rgb(255,99,132)',
//       },
//       {
//         label: 'Your Current Level',
//         data: analyticsData.user_comparison.map(s => s.proficiency_score),
//         backgroundColor: 'rgba(54,162,235,0.2)',
//         borderColor: 'rgb(54,162,235)',
//         pointBackgroundColor: 'rgb(54,162,235)',
//       }
//     ]
//   };

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
//       <h2>Workforce Skill Mapping</h2>

//       <div style={{ marginBottom: '50px' }}>
//         <h3>1. Trending Skills in {location}</h3>
//         <Bar data={barData} />
//       </div>

//       <div>
//         <h3>2. Skill Gap Analysis (You vs. Industry)</h3>
//         <div style={{ width: '400px', margin: '0 auto' }}>
//           <Radar data={radarData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkforceGraphs;


import React, { useEffect, useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WorkforceGraph = () => {

  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch(
      "http://localhost:5001/get_workforce_graphs?user_id=user123&job_title=Data Scientist&location=India"
    )
      .then(res => res.json())
      .then(data => {

        if (data.error) {
          setError(data.error);
        } else {
          setMarketData(data);
        }

      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Backend connection failed");
      });

  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading workforce analytics: {error}
      </div>
    );
  }

  if (!marketData) {
    return <div className="p-6">Loading analytics...</div>;
  }

  const skills = marketData.top_market_skills || [];
  const comparison = marketData.user_comparison || [];

  const barData = {
    labels: skills.map(s => s.skill),
    datasets: [
      {
        label: "Market Demand",
        data: skills.map(s => s.frequency),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  const radarData = {
    labels: comparison.map(s => s.skill),
    datasets: [
      {
        label: "Your Skill Level",
        data: comparison.map(s => s.proficiency_score),
        backgroundColor: "rgba(59,130,246,0.3)",
        borderColor: "#3b82f6"
      }
    ]
  };

  return (

    <div className="space-y-10">

      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          📊 Top Market Skills
        </h2>
        <Bar data={barData} />
      </div>

      <div className="bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          🧠 Your Skills vs Market
        </h2>
        <Radar data={radarData} />
      </div>

    </div>
  );
};

export default WorkforceGraph;