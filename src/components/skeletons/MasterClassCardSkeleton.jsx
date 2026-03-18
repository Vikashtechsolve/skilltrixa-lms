import React from "react";
import CardSkeleton from "./CardSkeleton";

/**
 * Master class card skeleton - matches MasterClassCard component
 */
const MasterClassCardSkeleton = ({ className = "" }) => {
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

export default MasterClassCardSkeleton;

