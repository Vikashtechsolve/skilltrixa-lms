// src/Pages/MasterClass/UpcomingEventClass.jsx
import React, { useEffect, useState } from "react";
import { CalendarCheck2, Clock, User, BookOpen, Code, Award } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { masterclassAPI } from "../../utils/api";

export default function UpcomingEventClass() {
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
            thumbnail: data.thumbnailUrl || "/pic1.jpg",
            badge: data.badge || "Upcoming Master Class",
            status: data.status === "upcoming" ? "Upcoming" : data.status,
            startAt: data.startAt,
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
  if (!item) return <div className="p-8 text-zinc-300">No event found.</div>;

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const dateTime = formatDateTime(item.startAt);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200 px-6 md:px-12 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-md overflow-hidden mb-8">
          <img src={item.thumbnail} alt={item.title} className="w-full h-96 object-cover" />

          <div className="absolute left-0 right-0 bottom-0 flex justify-center">
            <div className="w-full max-w-3xl mx-auto bg-black/60 backdrop-blur-sm text-center py-3 rounded-t">
              <div className="inline-flex items-center gap-3 text-sm font-semibold text-white">
                <CalendarCheck2 />
                <span>{item.badge || item.status}</span>
              </div>
            </div>
          </div>
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

            {/* Date and Time - Prominent Display */}
            {dateTime && (
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 text-left">
                  <CalendarCheck2 size={24} />
                  Event Schedule
                </h2>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CalendarCheck2 className="text-red-500" size={20} />
                    <div>
                      <p className="text-sm text-zinc-400">Date</p>
                      <p className="text-lg font-semibold text-white">{dateTime.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-red-500" size={20} />
                    <div>
                      <p className="text-sm text-zinc-400">Time</p>
                      <p className="text-lg font-semibold text-white">{dateTime.time}</p>
                    </div>
                  </div>
                </div>
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
            {/* Event Info Card */}
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
              <h3 className="text-lg font-semibold text-white mb-4 text-left">Event Details</h3>
              <div className="space-y-4 text-left">
                {dateTime && (
                  <>
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Date</p>
                      <p className="text-white font-medium">{dateTime.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Time</p>
                      <p className="text-white font-medium">{dateTime.time}</p>
                    </div>
                  </>
                )}
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
}
