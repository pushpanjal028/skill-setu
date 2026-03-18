import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(user.name);
    navigate("/");
  };
const isLoggedIn = !!localStorage.getItem("token");
  // Active link style
  const activeClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-sm border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
        >
          Skill Setu
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/" className={activeClass("/")}>Home</Link>
          <Link to="/jobana" className={activeClass("/jobana")}>
            Job Analysis
          </Link>
          <Link to="/Profile" className={activeClass("/Profile")}>
            Dashboard
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          {!user ? (
            <>
              <button
                onClick={() => navigate("/Login")}
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/Register")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">

              {/* Profile */}
              <div 
              onClick={()=> navigate ("/Profile")}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">
                  👤 {user.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-white hover:text-black text-sm  px-3 py-4 bg-blue-500 rounded-full"
              >
                Logout
              </button>

            </div>
          )}

        </div>
        
      </div>

    </nav>
  );
}

export default Navbar;