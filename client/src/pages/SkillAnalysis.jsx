// import { useState } from "react";

// function SkillAnalysis() {

//   const [step, setStep] = useState(1);
//   const [education, setEducation] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [experience, setExperience] = useState("");
//   const [career, setCareer] = useState("");
//   const [resume, setResume] = useState(null);

//   const next = () => setStep(step + 1);
//   const back = () => setStep(step - 1);

//   const toggleSkill = (skill) => {
//     if (skills.includes(skill)) {
//       setSkills(skills.filter((s) => s !== skill));
//     } else {
//       setSkills([...skills, skill]);
//     }
//   };

//   return (

//     <div className="flex min-h-screen">

//       {/* Sidebar */}
//       <div className="w-72 bg-blue-900 text-white p-8">

//         <h1 className="text-2xl font-bold mb-10">
//           Skill Setu
//         </h1>

//         <div className="space-y-6">

//           <Step title="Education" active={step === 1} />
//           <Step title="Skills" active={step === 2} />
//           <Step title="Experience" active={step === 3} />
//           <Step title="Career Goals" active={step === 4} />

//         </div>

//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-100 p-20">

//         {/* STEP 1 EDUCATION */}
//         {step === 1 && (

//           <div>

//             <h2 className="text-3xl font-bold mb-3">
//               Your Education
//             </h2>

//             <p className="text-gray-500 mb-10">
//               What is your educational background?
//             </p>

//             <div className="space-y-4">

//               {[
//                 "High School",
//                 "Diploma",
//                 "Bachelor's Degree",
//                 "Master's Degree",
//                 "PhD"
//               ].map((item) => (

//                 <div
//                   key={item}
//                   onClick={() => setEducation(item)}
//                   className={`p-5 rounded-xl border cursor-pointer text-lg transition
//                   ${education === item
//                       ? "bg-orange-500 text-white shadow-lg scale-105"
//                       : "bg-white hover:shadow-md"}
//                   `}
//                 >
//                   {item}
//                 </div>

//               ))}

//             </div>

//             <button
//               onClick={next}
//               className="bg-orange-500 text-white px-6 py-3 rounded-lg mt-10"
//             >
//               Continue →
//             </button>

//           </div>

//         )}

//         {/* STEP 2 SKILLS */}
//         {step === 2 && (

//           <div>

//             <h2 className="text-3xl font-bold mb-3">
//               Upload Resume & Select Skills
//             </h2>

//             <p className="text-gray-500 mb-6">
//               Upload your resume or manually select your skills.
//             </p>

//             {/* Resume Upload */}

//             <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-xl text-center hover:border-orange-400 transition">

//               <p className="font-semibold mb-3">
//                 Upload your Resume
//               </p>

//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={(e) => setResume(e.target.files[0])}
//                 className="cursor-pointer"
//               />

//               {resume && (
//                 <p className="text-green-600 mt-2">
//                   Uploaded: {resume.name}
//                 </p>
//               )}

//             </div>

//             {/* Skills Selection */}

//             <div className="grid grid-cols-3 gap-4 mt-8">

//               {[
//                 "HTML",
//                 "CSS",
//                 "JavaScript",
//                 "React",
//                 "Node",
//                 "Python",
//                 "MongoDB",
//                 "AI",
//                 "Data Analysis"
//               ].map((skill) => (

//                 <div
//                   key={skill}
//                   onClick={() => toggleSkill(skill)}
//                   className={`p-4 rounded-xl border text-center cursor-pointer font-medium transition
//           ${skills.includes(skill)
//                       ? "bg-orange-500 text-white shadow-md scale-105"
//                       : "bg-white hover:shadow-md hover:bg-gray-50"}
//           `}
//                 >
//                   {skill}
//                 </div>

//               ))}

//             </div>

//             <div className="flex justify-between mt-10">

//               <button
//                 onClick={back}
//                 className="text-gray-600"
//               >
//                 Back
//               </button>

//               <button
//                 onClick={next}
//                 className="bg-orange-500 text-white px-6 py-2 rounded-lg"
//               >
//                 Continue →
//               </button>

//             </div>

//           </div>

//         )}

//         {/* STEP 3 EXPERIENCE */}
//         {step === 3 && (

//           <div>

//             <h2 className="text-3xl font-bold mb-3">
//               Your experience level
//             </h2>

//             <p className="text-gray-500 mb-10">
//               How much work experience do you have?
//             </p>

//             <div className="space-y-4">

//               {[
//                 "Fresher (0 years)",
//                 "1–2 years",
//                 "3–5 years",
//                 "5–10 years",
//                 "10+ years"
//               ].map((item) => (

//                 <div
//                   key={item}
//                   onClick={() => setExperience(item)}
//                   className={`p-5 rounded-xl border cursor-pointer text-lg transition
//                   ${experience === item
//                       ? "bg-orange-500 text-white shadow-lg"
//                       : "bg-white hover:shadow-md"}
//                   `}
//                 >
//                   {item}
//                 </div>

//               ))}

//             </div>

//             <div className="flex justify-between mt-10">

//               <button
//                 onClick={back}
//                 className="text-gray-600"
//               >
//                 Back
//               </button>

//               <button
//                 onClick={next}
//                 className="bg-orange-500 text-white px-6 py-2 rounded-lg"
//               >
//                 Continue →
//               </button>

//             </div>

//           </div>

//         )}

//         {/* STEP 4 CAREER GOALS */}
//         {step === 4 && (

//           <div>

//             <h2 className="text-3xl font-bold mb-3">
//               Career Interests
//             </h2>

//             <p className="text-gray-500 mb-10">
//               What fields interest you?
//             </p>

//             <div className="grid grid-cols-2 gap-4">

//               {[
//                 "Software Development",
//                 "Data Science & AI",
//                 "Digital Marketing",
//                 "Design & Creative",
//                 "Healthcare",
//                 "Teaching",
//                 "Sales",
//                 "Entrepreneurship"
//               ].map((item) => (

//                 <div
//                   key={item}
//                   onClick={() => setCareer(item)}
//                   className={`p-5 rounded-xl border cursor-pointer font-medium transition
//                   ${career === item
//                       ? "bg-orange-500 text-white shadow-lg"
//                       : "bg-white hover:bg-gray-50 hover:shadow-md"}
//                   `}
//                 >
//                   {item}
//                 </div>

//               ))}

//             </div>

//             <div className="flex justify-between mt-10">

//               <button
//                 onClick={back}
//                 className="text-gray-500 hover:text-black transition"
//               >
//                 Back
//               </button>

//               <button
//                 onClick={next}
//                 className="bg-orange-500 text-white px-8 py-3 rounded-xl shadow hover:bg-orange-600 transition"
//               >
//                 Analyze My Skills →
//               </button>

//             </div>

//           </div>

//         )}

//         {/* STEP 5 DASHBOARD */}
//         {step === 5 && <Dashboard />}

//       </div>

//     </div>

//   );
// }

// export default SkillAnalysis;


// function Step({ title, active }) {

//   return (

//     <div
//       className={`p-4 rounded-xl font-medium transition
//       ${active
//           ? "bg-orange-500 text-white shadow-lg"
//           : "bg-blue-800 text-gray-200 hover:bg-blue-700"}
//       `}
//     >
//       {title}
//     </div>

//   );
// }


// function Dashboard() {

//   return (

//     <div>

//       <h2 className="text-3xl font-bold mb-6">
//         Your Skill Score
//       </h2>

//       <div className="bg-blue-900 text-white p-10 rounded-xl">

//         <h1 className="text-6xl font-bold">
//           43%
//         </h1>

//         <p className="mt-3">
//           Based on your profile analysis
//         </p>

//       </div>

//       <div className="grid grid-cols-3 gap-6 mt-10">

//         <Card title="View Skill Gaps" />
//         <Card title="Learning Roadmap" />
//         <Card title="Job Matches" />

//       </div>

//     </div>

//   );
// }


// function Card({ title }) {

//   return (

//     <div className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition">

//       {title}

//     </div>

//   );
// }


import React, { useState } from "react";
import axios from "axios";

const SkillAnalysis = () => {

  const [interest, setInterest] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState(0);

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/analyze_proficiency",
        {
          user_id: "user123",
          interest_field: interest,
          known_skills: skills.split(",").map(skill => skill.trim()),
          education: education,
          experience_years: experience
        }
      );

      setResult(response.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{padding:"40px"}}>

      <h2>Skill Setu – Skill Analyzer</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Interest Field (Ex: Data Science)"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />

        <br/><br/>

        <input
          type="text"
          placeholder="Known Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <br/><br/>

        <input
          type="text"
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        <br/><br/>

        <input
          type="number"
          placeholder="Experience Years"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <br/><br/>

        <button type="submit">Analyze Skills</button>

      </form>

      <br/>

      {result && (
        <div>

          <h3>Match Score: {result.match_score}</h3>

          <h4>Matched Skills</h4>
          <ul>
            {result.matched_skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4>Learning Roadmap</h4>

          <ul>
            {result.roadmap.map((item, index) => (
              <li key={index}>
                {item.skill} - 
                <a href={item.url} target="_blank" rel="noreferrer">
                  Learn
                </a>
              </li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
};

export default SkillAnalysis;