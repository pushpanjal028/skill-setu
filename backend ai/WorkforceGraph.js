import React, { useEffect, useState } from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const WorkforceGraphs = ({ userId, jobTitle, location }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5002/get_workforce_graphs?user_id=${userId}&job_title=${jobTitle}&location=${location}`)
      .then(res => res.json())
      .then(data => setAnalyticsData(data))
      .catch(err => console.error("Error fetching graph data:", err));
  }, [userId, jobTitle, location]);

  if (!analyticsData) return <div>Loading Workforce Insights...</div>;

  const barData = {
    labels: analyticsData.top_market_skills.map(s => s.skill),
    datasets: [{
      label: 'Market Demand (Mentions in Live Jobs)',
      data: analyticsData.top_market_skills.map(s => s.frequency),
      backgroundColor: 'rgba(54,162,235,0.6)',
      borderColor: 'rgba(54,162,235,1)',
      borderWidth: 1,
    }]
  };

  const radarData = {
    labels: analyticsData.user_comparison.map(s => s.skill),
    datasets: [
      {
        label: 'Industry Standard',
        data: analyticsData.user_comparison.map(() => 90),
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgb(255,99,132)',
        pointBackgroundColor: 'rgb(255,99,132)',
      },
      {
        label: 'Your Current Level',
        data: analyticsData.user_comparison.map(s => s.proficiency_score),
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgb(54,162,235)',
        pointBackgroundColor: 'rgb(54,162,235)',
      }
    ]
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
      <h2>Workforce Skill Mapping</h2>

      <div style={{ marginBottom: '50px' }}>
        <h3>1. Trending Skills in {location}</h3>
        <Bar data={barData} />
      </div>

      <div>
        <h3>2. Skill Gap Analysis (You vs. Industry)</h3>
        <div style={{ width: '400px', margin: '0 auto' }}>
          <Radar data={radarData} />
        </div>
      </div>
    </div>
  );
};

export default WorkforceGraphs;
