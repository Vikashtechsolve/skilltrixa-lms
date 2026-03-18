import React from "react";

/**
 * Small inline spinner - for buttons, inline actions
 */
const InlineLoader = ({ size = "h-4 w-4", className = "" }) => {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-white ${size} ${className}`} />
  );
};

export default InlineLoader;

