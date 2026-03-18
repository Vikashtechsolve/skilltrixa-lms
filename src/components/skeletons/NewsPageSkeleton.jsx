import React from "react";
import NewsCardHSkeleton from "./NewsCardHSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * News page skeleton - matches News.jsx layout
 */
const NewsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-black pb-20 pt-10">
      {/* Page Header */}
      <div className="flex flex-col items-center justify-center mb-10">
        <TextSkeleton lines={1} width="1/6" height="h-8" />
      </div>

      {/* News List Container */}
      <div className="px-4 md:px-0 max-w-[1110px] mx-auto space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <NewsCardHSkeleton key={i} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-12 text-center">
        <div className="inline-block w-32 h-8 bg-[#121212] rounded"></div>
      </div>
    </div>
  );
};

export default NewsPageSkeleton;

