import React from "react";
import CardSkeleton from "./CardSkeleton";

/**
 * Playlist card skeleton - matches PlaylistCard component
 */
const PlaylistCardSkeleton = ({ className = "" }) => {
  return (
    <CardSkeleton
      className={`min-w-[280px] sm:min-w-[300px] ${className}`}
      showImage={true}
      showTitle={true}
      showDescription={false}
      imageAspectRatio="aspect-video"
    />
  );
};

export default PlaylistCardSkeleton;

