import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("email", res.data.user.email);

        navigate("/profile");
      }

    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-00">

      {/* WHITE CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          🔐 Login
        </h2>

        {/* EMAIL */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-500">📧</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@gmail.com"
            required
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-500">🔒</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full pl-10 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Login
        </button>

        {/* REGISTER */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold cursor-pointer ml-1"
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;