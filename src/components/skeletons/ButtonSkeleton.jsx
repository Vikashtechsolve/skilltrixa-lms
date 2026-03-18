import React from "react";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Button skeleton - for loading button states
 */
const ButtonSkeleton = ({ 
  className = "",
  width = "w-24",
  height = "h-10"
}) => {
  return (
    <BaseSkeleton
      className={`${width} ${height} rounded ${className}`}
    />
  );
};

export default ButtonSkeleton;

