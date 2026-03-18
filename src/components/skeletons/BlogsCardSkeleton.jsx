import React from "react";
import CardSkeleton from "./CardSkeleton";

/**
 * Blog card skeleton - matches BlogsCard component (carousel version)
 */
const BlogsCardSkeleton = ({ className = "" }) => {
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

export default BlogsCardSkeleton;

