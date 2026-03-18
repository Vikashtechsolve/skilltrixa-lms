import React from "react";
import CardSkeleton from "./CardSkeleton";

/**
 * News card skeleton - matches NewsCard component (carousel version)
 */
const NewsCardSkeleton = ({ className = "" }) => {
  return (
    <CardSkeleton
      className={`min-w-[280px] sm:min-w-[300px] ${className}`}
      showImage={true}
      showTitle={true}
      showDescription={true}
      imageAspectRatio="aspect-video"
    />
  );
};

export default NewsCardSkeleton;

