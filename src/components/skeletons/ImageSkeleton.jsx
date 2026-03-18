import React from "react";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Image skeleton - for thumbnails, avatars, etc.
 */
const ImageSkeleton = ({ 
  className = "",
  aspectRatio = "aspect-video",
  rounded = "rounded",
  size = null // e.g., "w-32 h-32" for fixed size
}) => {
  const baseClasses = size || aspectRatio;
  
  return (
    <BaseSkeleton
      className={`${baseClasses} ${rounded} ${className}`}
    />
  );
};

export default ImageSkeleton;

