import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5002";

const BlueCollar = () => {
  const [workers, setWorkers] = useState([]);
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    experience: "",
    location: ""
  });

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/workers`);
      setWorkers(res.data);
    } catch (error) {
      console.error("Backend not running", error);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  const newWorker = {
    ...formData,
    user_id: user?._id   // 🔥 IMPORTANT
  };

  await axios.post("http://127.0.0.1:5002/add_worker", newWorker);

  fetchWorkers();
};

  const getGuidance = async (worker) => {
    setLoading(true);
    setGuidance(null);

    try {
      const res = await axios.post(`${API_BASE}/career_guidance`, {
        profession: worker.profession,
        experience: worker.experience,
        location: worker.location
      });

      setGuidance(res.data);
    } catch (error) {
      alert("AI guidance error");
    }

    setLoading(false);
  };

  let parsedGuidance = null;

  try {
    if (guidance?.guidance) {
      parsedGuidance =
        typeof guidance.guidance === "string"
          ? JSON.parse(guidance.guidance)
          : guidance.guidance;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          🔧 Blue Collar Career Portal
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Register Worker
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" placeholder="Name"
                value={formData.name} onChange={handleChange}
                className="w-full border p-3 rounded" required />

              <input name="profession" placeholder="Profession"
                value={formData.profession} onChange={handleChange}
                className="w-full border p-3 rounded" required />

              <input name="experience" type="number"
                placeholder="Experience"
                value={formData.experience} onChange={handleChange}
                className="w-full border p-3 rounded" />

              <input name="location" placeholder="Location"
                value={formData.location} onChange={handleChange}
                className="w-full border p-3 rounded" />

              <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                Save Worker
              </button>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* LOADING */}
            {loading && (
              <div className="bg-blue-100 p-4 rounded text-center font-semibold">
                AI is generating guidance...
              </div>
            )}

            {/* 🔥 MODERN GUIDANCE UI */}
            {guidance && parsedGuidance && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border">

                <h3 className="text-2xl font-bold text-blue-600 mb-6">
                  🚀 Career Guidance for {guidance.profession}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* Career Paths */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-700 mb-3">
                      📈 Career Paths
                    </h4>
                    {parsedGuidance["Career Paths"]?.map((item, i) => (
                      <div key={i} className="bg-white p-2 rounded mb-2 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Business */}
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-700 mb-3">
                      💼 Business Opportunities
                    </h4>
                    {parsedGuidance["Business Opportunities"]?.map((item, i) => (
                      <div key={i} className="bg-white p-2 rounded mb-2 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Tools */}
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-yellow-700 mb-3">
                      🛠️ Digital Tools
                    </h4>
                    {parsedGuidance["Recommended Digital Tools"]?.map((item, i) => (
                      <div key={i} className="bg-white p-2 rounded mb-2 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Training */}
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-purple-700 mb-3">
                      🎓 Training Programs
                    </h4>
                    {parsedGuidance["Training Programs"]?.map((item, i) => (
                      <div key={i} className="bg-white p-2 rounded mb-2 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>

                </div>

                <button
                  onClick={() => setGuidance(null)}
                  className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            )}

            {/* WORKERS TABLE */}
            <div className="bg-white rounded-xl shadow">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Worker</th>
                    <th className="p-4">Profession</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id} className="border-t">
                      <td className="p-4">
                        <div className="font-semibold">{worker.name}</div>
                        <div className="text-sm text-gray-400">{worker.location}</div>
                      </td>

                      <td className="p-4">
                        {worker.profession} ({worker.experience}y)
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => getGuidance(worker)}
                          className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueCollar;