import React from "react";

/**
 * Base Skeleton Component with Netflix-style shimmer effect
 * Used as foundation for all skeleton loaders
 */
const BaseSkeleton = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`relative overflow-hidden bg-[#121212] rounded ${className}`}
      {...props}
    >
      {/* Shimmer animation overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      {children}
    </div>
  );
};

export default BaseSkeleton;

