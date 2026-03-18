import React from "react";

// This is the Test Summary page (your first screenshot)
const TestSummary = ({ data, onAttemptNow, isStarting }) => {
  return (
    <div className="text-gray-300">
      {/* 1. Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Test - {data.title}
          </h2>
          <p className="text-sm text-left text-gray-400 mt-2.5">
            Last modified on: {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>
      {data.description && (
        <p className="text-md text-gray-400 text-left mb-2">{data.description}</p>
      )}
      <hr className="border-gray-700 my-" />

      {/* 2. Test Analysis Box */}
      <div className="bg-Zinc-900 text-left p-6 rounded-lg ">
        <h3 className="text-lg font-semibold text-white mb-4">
         {data.title}
        </h3>
        <ul className="space-y-3 text-left text-gray-300 font-bold">
          <li className="flex gap-4">
            <span className="font-medium">Total Questions :</span>
            <span>{data.totalQuestions}</span>
          </li>
          <li className="flex gap-4">
            <span className="font-medium">Test Duration :</span>
            <span>{data.duration}</span>
          </li>
          <li className="flex gap-4">
            <span className="font-medium">Difficulty Level :</span>
            <span className="capitalize">{data.difficulty}</span>
          </li>
          {data.passingScorePercent && (
            <li className="flex gap-4">
              <span className="font-medium">Passing Score :</span>
              <span>{data.passingScorePercent}%</span>
            </li>
          )}
        </ul>

        {/* 3. Attempt Now Button */}
        <div className="text-left mt-8">
          <button
            onClick={onAttemptNow}
            disabled={isStarting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? "Starting..." : "Attempt Now"}
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default TestSummary;
