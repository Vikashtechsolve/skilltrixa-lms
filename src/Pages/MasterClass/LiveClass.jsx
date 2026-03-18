// src/Pages/MasterClass/LiveClass.jsx
import React, { useEffect, useState } from "react";
import { Play, User, BookOpen, Code, Award, ExternalLink } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { masterclassAPI } from "../../utils/api";

const LiveClass = () => {
  const { id } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(location.state?.item ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMasterclass = async () => {
      // Always fetch fresh data to ensure all fields are available
      try {
        setLoading(true);
        const response = await masterclassAPI.getMasterclassBySlug(id);
        if (response.success && response.data) {
          const data = response.data;
          setItem({
            id: data._id,
            title: data.title,
            thumbnail: data.thumbnailUrl || "/pic2.jpg",
            badge: data.badge || "Live Now",
            status: data.status === "live" ? "Live" : data.status,
            joinUrl: data.joinUrl,
            description: data.description,
            instructor: data.instructor,
            category: data.category,
            duration: data.duration,
            whatThisSessionCovers: data.whatThisSessionCovers || [],
            keyTakeaways: data.keyTakeaways || [],
            whyMatters: data.whyMatters || "",
            notes: data.notes,
            slug: data.slug,
            about: data.about || "",
            whatWeLearn: data.whatWeLearn || "",
            techStack: data.techStack || [],
            trainerInfo: data.trainerInfo || {}
          });
        }
      } catch (err) {
        console.error("Failed to fetch masterclass:", err);
        setError(err.message || "Class not found");
      } finally {
        setLoading(false);
      }
    };

    fetchMasterclass();
  }, [id]);

  if (loading) return <div className="p-8 text-zinc-300">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;
  if (!item) return <div className="p-8 text-zinc-300">No class found.</div>;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
          <img src={item.thumbnail} alt={item.title} className="w-full h-96 object-cover" />

          <div className="absolute left-0 right-0 bottom-0 flex justify-center">
            <div className="w-full max-w-3xl mx-auto bg-black/60 backdrop-blur-sm text-center py-3 rounded-t">
              <div className="inline-flex items-center gap-3 text-sm font-semibold text-white">
                <span className="w-3 h-3 bg-green-500 rounded-full block animate-pulse" />
                <span>{item.badge || item.status || "Live Class"}</span>
              </div>
            </div>
          </div>

          {item.joinUrl && (
          <button
            type="button"
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-zinc-800/90 hover:bg-zinc-700/90 border-2 border-red-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition"
              aria-label="Join Live"
            onClick={() => {
                window.open(item.joinUrl, "_blank");
            }}
          >
            <Play size={36} className="text-red-500" />
          </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Description */}
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white mb-4 text-left">{item.title}</h1>
              <p className="text-zinc-300 text-lg leading-relaxed text-left">{item.description}</p>
            </div>

            {/* Join Button - Prominent */}
            {item.joinUrl && (
              <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 border border-zinc-600 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Join Live Session</h2>
                <a
                  href={item.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
                >
                  <Play size={20} />
                  Join Now
                  <ExternalLink size={16} />
                </a>
                <p className="text-sm text-zinc-300 mt-3">
                  Click the button above to join the live masterclass session
                </p>
              </div>
            )}

            {/* About This Masterclass */}
            {item.about && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen size={24} />
                  About This Masterclass
                </h2>
                <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {item.about.split('\n').map((line, index) => {
                    // Check if line starts with bullet point markers
                    if (line.trim().match(/^[•\-\*]\s/) || line.trim().match(/^\d+\.\s/)) {
                      return (
                        <div key={index} className="flex items-start gap-3 mb-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{line.replace(/^[•\-\*]\s/, '').replace(/^\d+\.\s/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={index} className="mb-3">{line}</p>;
                  })}
                </div>
              </div>
            )}

            {/* What We Learn */}
            {item.whatWeLearn && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Award size={24} />
                  What You'll Learn
                </h2>
                <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {item.whatWeLearn.split('\n').map((line, index) => {
                    // Check if line starts with bullet point markers
                    if (line.trim().match(/^[•\-\*]\s/) || line.trim().match(/^\d+\.\s/)) {
                      return (
                        <div key={index} className="flex items-start gap-3 mb-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{line.replace(/^[•\-\*]\s/, '').replace(/^\d+\.\s/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={index} className="mb-3">{line}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {item.techStack && item.techStack.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Code size={24} />
                  Tech Stack You'll Learn
                </h2>
                <div className="flex flex-wrap gap-3">
                  {item.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* What This Session Covers */}
            {item.whatThisSessionCovers && item.whatThisSessionCovers.length > 0 && (
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-white mb-4 text-left">What This Session Covers</h2>
                <ul className="list-disc list-inside space-y-2 text-zinc-300 text-left">
                  {item.whatThisSessionCovers.map((point, index) => (
                    <li key={index} className="text-left">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Takeaways */}
            {item.keyTakeaways && item.keyTakeaways.length > 0 && (
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-white mb-4 text-left">Key Takeaways</h2>
                <ul className="list-disc list-inside space-y-2 text-zinc-300 text-left">
                  {item.keyTakeaways.map((point, index) => (
                    <li key={index} className="text-left">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Why This Matters */}
            {item.whyMatters && (
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-white mb-4 text-left">Why This Masterclass Matters</h2>
                <p className="text-zinc-300 leading-relaxed text-left">{item.whyMatters}</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Join Link Card */}
            {item.joinUrl && (
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4">Live Session Link</h3>
                <a
                  href={item.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm break-words text-blue-400 hover:text-blue-300 mb-4"
                >
                  {item.joinUrl}
                </a>
                <a
                  href={item.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 border border-red-500/50 text-white font-semibold px-4 py-2 rounded-lg shadow w-full justify-center transition"
                >
                  <Play size={18} className="text-red-500" />
                  Join Live Class
                </a>
              </div>
            )}

            {/* Class Info Card */}
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
              <h3 className="text-lg font-semibold text-white mb-4 text-left">Class Details</h3>
              <div className="space-y-4 text-left">
                {item.duration && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Duration</p>
                    <p className="text-white font-medium">{item.duration}</p>
                  </div>
                )}
                {item.category && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Category</p>
                    <p className="text-white font-medium">{item.category}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Status</p>
                  <p className="text-green-500 font-medium">Live Now</p>
                </div>
              </div>
            </div>

            {/* Trainer Information */}
            {((item.trainerInfo && (item.trainerInfo.info || item.trainerInfo.name)) || item.instructor) && (
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 text-left">
                  <User size={20} />
                  Trainer Information
                </h3>
                <div className="space-y-3 text-left">
                  {item.trainerInfo?.image && (
                    <img
                      src={item.trainerInfo.image}
                      alt={item.trainerInfo.name || item.instructor}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-lg font-semibold text-white mb-3 text-left">
                      {item.trainerInfo?.name || item.instructor}
                    </p>
                    {item.trainerInfo?.info && (
                      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {item.trainerInfo.info.split('\n').map((line, index) => {
                          // Check if line starts with bullet point markers
                          if (line.trim().match(/^[•\-\*]\s/) || line.trim().match(/^\d+\.\s/)) {
                            return (
                              <div key={index} className="flex items-start gap-3 mb-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{line.replace(/^[•\-\*]\s/, '').replace(/^\d+\.\s/, '')}</span>
                              </div>
                            );
                          }
                          return <p key={index} className="mb-2">{line}</p>;
                        })}
                      </div>
                    )}
                    {(item.trainerInfo?.linkedin || item.trainerInfo?.github || item.trainerInfo?.website) && (
                      <div className="mt-4 flex gap-3">
                        {item.trainerInfo.linkedin && (
                          <a
                            href={item.trainerInfo.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            LinkedIn
                          </a>
                        )}
                        {item.trainerInfo.github && (
                          <a
                            href={item.trainerInfo.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-gray-300 text-sm"
                          >
                            GitHub
                          </a>
                        )}
                        {item.trainerInfo.website && (
                          <a
                            href={item.trainerInfo.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
