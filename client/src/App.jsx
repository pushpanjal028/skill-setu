import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Translator from "./Translator"; // ✅ ADD THIS

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
  const location = useLocation();

  return (
    <>
      {/* ✅ ADD THIS (Translator visible everywhere) */}
      <Translator />

      {/* ❌ Hide Navbar on Home page */}
      {location.pathname !== "/" && <Navbar />}

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
    </>
  );
}

export default App;