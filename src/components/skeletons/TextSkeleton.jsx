import React from "react";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Text line skeleton - for titles, descriptions, etc.
 */
const TextSkeleton = ({ 
  lines = 1, 
  width = "full", 
  height = "h-4",
  className = "",
  gap = "gap-2"
}) => {
  const widthClasses = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "1/4": "w-1/4",
  };

  return (
    <div className={`flex flex-col ${gap} ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <BaseSkeleton
          key={index}
          className={`${height} ${widthClasses[width] || width}`}
        />
      ))}
    </div>
  );
};

export default TextSkeleton;

