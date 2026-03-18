import React from "react";
import ImageSkeleton from "./ImageSkeleton";
import TextSkeleton from "./TextSkeleton";
import BaseSkeleton from "./BaseSkeleton";

/**
 * News details page skeleton - matches NewsDetails.jsx layout
 */
const NewsDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-black pb-20 pt-10">
      <div className="px-4 md:px-0 max-w-[1110px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10">
          <TextSkeleton lines={1} width="1/3" height="h-8" />
        </div>

        {/* Main Content */}
        <article className="space-y-6">
          {/* Title */}
          <TextSkeleton lines={2} width="full" height="h-8" gap="gap-2" />
          
          {/* Meta info */}
          <div className="flex items-center gap-4">
            <BaseSkeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <TextSkeleton lines={1} width="1/4" height="h-4" />
              <TextSkeleton lines={1} width="1/6" height="h-3" />
            </div>
          </div>

          {/* Featured Image */}
          <ImageSkeleton 
            className="w-full"
            aspectRatio="aspect-video"
            rounded="rounded-lg"
          />

          {/* Content */}
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <TextSkeleton 
                key={i} 
                lines={Math.random() > 0.5 ? 1 : 2} 
                width="full" 
                height="h-4" 
                gap="gap-2"
              />
            ))}
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <BaseSkeleton key={i} className="w-20 h-6 rounded-full" />
            ))}
          </div>
        </article>

        {/* Related News */}
        <div className="mt-12">
          <TextSkeleton lines={1} width="1/4" height="h-6" className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#161616] border border-[#242424] rounded-xl overflow-hidden">
                <ImageSkeleton aspectRatio="aspect-video" rounded="rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <TextSkeleton lines={1} width="full" height="h-5" />
                  <TextSkeleton lines={2} width="full" height="h-3" gap="gap-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsSkeleton;

