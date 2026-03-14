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

        // optional: save token
        localStorage.setItem("token", res.data.token);

       navigate("/profile")// redirect after login

      }

    } catch (err) {

      console.log(err.response?.data || err);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="abc@gmail.com"
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-indigo-500"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?

          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Register
          </span>

        </p>

      </div>

    </div>
  );
}

export default Login;