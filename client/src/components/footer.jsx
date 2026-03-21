import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {/* About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Skill Setu
          </h2>
          <p className="text-gray-400">
            Skill Setu helps students and professionals bridge the gap between
            their skills and real job opportunities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white">Home</Link>
            </li>
            <li>
              <Link to="/jobana" className="hover:text-white">Job Analysis</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white">Dashboard</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">Login</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Contact
          </h3>

          <p>Email: setuskill332@gmail.com</p>
          <p className="mt-2">Phone: +91 9876543210</p>
          <p className="mt-2">Location: India</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Skill Setu. All rights reserved.
      </div>
      
    </footer>
  );
}

export default Footer;