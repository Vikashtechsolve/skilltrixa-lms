// src/components/PlaylistDetail.jsx
import React, { useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";
import { playlistAPI, quizAPI } from "../../utils/api";
import { Share2, MessageCircle, Pencil, ChevronDown, ChevronUp, Video as VideoIcon } from "lucide-react";

import Sidebar from "./playlistDetailsTabs/SideBar/SideBar";
import { courseData } from "../../../courseData";
import { PlaylistDetailsSkeleton, SidebarSkeleton, VideoSkeleton } from "../../components/skeletons";

const Videos = React.lazy(() => import("./playlistDetailsTabs/Videos/Videos"));
const PPT = React.lazy(() => import("./playlistDetailsTabs/PPT/PPT"));

import Notes from "./playlistDetailsTabs/Notes/Notes";
import Assignment from "./playlistDetailsTabs/Assignment/Assignment";
import Test from "./playlistDetailsTabs/Test/Test";

export default function PlaylistDetail() {
  const { id } = useParams();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Videos");
  const [activeSessionKey, setActiveSessionKey] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [sessionResources, setSessionResources] = useState(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const tabs = ["Videos", "Notes", "PPT", "Assignment", "Test"];

  // Fetch playlist details
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await playlistAPI.getPlaylistById(id);
        if (response.success && response.data) {
          setPlaylist(response.data);
        } else {
          setPlaylist(null);
        }
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  const [loadingModules, setLoadingModules] = useState(true);

  // Fetch modules for the playlist
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoadingModules(true);
        console.log("🔍 Fetching modules for playlist ID:", id);
        const response = await playlistAPI.getPlaylistModules(id);
        console.log("📦 Full API Response:", JSON.stringify(response, null, 2));
        
        if (response.success && response.data) {
      
          const modulesData = Array.isArray(response.data.modules)
            ? response.data.modules
            : Array.isArray(response.data)
            ? response.data
            : [];
          
          setModules(modulesData);
        } else {
          console.warn("⚠️ Response not successful or no data:", response);
          setModules([]);
        }
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setModules([]);
      } finally {
        setLoadingModules(false);
      }
    };

    if (id) {
      fetchModules();
    }
  }, [id]);

  // Set first session as current when modules are loaded
  useEffect(() => {
    if (currentSession || !modules.length) return;

    // Find first session from first module
    const firstModule = modules[0];
    if (firstModule?.sessions && firstModule.sessions.length > 0) {
      const firstSession = firstModule.sessions[0];
      // Ensure _id is set for compatibility (sessions from API have sessionId)
      const sessionWithId = {
        ...firstSession,
        _id: firstSession._id || firstSession.sessionId
      };
      setCurrentSession(sessionWithId);
      setCurrentModule(firstModule);
      setActiveSessionKey(`${firstModule.title}-${firstSession.title}`);
    }
  }, [modules, currentSession]);

  // Fetch session resources when currentSession changes
  useEffect(() => {
    const fetchSessionResources = async () => {
      // Sessions from API have sessionId, but we need _id for the API call
      const sessionId = currentSession?._id || currentSession?.sessionId;
      if (!sessionId) {
        console.log("⚠️ [PlaylistDetails] No sessionId available:", currentSession);
        setLoadingResources(false);
        return;
      }

      setLoadingResources(true);
      try {
        const response = await playlistAPI.getSessionResources(sessionId);
        console.log("📦 [PlaylistDetails] Session resources response:", response);
        
        if (response.success && response.data) {
          console.log("✅ [PlaylistDetails] Resources data:", {
            hasVideo: !!response.data.video,
            videoUrl: response.data.video?.url,
            resourcesCount: response.data.resources?.length || 0,
            captionsCount: response.data.captions?.length || 0
          });
          setSessionResources(response.data);
        } else {
          console.warn("⚠️ [PlaylistDetails] Response not successful:", response);
          setSessionResources(null);
        }
      } catch (err) {
        console.error("❌ [PlaylistDetails] Failed to fetch session resources:", err);
        console.error("❌ [PlaylistDetails] Error details:", err.message);
        setSessionResources(null);
      } finally {
        setLoadingResources(false);
      }
    };

    fetchSessionResources();
  }, [currentSession]);

  // Fetch quiz data when session changes
  useEffect(() => {
    const fetchQuiz = async () => {
      const sessionId = currentSession?._id || currentSession?.sessionId;
      if (!sessionId) {
        setQuizData(null);
        return;
      }

      try {
        const response = await playlistAPI.getSessionQuiz(sessionId);
        if (response.success && response.data) {
          // Transform API data to match frontend format
          const quiz = response.data;
          const transformedQuiz = {
            _id: quiz._id,
            title: quiz.title,
            description: quiz.description || "",
            totalQuestions: quiz.questions?.length || 0,
            duration: quiz.timeLimitSeconds 
              ? `${Math.floor(quiz.timeLimitSeconds / 60)} minutes`
              : "No time limit",
            difficulty: quiz.questions?.length > 0 
              ? quiz.questions[0].difficulty || "medium"
              : "medium",
            note: quiz.description || "Please answer all questions carefully.",
            questions: quiz.questions?.map((q, index) => ({
              _id: q._id,
              text: q.text,
              correctOptionId: q.correctOptionId, // Include for immediate feedback
              options: q.options.map((opt) => ({
                id: opt.id, // Preserve option ID ("a", "b", "c", "d")
                text: opt.text,
                explanation: opt.explanation || "" // Option-level explanation
              })),
              hint: q.hint || "No hint available" // Question-level hint
            })) || [],
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
            timeLimitSeconds: quiz.timeLimitSeconds,
            passingScorePercent: quiz.passingScorePercent || 60,
            shuffleQuestions: quiz.shuffleQuestions || false
          };
          setQuizData(transformedQuiz);
        } else {
          setQuizData(null);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setQuizData(null);
      }
    };

    fetchQuiz();
  }, [currentSession]);

  if (loading)
    return <PlaylistDetailsSkeleton />;

  if (!playlist)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Playlist not found
      </div>
    );

  // Prepare video data from session resources
  const videoData = sessionResources?.video && sessionResources.video.url && !sessionResources.video.error
    ? {
        title: currentSession?.title || playlist.title || "Video",
        description: currentSession?.description || playlist.description || "",
        url: sessionResources.video.url.startsWith('http') 
          ? sessionResources.video.url 
          : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${sessionResources.video.url}`,
        assetId: sessionResources.video.assetId,
      }
    : null;

  // Prepare notes data (PDF resources) - filter out errors
  const notesData = sessionResources?.resources?.filter((r) => r && r.type === "pdf" && r.url && !r.error) || null;

  // Prepare PPT data - filter out errors
  const pptData = sessionResources?.resources?.filter((r) => r && r.type === "ppt" && r.url && !r.error) || null;

  // Prepare assignment data - filter by type "zip" or label contains "assignment"
  const assignmentData = sessionResources?.resources?.filter((r) => 
    r && 
    r.url && 
    !r.error && 
    (r.type === "zip" || 
     r.label?.toLowerCase().includes("assignment") ||
     r.label?.toLowerCase().includes("homework") ||
     r.label?.toLowerCase().includes("task"))
  ) || null;

  // Debug logging
  console.log("🎬 [PlaylistDetails] Video data:", videoData);
  console.log("📄 [PlaylistDetails] Notes data:", notesData);
  console.log("📊 [PlaylistDetails] PPT data:", pptData);

  // Prepare test data (quiz)
  const testData = quizData;

  const handleSelectSession = (sessionKey) => {
    if (!sessionKey) return;
    setActiveSessionKey(sessionKey);

    // Parse module and session titles from the emitted sessionKey
    const parts = sessionKey.split("-");
    if (parts.length < 2) return;

    const moduleTitle = parts[0];
    const sessionTitle = parts.slice(1).join("-");

    // Find module
    const mod = modules.find(
      (m) =>
        String(m.title) === String(moduleTitle) ||
        String(m.title).includes(String(moduleTitle)) ||
        String(moduleTitle).includes(String(m.title))
    );

    if (!mod) {
      console.warn("handleSelectSession: module not found for key:", sessionKey);
      return;
    }

    const session = (mod.sessions || []).find((s) => String(s.title) === String(sessionTitle));
    if (!session) {
      console.warn("handleSelectSession: session not found in module:", moduleTitle, "sessionTitle:", sessionTitle);
      return;
    }

    // Ensure _id is set for compatibility (sessions from API have sessionId)
    const sessionWithId = {
      ...session,
      _id: session._id || session.sessionId
    };

    setCurrentSession(sessionWithId);
    setCurrentModule(mod);
    setActiveTab("Videos");
    setSessionResources(null); // Clear resources to trigger refetch
    setQuizData(null); // Clear quiz data to trigger refetch
  };

  // Helper function to get title format: "Playlist name | Module name | Session name"
  const getTitleFormat = () => {
    const moduleName = currentModule?.title || "";
    const sessionName = currentSession?.title || "";
    
   
    if (!sessionName) {
      return `${moduleName}`;
    }
    return `${moduleName} | ${sessionName}`;
  };

  return (
    <div className="bg-[#0b0b0c] text-white min-h-screen py-4">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 grid grid-cols-12 gap-6">
        {/* MOBILE SIDEBAR DROPDOWN */}
        <div className="col-span-12 md:hidden relative z-50">
          <button
            onClick={() => setMobileSidebarOpen((prev) => !prev)}
            className="w-full flex items-center justify-between
               px-4 py-3 rounded-lg
               bg-[#121212] border border-[#232323]
               text-red-500 font-semibold"
          >
            {playlist.title || "DSA Mastery"}
            {mobileSidebarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {mobileSidebarOpen && (
            <div className="mt-3 bg-[#121212] border border-[#232323] rounded-xl">
              {loadingModules ? (
                <SidebarSkeleton />
              ) : (
                <Sidebar
                  modules={modules}
                  activeSessionKey={activeSessionKey}
                  onSelectSession={(key) => {
                    handleSelectSession(key);
                    setMobileSidebarOpen(false);
                  }}
                  playlistTitle={playlist.title}
                />
              )}
            </div>
          )}
        </div>

        {/* 🖥 DESKTOP SIDEBAR */}
        <div className="hidden md:block col-span-3">
          {loadingModules ? (
            <SidebarSkeleton />
          ) : (
            <Sidebar
              modules={modules}
              activeSessionKey={activeSessionKey}
              onSelectSession={handleSelectSession}
              playlistTitle={playlist.title}
            />
          )}
        </div>

        {/* MAIN */}
        <main className="col-span-12 md:col-span-9">
          <div className="bg-[#121212] border border-[#232323] rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tabs.map((t) => {
                    const isActive = t === activeTab;
                    return (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`text-xs px-3 py-1 rounded border transition ${
                          isActive
                            ? "bg-[#9b1b1b] text-white border-transparent"
                            : "border-gray-800 text-gray-200 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <h1 className="text-lg md:text-2xl font-semibold text-left mb-2">
                  {playlist.title}
                </h1>
                <p className="text-sm text-gray-300 leading-relaxed text-left">
                  {playlist.description}
                </p>
                <p className="text-xs text-gray-400 text-left mt-4">
                  Released on: {new Date(playlist.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="gap-3 text-gray-300">
                <button className="p-2 hover:text-white">
                  <Share2 size={16} />
                </button>
                <button className="p-2 hover:text-white">
                  <MessageCircle size={16} />
                </button>
                <button className="p-2 hover:text-white">
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#151516] border border-[#232323] rounded-xl overflow-hidden shadow-inner">
            <div className="py-4 border-[#232323]">
              <div className="px-7 text-2xl text-left text-gray-200 font-medium">
                {getTitleFormat()}
              </div>
            </div>

            <div className="px-6">
              {activeTab === "Videos" && (
                loadingResources ? (
                  <VideoSkeleton />
                ) : (
                  <Suspense fallback={<VideoSkeleton />}>
                    <Videos 
                      data={videoData} 
                      title={getTitleFormat()}
                      playlistName={playlist?.title}
                      moduleName={currentModule?.title}
                      sessionName={currentSession?.title}
                      sessionDescription={currentSession?.description}
                      sessionId={currentSession?._id || currentSession?.sessionId}
                    />
                  </Suspense>
                )
              )}

              {activeTab === "Notes" && (
                <Notes 
                  data={notesData}
                  title={getTitleFormat()}
                  playlistName={playlist?.title}
                  moduleName={currentModule?.title}
                  sessionName={currentSession?.title}
                  sessionDescription={currentSession?.description}
                />
              )}

              {activeTab === "PPT" && (
                <Suspense fallback={<VideoSkeleton />}>
                  <PPT 
                    pptData={pptData}
                    title={getTitleFormat()}
                    playlistName={playlist?.title}
                    moduleName={currentModule?.title}
                    sessionName={currentSession?.title}
                    sessionDescription={currentSession?.description}
                  />
                </Suspense>
              )}

              {activeTab === "Assignment" && (
                <Assignment 
                  data={assignmentData}
                  title={getTitleFormat()}
                  playlistName={playlist?.title}
                  moduleName={currentModule?.title}
                  sessionName={currentSession?.title}
                  sessionDescription={currentSession?.description}
                />
              )}

              {activeTab === "Test" && (
                <Test 
                  test={testData} 
                  sessionId={currentSession?._id || currentSession?.sessionId}
                />
              )}
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
