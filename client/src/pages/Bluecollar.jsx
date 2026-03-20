import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

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

  // Fetch workers
  const fetchWorkers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/workers`);
      setWorkers(res.data);
    } catch (error) {
      console.error("Backend not running", error);
    }
  };

  useEffect(() => {
  const loadWorkers = async () => {
    const res = await axios.get(`${API_BASE}/workers`);
    setWorkers(res.data);
  };

  loadWorkers();
}, []);
  // Form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add worker
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE}/add_worker`, formData);

      // Fix: correct localStorage usage
      localStorage.setItem("blueCollar", JSON.stringify(formData));

      setFormData({
        name: "",
        profession: "",
        experience: "",
        location: ""
      });

      fetchWorkers();
    } catch (error) {
      alert("Error saving worker");
    }
  };

  // Get AI guidance
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

  // Safe parsing (handles string or JSON)
  const parsedGuidance =
    guidance && typeof guidance.guidance === "string"
      ? JSON.parse(guidance.guidance)
      : guidance?.guidance;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          Blue Collar Career Portal
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Worker Registration */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Register Worker
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />

              <input
                name="profession"
                placeholder="Profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />

              <input
                name="experience"
                type="number"
                placeholder="Experience (years)"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
              >
                Save Worker
              </button>
            </form>
          </div>

          {/* Worker List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loading */}
            {loading && (
              <div className="bg-blue-100 p-4 rounded text-center">
                AI is generating career guidance...
              </div>
            )}

            {/* Guidance Display */}
            {guidance && parsedGuidance && (
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
                <h3 className="font-bold mb-4 text-lg">
                  Guidance for {guidance.profession}
                </h3>

                <div className="space-y-4">
                  {/* Career Paths */}
                  <div>
                    <h4 className="font-semibold">Career Paths</h4>
                    <ul className="list-disc ml-5">
                      {parsedGuidance["Career Paths"]?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Business Opportunities */}
                  <div>
                    <h4 className="font-semibold">Business Opportunities</h4>
                    <ul className="list-disc ml-5">
                      {parsedGuidance["Business Opportunities"]?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools */}
                  <div>
                    <h4 className="font-semibold">Digital Tools</h4>
                    <ul className="list-disc ml-5">
                      {parsedGuidance["Recommended Digital Tools"]?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Training */}
                  <div>
                    <h4 className="font-semibold">Training Programs</h4>
                    <ul className="list-disc ml-5">
                      {parsedGuidance["Training Programs"]?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setGuidance(null)}
                  className="text-red-500 mt-4"
                >
                  Close
                </button>
              </div>
            )}

            {/* Workers Table */}
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
                        <div className="font-semibold">
                          {worker.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {worker.location}
                        </div>
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