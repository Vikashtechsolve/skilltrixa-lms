// components/Cards/MasterClassCard.jsx
import React, { useState, useEffect } from "react";
import { Play, Plus, CalendarCheck2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WATCHLIST_KEY = "watchlistItems";

const MasterClassCard = ({ item }) => {
  const navigate = useNavigate();

  // persisted: whether item exists in localStorage
  const [persistedAdded, setPersistedAdded] = useState(false);

  // true when user clicks add in THIS session — shows check immediately & permanently
  const [clickedThisSession, setClickedThisSession] = useState(false);

  // hover state for the watchlist button (ONLY button hover triggers tooltip / persisted-check reveal)
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const exists = list.some((i) => i.id === item.id);
      setPersistedAdded(!!exists);
    } catch (err) {
      console.error("Failed to check watchlist:", err);
    }
  }, [item.id]);

  const handleOpen = (e) => {
    e?.stopPropagation?.();
    const status = (item.status || "").toLowerCase();
    const identifier = item.slug || item.id; // Use slug if available, fallback to id

    if (status === "live") {
      navigate(`/app/LiveClass/${identifier}`, { state: { item } });
    } else if (status === "recorded") {
      navigate(`/app/recorded/${identifier}`, { state: { item } });
    } else if (status === "upcoming") {
      navigate(`/app/upcoming/${identifier}`, { state: { item } });
    } else {
      navigate(`/app/master-class/${identifier}`, { state: { item } });
    }
  };

  const addToWatchlist = (targetItem) => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      const list = raw ? JSON.parse(raw) : [];

      const exists = list.some((i) => i.id === targetItem.id);
      if (!exists) {
        list.push(targetItem);
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("watchlistUpdated"));
      }
      // mark persisted and clickedThisSession so UI shows check immediately after click
      setPersistedAdded(true);
      setClickedThisSession(true);
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToWatchlist(item);
  };

  // Show center check IF clicked this session, OR if persisted AND the *button* is hovered.
  const shouldShowCheck = clickedThisSession;
  // || (persistedAdded && btnHover);

  return (
    <div
      key={item.id}
      className="relative w-[90%] sm:w-[45%] md:w-70 flex-shrink-0 cursor-pointer"
    >
      <div
        className="relative rounded-2xl transition-all duration-500 transform-gpu hover:scale-125 hover:z-50 cursor-pointer"
        style={{ overflow: "visible" }}
        onClick={handleOpen}
      >
        <div className="rounded-2xl overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badge */}
          {item.status === "Upcoming" ||
          item.badge === "Upcoming Master Class" ? (
            <div
              className="
                absolute left-0 right-0 mx-auto
                w-[295px] top-40 px-2 py-1 text-xs
                sm:w-[280px] sm:top-40 sm:px-3 sm:py-1 sm:text-sm
                bg-zinc-700 text-yellow-400 
                flex items-center justify-center font-bold gap-2 rounded
              "
            >
              <CalendarCheck2 />
              {item.badge}
            </div>
          ) : item.status === "Live" || item.badge === "Live Now" ? (
            <div
              className=" absolute mx-auto
                w-[295px] top-40 px-2 py-1.5 text-sm
                sm:w-[280px] sm:top-40 sm:px-3 sm:py-1 sm:text-sm
                bg-zinc-700 text-white 
                flex items-center justify-center font-bold gap-2 rounded"
            >
              <span
                className="inline-block w-3 h-3 bg-red-500 rounded-full"
                aria-hidden="true"
              />
              {item.badge}
            </div>
          ) : item.status === "Recorded" || item.badge === "Recorded" ? (
            <div
              className=" absolute mx-auto
                w-[295px] top-40 px-2 py-1.5 text-sm
                sm:w-[280px] sm:top-40 sm:px-3 sm:py-1 sm:text-sm
                bg-zinc-700 text-white
                flex items-center justify-center font-bold gap-2 rounded"
            >
              {item.badge}
            </div>
          ) : (
            <div className="absolute left-3 bottom-3 bg-slate-700 text-white text-xs px-3 py-1 rounded-full">
              {item.badge}
            </div>
          )}
        </div>

        <p className="text-white mt-3 p-2 text-sm font-semibold">
          {item.title}
        </p>

        {/* Hover overlay */}
        <div
          className=" absolute inset-0 rounded-xl
            bg-neutral-900 backdrop-blur-xl
            opacity-0 hover:opacity-100 
            transition-all duration-300
            h-72 z-50 flex flex-col
          "
        >
          <div className="h-40 overflow-hidden rounded-t-xl">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-3 m-2 ">
            <button
              className="
           bg-white cursor-pointer text-black font-semibold
            px-2 py-1.5            /* mobile */
            sm:px-4 sm:py-2        /* laptop same */
            rounded-md
            flex items-center gap-1 sm:gap-2
            text-[11px] sm:text-sm
            w-full
"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
            >
              <Play size={18} fill="black" />
              {item.status === "Live" || item.badge === "Live Now"
                ? "Join Now"
                : item.status === "Recorded" || item.badge === "Recorded"
                ? "Watch"
                : item.status === "Upcoming" ||
                  item.badge === "Upcoming Master Class"
                ? "Upcoming Session"
                : "Watch"}
            </button>

            <button
              onClick={handleAddClick}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              aria-label={
                persistedAdded || clickedThisSession
                  ? "Added to watchlist"
                  : "Add to watchlist"
              }
              className="relative cursor-pointer flex items-center justify-center w-12 h-9 rounded-md border border-gray-600 bg-gray-600 text-white"
            >
              {/* PLUS ICON (visible when NOT showing check) */}
              {!shouldShowCheck && <Plus size={20} />}

              {/* CHECK ICON (visible when shouldShowCheck) */}
              {shouldShowCheck && <Check size={20} />}

              {/* TOOLTIP — only when hovering the BUTTON */}
              {btnHover && (
                <span className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs bg-black px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
                  {clickedThisSession ? "Added" : "Watchlist"}
                </span>
              )}
            </button>
          </div>

          <div className=" text-gray-300 px-3 p-2 text-sm">
            <p className="mt-2 text-gray-300 text-xs text-left leading-relaxed">
              {item.description || "Description will appear here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterClassCard;
