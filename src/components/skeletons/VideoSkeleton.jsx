import React from "react";
import BaseSkeleton from "./BaseSkeleton";
import { Play } from "lucide-react";

/**
 * Video player skeleton - Netflix style video frame placeholder
 */
const VideoSkeleton = ({ className = "" }) => {
  return (
    <div className={`relative aspect-video w-full bg-black rounded-lg overflow-hidden ${className}`}>
      <BaseSkeleton className="absolute inset-0" />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/60 rounded-full p-4">
          <Play size={48} className="text-white ml-1" fill="white" />
        </div>
      </div>
      
      {/* Bottom controls placeholder */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
};

export default VideoSkeleton;

