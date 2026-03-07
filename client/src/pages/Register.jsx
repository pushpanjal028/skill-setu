import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Profile
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
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