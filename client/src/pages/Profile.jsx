import React from "react";

const Profile = () => {

  const user = {
    name: "Skill Setu User",
    email: "skillsetu@gmail.com",
    education: "B.Tech / MCA Student",
    experience: "1 Year",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    interest: "AI / Data Science"
  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

        <div className="text-center mb-6">

          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="w-24 mx-auto mb-3"
          />

          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>

        </div>

        <div className="space-y-3">

          <p><b>Education:</b> {user.education}</p>

          <p><b>Experience:</b> {user.experience}</p>

          <p><b>Interest Field:</b> {user.interest}</p>

        </div>

        <div className="mt-5">

          <h2 className="text-lg font-semibold mb-2">Skills</h2>

          <div className="flex flex-wrap gap-2">

            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

      </div>

    </div>

  );
};

export default Profile;