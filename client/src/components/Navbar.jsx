import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo2.jpeg";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
    navigate("/")
  };

  const isLoggedIn = !!user;

  const activeClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="w-full stick top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-0 py-0 logo flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex flex-col items-center cursor-pointer leading-tight"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="
          h-24 w-auto 
          -mt-3
          object-contain
          " />
          {/* <span className="text-xs font-semibold text-blue-600 font-serif">
          </span> */}
        </div>


        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={activeClass("/")}>Home</Link>
          <Link to="/jobana" className={activeClass("/jobana")}>Job Analysis</Link>
          <Link to="/profile" className={activeClass("/profile")}>Dashboard</Link>

          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span>👤 {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* 🍔 Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 flex flex-col gap-4 shadow">

          <Link to="/" onClick={() => setMenuOpen(false)} className={activeClass("/")}>
            Home
          </Link>

          <Link to="/jobana" onClick={() => setMenuOpen(false)} className={activeClass("/jobana")}>
            Job Analysis
          </Link>

          <Link to="/profile" onClick={() => setMenuOpen(false)} className={activeClass("/profile")}>
            Dashboard
          </Link>

          {!isLoggedIn ? (
            <>
              <button onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                Login
              </button>

              <button
                onClick={() => { navigate("/register"); setMenuOpen(false); }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span>👤 {user?.name}</span>

              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
        
      )}
    </nav>
  );
}

export default Navbar;