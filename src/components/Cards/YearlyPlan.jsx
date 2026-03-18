import React from "react";

/**
 * YearlyPlan
 * props:
 *  - selected: string
 *  - onSelect: (id) => void
 */
export default function YearlyPlan({ selected, onSelect }) {
  const id = "yearly";
  const isSelected = selected === id;

  const features = [
    "Website Overview",
    "Access to all playlist cards",
    "Full playlist content (Notes, Videos, PPT, Test)",
    "Masterclass cards + complete content access",
    "Blog cards + full blog access",
    "News cards + full article access",
    "Doubt session — 1 hour 30 min",
    "Mentor connect — 1 hour 30 min",
    "Live masterclass access — 1 hour"
  ];

  return (
    <button
      onClick={() => onSelect(id)}
      className={`relative text-left rounded-2xl overflow-hidden border mb- p-0 transition-shadow focus:outline-none w-full
        ${isSelected ? "ring-2 ring-blue-400 shadow-lg" : "border-gray-200 shadow-sm"}`}
      aria-pressed={isSelected}
    >
      <div className="rounded-t-2xl text-center px-6 py-6 mb-6  bg-gradient-to-r from-[#2a4b7a] to-[#b9302b] text-white">
        <h3 className="text-lg font-semibold">Yearly Plan</h3>
        <p className="text-sm mt-1 opacity-90">Maximum value. Unlimited learning for a full year</p>
      </div>

      <div className="bg-white p-6 border-t border-gray-200">
        <div className="mb-4 ">
          <div className="text-sm text-gray-400">Yearly Price</div>
          <div className="text-xl font-semibold text-gray-800">₹499</div>
        </div>

        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 text-green-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <span className="text-gray-700 text-sm leading-6">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
