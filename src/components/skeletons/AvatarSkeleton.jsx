import React from "react";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Avatar skeleton - circular profile image placeholder
 */
const AvatarSkeleton = ({ 
  size = "w-48 h-48",
  className = ""
}) => {
  return (
    <BaseSkeleton
      className={`${size} rounded-full ${className}`}
    />
  );
};

export default AvatarSkeleton;

