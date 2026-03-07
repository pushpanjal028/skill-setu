import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">
          Skill Setu
        </h1>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-blue-600 font-medium">
            Login
          </button>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;