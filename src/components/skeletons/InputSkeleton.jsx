import React from "react";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Input field skeleton - for form inputs
 */
const InputSkeleton = ({ 
  className = "",
  width = "w-full"
}) => {
  return (
    <BaseSkeleton
      className={`${width} h-10 border-b border-white/20 ${className}`}
    />
  );
};

export default InputSkeleton;

