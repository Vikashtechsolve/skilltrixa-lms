import React, { useState } from "react";
import { Play, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WATCHLIST_KEY = "watchlistItems";

const BlogsCard = ({ item }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    // navigate to detail page
    const blogId = item.id || item._id;
    if (blogId) {
      navigate(`/app/Blogs/${blogId}`);
    }
  };

  const addToWatchlist = (item) => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      const list = raw ? JSON.parse(raw) : [];

      const exists = list.some((i) => i.id === item.id);
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
    e.stopPropagation(); // card navigation stop
    addToWatchlist(item);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-[90%] sm:w-[45%] md:w-70 flex-shrink-0 cursor-pointer"
    >
      <div
        className="relative rounded-2xl transition-all duration-500 transform-gpu hover:scale-125 hover:z-50"
        style={{ overflow: "visible" }}
      >
        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* TITLE */}
        <p className="text-white mt-3 font-semibold text-sm px-1">
          {item.title}
        </p>

        {/* HOVER OVERLAY */}
        <div
          className="
            absolute inset-0 rounded-xl
            bg-neutral-900 backdrop-blur-xl
            opacity-0 hover:opacity-100
            transition-all duration-300
            h-72 z-50 flex flex-col
          "
        >
          {/* TOP IMAGE */}
          <div className="h-40 rounded-t-xl overflow-hidden">
            <img
               src={item.thumbnail || item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 px-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const blogId = item.id || item._id;
                if (blogId) {
                  navigate(`/app/Blogs/${blogId}`);
                }
              }}
              className="bg-white text-black font-semibold px-5 py-2 rounded-md flex items-center gap-2 text-sm w-full"
            >
              <Play fill="black" size={18} /> Continue Reading
            </button>

            {/* ADD TO WATCHLIST */}
            <button
              onClick={handleAddClick}
              className="border cursor-pointer border-gray-600 rounded bg-gray-600 p-2 text-white relative group"
            >
              {/* PLUS ICON */}
              <Plus
                size={18}
                className={`${
                  added ? "opacity-0" : "opacity-100"
                } transition`}
              />

              {/* HOVER TEXT */}
              {!added && (
                <span
                  className="absolute left-8 bottom-10 transform -translate-x-1/2 mt-1
                  text-xs bg-black px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition"
                >
                  Watchlist
                </span>
              )}

              {added && (
                <span
                  className="absolute left-8 bottom-10 transform -translate-x-1/2 mt-1
                  text-xs bg-black px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition"
                >
                  Added
                </span>
              )}

              {/* CHECK ICON */}
              {added && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                  <Check />
                </span>
              )}
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-4 text-gray-300 text-xs px-2 leading-relaxed">
            {item.description ||
              "This playlist covers modern development with hands-on projects & tutorials"}
          </div>

          {/* FOOTER */}
          <div className="mb-2 mt-2 px-2 flex justify-between text-xs font-medium text-gray-300">
            <span>Published By: {item.publishedBy}</span>
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsCard;
