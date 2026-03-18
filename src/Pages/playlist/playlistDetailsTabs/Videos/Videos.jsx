import React from "react";
import HLSVideoPlayer from "../../../../components/HLSVideoPlayer";

/**
 * Videos component for playlist sessions
 * Uses HLS streaming with download prevention
 */
const Videos = ({ data, title, playlistName, moduleName, sessionName, sessionDescription, sessionId }) => {
  if (!data || !data.url) {
    return (
      <div className="text-gray-300">
        <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg font-semibold mb-2">No Video Available</p>
            <p className="text-sm">This session does not have a video yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // Format title: Playlist name | Module name | Session name
  const displayTitle = title || (playlistName && moduleName && sessionName 
    ? `${playlistName} | ${moduleName} | ${sessionName}`
    : data.title || "Video");

  return (
    <div className="text-gray-300">
      <div className="mb-4 text-left">
        {sessionDescription && (
          <p className="mb-6 text-gray-400">{sessionDescription}</p>
        )}
      </div> 

      {/* HLS Video Player */}
      <HLSVideoPlayer
        src={data.url}
        title={data.title || "Video"}
        sessionId={sessionId}
        onError={(error) => {
          console.error("Video playback error:", error);
        }}
      />
    </div>
  );
};

export default Videos;
