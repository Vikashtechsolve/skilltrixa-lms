import React from "react";
import ProgressCardSkeleton from "./ProgressCardSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * Profile progress page skeleton - matches StudentProgress.jsx layout
 */
const ProfileProgressSkeleton = () => {
  return (
    <div className="flex bg-[#141414] pt-16 min-h-screen text-left">
      {/* Sidebar placeholder */}
      <div className="mt-0 px-0 md:mt-8 md:px-12">
        <div className="w-48"></div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 text-white px-6 py-8">
        <TextSkeleton lines={1} width="1/6" height="h-10" className="mb-6" />
        
        {/* Heading */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-6 h-6 bg-[#121212] rounded"></div>
          <TextSkeleton lines={1} width="1/4" height="h-6" />
        </div>
        <TextSkeleton lines={1} width="1/2" height="h-4" className="mb-8" />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProgressCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressSkeleton;

