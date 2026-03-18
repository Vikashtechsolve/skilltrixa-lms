import React, { useEffect, useState } from "react";
import Sidebar from "./ProfileSidebar";
import { Plus, Trash2 } from "lucide-react";
import Header from "../Header/Header";

const WATCHLIST_KEY = "watchlistItems";

const Watchlist = () => {
  const [items, setItems] = useState([]);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.error("Failed to read watchlist:", err);
      setItems([]);
    }
  };

  useEffect(() => {
    // initial load
    loadFromStorage();

    // listen for updates from PlaylistCard or other tabs
    const handler = () => loadFromStorage();
    window.addEventListener("watchlistUpdated", handler);

    // also handle storage events (other tabs)
    const storageHandler = (e) => {
      if (e.key === WATCHLIST_KEY) loadFromStorage();
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("watchlistUpdated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  const removeItem = (id) => {
    const filtered = items.filter((i) => i.id !== id);
    setItems(filtered);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("watchlistUpdated"));
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      {/* Sidebar */}
      <div className="flex pt-12 flex-col md:flex-row bg-[#141414] text-white min-h-screen">
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* Main */}
        <div className="flex-1 px-5 sm:px-8 md:px-10 py-8 md:py-10">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-semibold mb-8 md:mb-10 text-left">
            Profile
          </h1>

          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <Plus size={18} className="bg-[#232323] p-1 rounded" />
            <h1 className="text-xl sm:text-2xl font-semibold text-left">
              Watchlist
            </h1>
          </div>

          {items.length === 0 ? (
            <div
              className="
            bg-[#161616] 
            border border-[#242424] 
            rounded-xl 
            p-6 sm:p-10 
            flex flex-col items-center justify-center 
            text-center 
            min-h-[260px] sm:min-h-[200px] 
            w-full md:w-1/2 mx-auto
          "
            >
              <p className="text-lg font-medium mb-3">
                Your Watchlist Is Empty
              </p>

              <p className="text-sm text-[#C6C6C6] leading-6 max-w-[520px] mb-5">
                Looks like you haven’t added anything to your watchlist yet.
                Save videos, courses, and masterclasses here to continue
                watching anytime — all in one place!
              </p>

              <p className="text-sm font-medium text-[#E0E0E0]">
                Start exploring and add your first item!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="bg-[#161616] w-80 border border-[#242424] rounded-xl overflow-hidden"
                >
                  <img
                    src={it.thumbnail}
                    alt={it.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 flex  gap-22">
                    <h3 className="text-white font-semibold text-left text-sm mb-2">
                      {it.title}
                    </h3>
                    {/* <p className="text-gray-300 text-xs mb-3 line-clamp-2">{it.description}</p> */}
                    <div className="flex justify-between items-center">
                      {/* <span className="text-xs text-gray-400">{it.duration || "1h 45m"}</span> */}
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-xs px-3 cursor-pointer py-1 rounded bg-[#2a2a2a] border border-[#3b3b3b]"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Watchlist;
