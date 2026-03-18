import React from "react";
import BaseSkeleton from "./BaseSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * Sidebar skeleton - for playlist details sidebar
 */
const SidebarSkeleton = ({ className = "" }) => {
  return (
    <div className={`w-full bg-[#121212] border border-[#232323] rounded-xl p-4 space-y-4 ${className}`}>
      {/* Module items */}
      {Array.from({ length: 3 }).map((_, moduleIndex) => (
        <div key={moduleIndex} className="space-y-2">
          {/* Module header */}
          <div className="flex items-center justify-between">
            <TextSkeleton lines={1} width="1/2" height="h-5" />
            <BaseSkeleton className="w-4 h-4 rounded" />
          </div>
          
          {/* Session items */}
          <div className="ml-4 space-y-2">
            {Array.from({ length: 2 }).map((_, sessionIndex) => (
              <div key={sessionIndex} className="flex items-center gap-2">
                <BaseSkeleton className="w-2 h-2 rounded-full" />
                <TextSkeleton lines={1} width="3/4" height="h-4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;

