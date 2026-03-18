import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Download, User, BookOpen, Code, Award } from "lucide-react";
import { masterclassAPI } from "../../utils/api";
import HLSVideoPlayer from "../../components/HLSVideoPlayer";

export default function RecordedClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [masterClass, setMasterClass] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [notesUrl, setNotesUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMasterclass = async () => {
      try {
        setLoading(true);
        const response = await masterclassAPI.getMasterclassBySlug(id);
        if (response.success && response.data) {
          const data = response.data;
          // Transform to match expected format
          const transformed = {
            id: data._id,
            title: data.title,
            thumbnail: data.thumbnailUrl || "/pic3.png",
            badge: data.badge || "Recorded",
            status: data.status === "recorded" ? "Recorded" : data.status,
            recordingUrl: data.recordingUrl,
            description: data.description,
            instructor: data.instructor,
            category: data.category,
            duration: data.duration,
            whatThisSessionCovers: data.whatThisSessionCovers || [],
            keyTakeaways: data.keyTakeaways || [],
            whyMatters: data.whyMatters || "",
            notes: data.notes,
            slug: data.slug,
            videoAssetId: data.videoAssetId,
            notesAssetId: data.notesAssetId,
            about: data.about || "",
            whatWeLearn: data.whatWeLearn || "",
            techStack: data.techStack || [],
            trainerInfo: data.trainerInfo || {}
          };
          setMasterClass(transformed);

          // Fetch video URL if recorded
          if (data.status === "recorded" && data.videoAssetId) {
            try {
              const videoResponse = await masterclassAPI.getMasterclassVideoUrl(data.slug);
              if (videoResponse.success && videoResponse.data) {
                setVideoUrl(videoResponse.data.playlistUrl);
              }
            } catch (videoErr) {
              console.error("Failed to fetch video URL:", videoErr);
            }
          }

          // Fetch notes URL if available
          if (data.notesAssetId) {
            try {
              const notesResponse = await masterclassAPI.getMasterclassNotesUrl(data.slug);
              if (notesResponse.success && notesResponse.data) {
                setNotesUrl(notesResponse.data.downloadUrl);
              }
            } catch (notesErr) {
              console.error("Failed to fetch notes URL:", notesErr);
            }
          }
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
  if (!masterClass)
    return <div className="p-8 text-zinc-300">No class found.</div>;

  const {
    thumbnail,
    title,
    badge,
    notes,
    whatThisSessionCovers = [],
    keyTakeaways = [],
    whyMatters = "",
    description,
    instructor,
    duration,
    status,
    joinUrl,
    recordingUrl,
  } = masterClass;

  return (
    <div className=" bg-zinc-900 text-zinc-200 px-6 md:px-12 py-2">
      {/* Hero / video area */}
      <div className=" rounded-md overflow-hidden">
        {videoUrl ? (
          // Show HLS video player for recorded masterclass
          <div className="w-full">
            <HLSVideoPlayer 
              src={videoUrl} 
              title={masterClass.title}
              onError={(err) => {
                console.error("Video playback error:", err);
                setError("Failed to load video. Please try again.");
              }}
            />
          </div>
        ) : (
          // Fallback to thumbnail if video not available
          <div className="relative bg-black">
          <img
              src={masterClass.thumbnail}
              alt={masterClass.title}
              className="w-full md:h-96 object-cover block"
          />
            {masterClass.recordingUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 flex items-center justify-center cursor-pointer"
              onClick={() => {
                    if (masterClass.recordingUrl) window.open(masterClass.recordingUrl, "_blank");
              }}
            >
              <Play className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>
            )}
        </div>
        )}
      </div>

      {/* Notes button */}
      <div className="mt-4 flex gap-4">
        {notesUrl && (
          <a
            href={notesUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="border bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md text-xl h-12 shadow flex justify-center items-center gap-2"
          >
            <Download size={20} />
            Download Notes
          </a>
        )}
        <button
          className="border bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md text-xl h-12 shadow flex justify-center items-center cursor-pointer"
          onClick={() => {
            const notesSection = document.getElementById("notes-section");
            if (notesSection)
              notesSection.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Notes
        </button>
      </div>

      {/* Content columns */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Description */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white mb-4 text-left">{title}</h1>
            <p className="text-zinc-300 text-lg leading-relaxed text-left">{description}</p>
          </div>

          {/* About This Masterclass */}
          {masterClass.about && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={24} />
                About This Masterclass
              </h2>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {masterClass.about.split('\n').map((line, index) => {
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
          {masterClass.whatWeLearn && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={24} />
                What You'll Learn
              </h2>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                {masterClass.whatWeLearn.split('\n').map((line, index) => {
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
          {masterClass.techStack && masterClass.techStack.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code size={24} />
                Tech Stack You'll Learn
              </h2>
              <div className="flex flex-wrap gap-3">
                {masterClass.techStack.map((tech, index) => (
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
          {whatThisSessionCovers.length > 0 && (
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-white mb-4 text-left">What This Session Covers</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 text-left">
                {whatThisSessionCovers.map((point, index) => (
                  <li key={index} className="text-left">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Takeaways */}
          {keyTakeaways.length > 0 && (
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-white mb-4 text-left">Key Takeaways</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 text-left">
                {keyTakeaways.map((point, index) => (
                  <li key={index} className="text-left">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Why This Matters */}
          {whyMatters && (
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-white mb-4 text-left">Why This Masterclass Matters</h2>
              <p className="text-zinc-300 leading-relaxed text-left">{whyMatters}</p>
            </div>
          )}

          {/* Notes / Topic */}
          {notes && (
            <div id="notes-section" className="text-left">
              <h2 className="text-2xl font-semibold text-white mb-4 text-left">Notes</h2>
              <p className="text-zinc-300 leading-relaxed text-left">{notes}</p>
            </div>
          )}
          </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Class Info Card */}
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
            <h3 className="text-lg font-semibold text-white mb-4 text-left">Class Details</h3>
            <div className="space-y-4 text-left">
              {duration && (
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Duration</p>
                  <p className="text-white font-medium">{duration}</p>
                </div>
              )}
              {masterClass.category && (
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Category</p>
                  <p className="text-white font-medium">{masterClass.category}</p>
          </div>
              )}
              <div>
                <p className="text-sm text-zinc-400 mb-1">Status</p>
                <p className="text-white font-medium">Recorded</p>
              </div>
            </div>
          </div>

          {/* Trainer Information */}
          {((masterClass.trainerInfo && (masterClass.trainerInfo.info || masterClass.trainerInfo.name)) || instructor) && (
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 text-left">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 text-left">
                <User size={20} />
                Trainer Information
              </h3>
              <div className="space-y-3 text-left">
                {masterClass.trainerInfo?.image && (
                  <img
                    src={masterClass.trainerInfo.image}
                    alt={masterClass.trainerInfo.name || instructor}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="text-left">
                  <p className="text-lg font-semibold text-white mb-3 text-left">
                    {masterClass.trainerInfo?.name || instructor}
                  </p>
                  {masterClass.trainerInfo?.info && (
                    <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                      {masterClass.trainerInfo.info.split('\n').map((line, index) => {
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
                  {(masterClass.trainerInfo?.linkedin || masterClass.trainerInfo?.github || masterClass.trainerInfo?.website) && (
                    <div className="mt-4 flex gap-3">
                      {masterClass.trainerInfo.linkedin && (
                        <a
                          href={masterClass.trainerInfo.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                      {masterClass.trainerInfo.github && (
                        <a
                          href={masterClass.trainerInfo.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-gray-300 text-sm"
                        >
                          GitHub
                        </a>
                      )}
                      {masterClass.trainerInfo.website && (
                        <a
                          href={masterClass.trainerInfo.website}
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
  );
}
