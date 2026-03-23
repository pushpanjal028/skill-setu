import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({
      ...pre,
      [name]: value
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(formData);
    try {
      const res = await axios.post(`http://localhost:8000/user/register`, formData,{
        headers:{
          "Content-Type": "application/json"
        }
        
      })
     if(res.data.success){
       navigate("/verify-email");
     }
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Profile
        </h2>

        <input
          id=" Fullname"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your Full-Name"
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          id="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="abc@gmail.com"
          required
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          required
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
        />

        <button
          onClick={handleSubmit}
          type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-indigo-500"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?

          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Login
          </span>

        </p>

      </div>

    </div>
  );
}

export default Register;