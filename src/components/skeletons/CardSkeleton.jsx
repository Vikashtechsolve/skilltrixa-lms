import React from "react";
import BaseSkeleton from "./BaseSkeleton";
import TextSkeleton from "./TextSkeleton";
import ImageSkeleton from "./ImageSkeleton";

/**
 * Generic card skeleton - base for all card types
 */
const CardSkeleton = ({ 
  className = "",
  showImage = true,
  showTitle = true,
  showDescription = false,
  imageAspectRatio = "aspect-video"
}) => {
  return (
    <div className={`bg-[#121212] rounded-xl overflow-hidden ${className}`}>
      {showImage && (
        <ImageSkeleton 
          className="w-full"
          aspectRatio={imageAspectRatio}
          rounded="rounded-t-xl"
        />
      )}
      <div className="p-3 space-y-2">
        {showTitle && (
          <TextSkeleton lines={1} width="3/4" height="h-4" />
        )}
        {showDescription && (
          <TextSkeleton lines={2} width="full" height="h-3" gap="gap-1" />
        )}
      </div>
    </div>
  );
};

export default CardSkeleton;

