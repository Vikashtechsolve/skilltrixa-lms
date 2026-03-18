import React from "react";
import SidebarSkeleton from "./SidebarSkeleton";
import VideoSkeleton from "./VideoSkeleton";
import TextSkeleton from "./TextSkeleton";
import BaseSkeleton from "./BaseSkeleton";

/**
 * Playlist details page skeleton - matches PlaylistDetails.jsx layout
 * Uses grid layout: col-span-12 grid with sidebar (col-span-3) and main (col-span-9)
 */
const PlaylistDetailsSkeleton = () => {
  return (
    <div className="bg-[#0b0b0c] text-white min-h-screen py-4">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 grid grid-cols-12 gap-6">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block col-span-3">
          <SidebarSkeleton />
        </div>

        {/* MAIN CONTENT */}
        <main className="col-span-12 md:col-span-9">
          {/* Header Card */}
          <div className="bg-[#121212] border border-[#232323] rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <BaseSkeleton key={i} className="w-16 h-7 rounded" />
                  ))}
                </div>
                
                {/* Title */}
                <TextSkeleton lines={1} width="1/3" height="h-7" className="mb-2" />
                
                {/* Description */}
                <TextSkeleton lines={2} width="full" height="h-4" gap="gap-2" className="mb-4" />
                
                {/* Date */}
                <TextSkeleton lines={1} width="1/4" height="h-3" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <BaseSkeleton key={i} className="w-10 h-10 rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-[#151516] border border-[#232323] rounded-xl overflow-hidden">
            {/* Title bar */}
            <div className="py-4 border-b border-[#232323]">
              <div className="px-7">
                <TextSkeleton lines={1} width="1/4" height="h-7" />
              </div>
            </div>

            {/* Video/Content area */}
            <div className="px-6 py-6">
              <VideoSkeleton />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlaylistDetailsSkeleton;

