import React from "react";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Full page loading overlay - for route transitions
 */
const PageLoader = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;

