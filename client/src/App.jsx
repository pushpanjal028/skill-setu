import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SkillAnalysis from "./pages/SkillAnalysis";
import VerifyEmail from "./pages/verifyEmail";
import Verify from "./pages/verify";
import Profile from "./pages/Profile";
import WorkforceGraphs from "./pages/WorkforceGraph";
import JobAnalysis from "./pages/jobana";


function App() {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/skill-analysis" element={<SkillAnalysis />} />

      <Route path="/verify-email" element={<VerifyEmail />} />
       
      <Route path="/verify/:token" element={<Verify />} />

      <Route path ="/profile/:userId" element={<Profile />} />

      <Route path="/workforce-graphs" element={<WorkforceGraphs />} />

      <Route path="/jobana" element={<JobAnalysis />} />
 
       
    </Routes>
  );
}

export default App;


