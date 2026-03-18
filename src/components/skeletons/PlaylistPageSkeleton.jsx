import React from "react";
import PlaylistCardSkeleton from "./PlaylistCardSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * Playlist page skeleton - matches playlist.jsx layout
 */
const PlaylistPageSkeleton = () => {
  return (
    <div className="bg-black text-white py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <TextSkeleton lines={1} width="1/6" height="h-10" className="mb-6 sm:mb-8" />
          
          {/* Grid - Show more cards to fill screen */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <PlaylistCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPageSkeleton;

