import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SkillAnalysis from "./pages/SkillAnalysis";
import VerifyEmail from "./pages/verifyEmail";
import Verify from "./pages/verify";
import Profile from "./pages/Profile";
import WorkforceGraphs from "./pages/WorkforceGraph";
import JobAnalysis from "./pages/jobana";
import Bluecollar from "./pages/Bluecollar";
import OrgDashboard from "./pages/orgDashboard";

function App() {

  // ✅ FIX: Move useEffect INSIDE component
  useEffect(() => {
    const lang = localStorage.getItem("lang");

    if (lang) {
      const interval = setInterval(() => {
        const select = document.querySelector(".goog-te-combo");

        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event("change"));
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);

  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/skill-analysis" element={<SkillAnalysis />} />

      <Route path="/verify-email" element={<VerifyEmail />} />
       
      <Route path="/verify/:token" element={<Verify />} />

      <Route path="/profile/:userId" element={<Profile />} />

      <Route path="/workforce-graphs" element={<WorkforceGraphs />} />

      <Route path="/jobana" element={<JobAnalysis />} />
      
      <Route path="/Bluecollar" element={<Bluecollar />} />

      <Route path="/orgDashboard" element={<OrgDashboard />} />

    </Routes>
  );
}

export default App;