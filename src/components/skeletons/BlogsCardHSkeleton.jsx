import React from "react";
import BaseSkeleton from "./BaseSkeleton";
import TextSkeleton from "./TextSkeleton";
import ImageSkeleton from "./ImageSkeleton";

/**
 * Horizontal blog card skeleton - matches BlogsCardH component
 */
const BlogsCardHSkeleton = ({ className = "" }) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 bg-[#161616] border border-[#242424] rounded-xl p-4 ${className}`}>
      {/* Image */}
      <ImageSkeleton
        className="w-full sm:w-64 h-48 sm:h-40 flex-shrink-0"
        aspectRatio=""
        rounded="rounded-lg"
      />
      
      {/* Content */}
      <div className="flex-1 space-y-3">
        <TextSkeleton lines={1} width="full" height="h-6" />
        <TextSkeleton lines={2} width="full" height="h-4" gap="gap-2" />
        <div className="flex items-center gap-4">
          <TextSkeleton lines={1} width="1/4" height="h-3" />
          <TextSkeleton lines={1} width="1/4" height="h-3" />
        </div>
      </div>
    </div>
  );
};

export default BlogsCardHSkeleton;

