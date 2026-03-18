import React from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function to format duration in seconds to readable format
const formatDuration = (seconds) => {
  if (!seconds) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
};

const ContinueWatchingCard = ({ item }) => {
  const navigate = useNavigate();
  const { playlist, currentSession, currentModule, progress } = item;

  const handleCardClick = () => {
    const playlistIdentifier = playlist.slug || playlist._id;
    navigate(`/app/playlist/${playlistIdentifier}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full cursor-pointer"
    >
      <div
        className="relative rounded-2xl transition-all duration-500 transform-gpu hover:scale-125 hover:z-50"
        style={{ overflow: "visible" }}
      >
        {/* NORMAL CARD */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src={playlist.thumbnailUrl || "/logo.svg"}
            alt={playlist.title}
            className="w-full h-52 object-cover transition-transform duration-500 hover:scale-110"
          />
          {/* Progress bar overlay */}
          {progress && progress.percent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          )}
        </div>

        {/* BADGES */}
        <div className="absolute bottom-9 right-3 text-white text-xs px-3 py-1 rounded-full">
          {playlist.totalDurationSeconds
            ? formatDuration(playlist.totalDurationSeconds)
            : "0m"}
        </div>
        <div className="absolute bottom-8 left-3 p-2 rounded-full">
          <Play size={18} fill="white" />
        </div>

        {/* TITLE */}
        <p className="text-white mt-3 text-left ml-2 font-semibold text-sm px-1">
          {playlist.title}
        </p>

        {/* EXPANDED ON HOVER */}
        <div
          className="
            absolute inset-0 rounded-xl
            bg-neutral-900 backdrop-blur-xl
            opacity-0 hover:opacity-100 
            transition-all duration-300
            h-72 z-50 flex flex-col overflow-hidden
          "
        >
          {/* TOP HALF */}
          <div className="h-40 rounded-t-xl overflow-hidden relative flex-shrink-0">
            <img
              src={playlist.thumbnailUrl || "/logo.svg"}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            {/* Progress bar on hover */}
            {progress && progress.percent > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            )}
          </div>

          {/* BOTTOM CONTENT */}
          <div className="flex flex-col gap-3 text-white px-4 py-2">
            {/* CONTINUE WATCHING BTN */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const playlistIdentifier = playlist.slug || playlist._id;
                navigate(`/app/playlist/${playlistIdentifier}`);
              }}
              className="bg-white text-black font-semibold px-5 py-2 rounded-md flex items-center gap-2 text-sm w-full cursor-pointer hover:bg-gray-200 transition mt-2"
            >
              <Play size={18} fill="black" /> Continue Watching
            </button>

            {/* CURRENT MODULE & SESSION INFO - Compact with truncation */}
            <div className="flex flex-col gap-1 text-xs">
              {currentModule && (
                <div className="flex items-start gap-1.5 min-w-0">
                  <span className="text-gray-400 whitespace-nowrap flex-shrink-0">Module:</span>
                  <span className="text-white font-medium truncate" title={currentModule.title}>
                    {currentModule.title}
                  </span>
                </div>
              )}
              {currentSession && (
                <div className="flex items-start gap-1.5 min-w-0">
                  <span className="text-gray-400 whitespace-nowrap flex-shrink-0">Session:</span>
                  <span className="text-white font-medium truncate" title={currentSession.title}>
                    {currentSession.title}
                  </span>
                </div>
              )}
            </div>

            {/* PROGRESS INFO - Compact */}
            {progress && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Progress:</span>
                  <span className="text-white font-semibold">{progress.percent}%</span>
                </div>
                {progress.lastWatchedAt && (
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {formatTimeAgo(progress.lastWatchedAt)}
                  </span>
                )}
              </div>
            )}

            {/* DESCRIPTION - Only show if there's space */}
            {(currentModule?.title?.length < 30 && currentSession?.title?.length < 30) && (
              <p className="text-gray-300 text-xs text-left leading-relaxed line-clamp-2 mb-2">
                {playlist.description || "Continue your learning journey..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingCard;

