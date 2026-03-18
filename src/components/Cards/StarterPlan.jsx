import React from "react";

/**
 * StarterPlan
 * props:
 *  - selected: string (id of currently selected plan)
 *  - onSelect: (id) => void
 *  - disabled: boolean (blurred, not clickable - e.g. when free plan already expired)
 */
export default function StarterPlan({ selected, onSelect, disabled = false }) {
  const id = "starter";
  const isSelected = selected === id;

  const features = [
    "Website Overview",
    "Access to all playlist cards",
    "Masterclass cards visible (content locked)",
    "Blogs cards visible (content locked)",
    "News cards visible (content locked)",
    "Playlist details (Notes, Videos, PPT, Test not accessible)",
    "Doubt session access",
    "Mentor connect",
    "Live masterclass access"
  ];

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(id)}
      disabled={disabled}
      className={`relative text-left rounded-2xl overflow-hidden border p-0 transition-shadow focus:outline-none w-full
        ${disabled ? "pointer-events-none select-none blur-[3px] opacity-90 cursor-not-allowed" : "cursor-pointer"}
        ${isSelected ? "ring-2 ring-blue-400 shadow-lg" : "border-gray-200 shadow-sm"}`}
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      <div className="rounded-t-2xl text-center px-6 py-6 bg-gradient-to-r from-[#244a94] to-[#2f5aa8] text-white">
        <h3 className="text-lg font-semibold">Starter Plan</h3>
        <p className="text-sm mt-1 opacity-90">Start learning with essential access</p>
        <p className="text-xs mt-2 opacity-75">Free • Valid for 24 hours</p>
      </div>

      <div className="bg-white p-12 border-t border-gray-200">
        <ul className="space-y-3">
          {features.map((f, i) => {
            // mark later features as disabled (to match screenshot)
            const isDisabled = i >= 5;
            return (
              <li key={i} className="flex items-start gap-3">
                <span className={`flex-shrink-0 mt-1 ${isDisabled ? "text-red-500" : "text-green-500"}`}>
                  {isDisabled ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>

                <span className={`${isDisabled ? "text-gray-500 line-through text-sm" : "text-gray-700 text-sm leading-6"}`}>
                  {f}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </button>
  );
}
