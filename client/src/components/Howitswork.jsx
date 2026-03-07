import { useNavigate } from "react-router-dom";

function HowItWorks() {

  const navigate = useNavigate();   // navigation hook

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            How Skill Setu Works
          </h2>
          <p className="text-gray-600 mt-4">
            Follow simple steps to improve your skills and find opportunities
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 mt-14">

          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-blue-600">
              Create Profile
            </h3>
            <p className="text-gray-600 mt-3">
              Sign up and build your profile by adding your skills and interests.
            </p>
          </div>

          {/* Step 2 - CLICKABLE */}
          <div
            onClick={() => navigate("/skill-analysis")}
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg hover:cursor-pointer transition text-center"
          >
            <div className="text-4xl mb-4">📊</div>

            <h3 className="text-xl font-semibold text-blue-600">
              Skill Analysis
            </h3>

            <p className="text-gray-600 mt-3">
              Our system analyzes your skills and identifies the gaps based on industry demand.
            </p>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => navigate("/opportunities")}
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center cursor-pointer"
          >
            <div className="text-4xl mb-4">💼</div>

            <h3 className="text-xl font-semibold text-blue-600">
              Get Opportunities
            </h3>

            <p className="text-gray-600 mt-3">
              Discover relevant training programs and job opportunities near you.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;