import React from "react";

export default function OrgDashboard() {

  const handleDownload = async () => {
    try {
      const res = await fetch("http://localhost:5005/download-csv"); // 🔥 FIXED URL
      
      if (!res.ok) {
        alert("Download failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Error downloading file");
    }
  };

  return (

    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1554007460-791a7b8945d8?q=80&w=1339&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" // Parliament type image
      }}
    >

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* CONTENT */}
      <div className="relative z-10 p-10 text-white">

        <h1 className="text-3xl font-bold text-center mb-8">
          🏛️ Government Dashboard
        </h1>

        {/* DOWNLOAD BUTTON */}
        <div className="text-center mb-6">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700"
          >
            📥 Download Student Data (CSV)
          </button>
        </div>

        {/* INFO CARD */}
        <div className="max-w-xl mx-auto bg-slate-300  text-black  p-5 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">
            Data Export System
          </h2>
          <p className="text-gray-700">
            Click the button above to download complete user data in CSV format.
          </p>
        </div>

      </div>

    </div>
  );
}