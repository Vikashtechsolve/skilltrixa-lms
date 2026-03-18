// src/components/Playlist.jsx
import React, { useEffect, useRef, useState } from "react";
import { playlistAPI } from "../../utils/api";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import { PlaylistPageSkeleton, PlaylistCardSkeleton } from "../../components/skeletons";

function Playlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await playlistAPI.getPlaylists();
        if (response.success && response.data) {
          // Backend returns data.items, not data.playlists
          const playlists = Array.isArray(response.data.items)
            ? response.data.items
            : Array.isArray(response.data)
            ? response.data
          : [];
          setItems(playlists);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to load playlists:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && items.length === 0) {
    return <PlaylistPageSkeleton />;
  }

  return (
    <div className="bg-black text-white py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-serif mb-6 sm:mb-8">
            Playlists
          </h1>

          {/* Grid: remains responsive; keeps original design */}
          <div
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2"
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <PlaylistCardSkeleton key={i} />
              ))
            ) : items.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-8">
                No playlists available
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id || item.id} className="w-full">
                {/* ensure each card fills its grid cell */}
                <PlaylistCard item={item} />
              </div>
              ))
            )}
          </div>

          <div className="mt-12" />
        </div>
      </div>
    </div>
  );
}

export default Playlist;
