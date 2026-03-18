import React from "react";
import BaseSkeleton from "./BaseSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * Progress card skeleton - for profile progress page
 */
const ProgressCardSkeleton = ({ className = "" }) => {
  return (
    <div className={`bg-[#141414] p-5 rounded-xl shadow border border-white/10 ${className}`}>
      {/* Icon and title */}
      <div className="flex items-center gap-3 mb-4">
        <BaseSkeleton className="w-6 h-6 rounded" />
        <TextSkeleton lines={1} width="1/2" height="h-4" />
      </div>
      
      {/* Main stat */}
      <TextSkeleton lines={1} width="2/3" height="h-6" className="mb-2" />
      
      {/* Progress bar */}
      <BaseSkeleton className="w-full h-3 rounded-full mb-3" />
      
      {/* Description */}
      <TextSkeleton lines={1} width="full" height="h-3" />
    </div>
  );
};

export default ProgressCardSkeleton;

