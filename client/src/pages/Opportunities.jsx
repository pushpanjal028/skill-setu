import { useNavigate } from "react-router-dom";
function Opportunities() {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-10 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold">
          Job Opportunities
        </h1>

        <p className="mt-4 text-gray-600">
          Here you will see recommended jobs based on your skills.
        </p>

      </div>

    </div>
  );
}

export default Opportunities;