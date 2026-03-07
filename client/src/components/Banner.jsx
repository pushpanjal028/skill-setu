import { motion } from "framer-motion";
import bgimage from "../assets/hero.png";
import { useNavigate } from "react-router-dom";

function Banner() {

  const navigate = useNavigate();   // 👈 must be inside the function

  return (
    <section
      className="relative h-[80vh] px-20 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgimage})`,
      }}
    >

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center text-white px-6 max-w-3xl"
      >

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Bridge Your Skill Gap, Build Your Career
        </h1>

        <p className="mt-6 text-lg text-gray-200">
          AI-powered career guidance that maps your skills to real industry demand. Get personalized learning paths and job matches — all in one platform.
        </p>

        {/* 👇 Create Profile Button */}
        <button
          onClick={() => navigate("/register")}
          className="mt-9 bg-blue-900 px-6 py-3 rounded-lg text-white hover:bg-blue-700 transition"
        >
          Create Profile
        </button>

      </motion.div>

    </section>
  );
}

export default Banner;