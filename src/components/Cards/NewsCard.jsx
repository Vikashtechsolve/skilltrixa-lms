// src/components/Cards/PlaylistCard.jsx
import React from "react";
import { Play, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ item }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // navigate to detail page
    const newsId = item.id || item._id;
    if (newsId) {
      navigate(`/app/News/${newsId}`);
    }
  };

  const handleAddClick = (e) => {
    // prevent card click while interacting with add button
    e.stopPropagation();
    // TODO: handle add-to-playlist logic here
    console.log("Add clicked for", item.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-[90%] sm:w-[45%] md:w-70 flex-shrink-0 cursor-pointer"
    >
      <div
        className="group relative rounded-2xl transition-all duration-500 transform-gpu hover:scale-125 hover:z-50"
        style={{ overflow: "visible" }}
      >
        {/* NORMAL CARD */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* BADGES */}
        {/* <div className="absolute bottom-9 right-3 text-white text-xs px-3 py-1 rounded-full">
          {item.duration || "1h 45m"}
        </div>
        <div className="absolute bottom-8 left-3  p-2 rounded-full">
          <Play size={18} fill="white" />
        </div> */}

        {/* TITLE */}
        <p className="text-white mt-3 text-left ml-2 font-semibold text-sm px-1">
          {item.title}
        </p>

        {/* EXPANDED ON HOVER */}
        <div
          className="
        absolute inset-0 rounded-xl
        bg-black/70 backdrop-blur-xl
        opacity-0 group-hover:opacity-100 
        transition-all duration-300
        h-72 z-50 flex flex-col
      
      "
        >
          {/* TOP HALF - IMAGE */}
          <div className="h-40 rounded-t-xl overflow-hidden mb-">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* BOTTOM HALF CONTENT */}
          <div className="flex flex-col gap-3 text-white">
            {/* BUTTONS */}
            <div className="flex items-center gap-1 px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newsId = item.id || item._id;
                  if (newsId) {
                    navigate(`/app/News/${newsId}`);
                  }
                }}
                className="mt-2 bg-white text-black font-semibold px-5 py-2 rounded-md flex items-center gap-2 text-sm w-full cursor-pointer"
              >
                <Play size={18} fill="black" /> Read Now
              </button>

              <button onClick={handleAddClick} className="mt-2 border border-gray-600 rounded bg-gray-600 p-2 text-white">
                <Plus size={18} fill="grey" />
              </button>
            </div>

            {/* YEAR + MODULES */}
            

            {/* DESCRIPTION */}
            <p className="text-gray-300 px-2 text-xs text-left leading-relaxed">
              {item.description ||
                "Create stunning web apps with React. Learn components, hooks, APIs, and deployment with real-world projects."}
            </p>

            <div className="flex px-2 justify-between text-xs font-medium">
              <span>Published By: {item.publishedBy}</span>
              <span>{item.date }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
