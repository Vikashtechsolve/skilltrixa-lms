import React, { useEffect, useState, useRef } from "react";
import MasterClassCard from "../../components/Cards/MasterClassCard";
import { masterclassAPI } from "../../utils/api";

export default function MasterClass() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMasterclasses = async () => {
      try {
        setLoading(true);
        const response = await masterclassAPI.getMasterclasses({
          page: 1,
          limit: 100
        });
        if (response.success && response.data) {
          // Transform API data to match card component expectations
          const transformed = response.data.items.map((item) => ({
            id: item._id,
            title: item.title,
            thumbnail: item.thumbnailUrl || "/pic1.jpg",
            duration: item.duration || "",
            category: item.category || "",
            description: item.description || "",
            instructor: item.instructor || "",
            status: item.status === "upcoming" ? "Upcoming" : item.status === "live" ? "Live" : "Recorded",
            badge: item.badge || (item.status === "upcoming" ? "Upcoming Master Class" : item.status === "live" ? "Live Now" : "Recorded"),
            startAt: item.startAt,
            joinUrl: item.joinUrl,
            recordingUrl: item.recordingUrl,
            notes: item.notes,
            whatThisSessionCovers: item.whatThisSessionCovers || [],
            keyTakeaways: item.keyTakeaways || [],
            whyMatters: item.whyMatters || "",
            slug: item.slug,
            about: item.about || "",
            whatWeLearn: item.whatWeLearn || "",
            techStack: item.techStack || [],
            trainerInfo: item.trainerInfo || {}
          }));
          setClasses(transformed);
          }
      } catch (err) {
        console.error("Failed to fetch master classes:", err);
        setError(err.message || "Failed to load classes. Check console/network.");
      } finally {
        setLoading(false);
      }
    };

    fetchMasterclasses();
  }, []);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Loading master classes...
      </div>
    );

  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="px-6 py-10  bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl  font-serif">Master Classes</h1>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {classes.map((item) => (
            <MasterClassCard key={item.id || item._id} item={item} />
          ))}
        </div>

        <div className="mt-12" />
      </div>
    </div>
  );
}
