import React, { useState } from "react";
import { Play, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WATCHLIST_KEY = "watchlistItems";

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

const PlaylistCard = ({ item }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    // Use slug if available, otherwise fallback to _id
    const playlistIdentifier = item.slug || item._id || item.id;
    navigate(`/app/playlist/${playlistIdentifier}`);
  };

  const addToWatchlist = (item) => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      const list = raw ? JSON.parse(raw) : [];

      const itemId = item._id || item.id;
      const exists = list.some((i) => (i._id || i.id) === itemId);
      if (!exists) {
        list.push(item);
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("watchlistUpdated"));
        setAdded(true);
      } else {
        setAdded(true);
      }
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToWatchlist(item);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-[90%] sm:w-[45%] md:w-70 shrink-0 cursor-pointer "
    >
      {/* NOTE: parent no longer uses the "group" class */}
      <div
        className="relative rounded-2xl transition-all duration-500 transform-gpu hover:scale-125 hover:z-50"
        style={{ overflow: "visible" }}
      >
        {/* NORMAL CARD */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src={item.thumbnailUrl || item.thumbnail || "/logo.svg"}
            alt={item.title}
            className="w-full h-52 object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* BADGES */}
        <div className="absolute bottom-9 right-3 text-white text-xs px-3 py-1 rounded-full">
          {item.totalDurationSeconds
            ? formatDuration(item.totalDurationSeconds)
            : item.duration || "1h 45m"}
        </div>
        <div className="absolute bottom-8 left-3 p-2 rounded-full">
          <Play size={18} fill="white" />
        </div>

        {/* TITLE */}
        <p className="text-white mt-3 text-left ml-2 font-semibold text-sm px-1">
          {item.title}
        </p>

        {/* EXPANDED ON HOVER (card-level hover still works via :hover instead of group-hover) */}
        <div
          className="
            absolute inset-0 rounded-xl
            bg-neutral-900 backdrop-blur-xl
            opacity-0 hover:opacity-100 
            transition-all duration-300
            h-72 z-50 flex flex-col 
          "
        >
          {/* TOP HALF */}
          <div className="h-40 rounded-t-xl overflow-hidden">
            <img
              src={item.thumbnailUrl || item.thumbnail || "/logo.svg"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* BOTTOM CONTENT */}
          <div className="flex flex-col gap-3 text-white px-4 py-2">
            {/* BUTTONS */}
            <div className="flex items-center gap-2 mt-2">
              {/* WATCH NOW BTN */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const playlistIdentifier = item.slug || item._id || item.id;
                  navigate(`/app/playlist/${playlistIdentifier}`);
                }}
                className="bg-white text-black font-semibold px-5 py-2 rounded-md flex items-center gap-2 text-sm w-full cursor-pointer"
              >
                <Play size={18} fill="black" /> Watch Now
              </button>

              {/* ADD TO WATCHLIST BTN */}
              {/* IMPORTANT: this button *is* the group (so hover text is tied to it only) */}
              <button
                onClick={handleAddClick}
                className="border cursor-pointer border-gray-600 rounded bg-gray-600 p-2 text-white relative group"
              >
                {/* PLUS ICON (hide when added) */}
                <Plus
                  size={18}
                  className={`${
                    added ? "opacity-0" : "opacity-100"
                  } transition`}
                />

                {/* HOVER TEXT → Watchlist (when not added) */}
                {!added && (
                  <span
                      className="absolute left-8 bottom-10 transform -translate-x-1/2 mt-1 
        text-xs bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Watchlist
                  </span>
                )}

                {/* CLICKED TEXT + CHECK → Added to Watchlist */}
                {added && (
                  <span
                    className="absolute left-8 bottom-10 transform -translate-x-1/2 mt-1 
      text-xs bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Added
                  </span>
                )}

                {/* CENTER CHECK ICON */}
                {added && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                    <Check />
                  </span>
                )}
              </button>
            </div>

            {/* DURATION + MODULES */}
            <div className="flex items-center justify-between text-sm font-medium gap-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Duration:</span>
                <span className="text-white font-semibold">
                  {item.totalDurationSeconds
                    ? formatDuration(item.totalDurationSeconds)
                    : item.duration || "0m"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Modules:</span>
                <span className="text-white font-semibold">
                  {item.modulesCount || item.modules || 0}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-xs text-left mb-2 leading-relaxed px-1 line-clamp-2">
              {item.description ||
                "Create stunning web apps with React. Learn components, hooks, APIs, and deployment with real-world projects."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
