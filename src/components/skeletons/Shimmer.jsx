import React from "react";

/**
 * Shimmer effect component - Netflix style loading animation
 */
const Shimmer = ({ className = "" }) => {
  return (
    <div
      className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`}
    />
  );
};

export default Shimmer;

