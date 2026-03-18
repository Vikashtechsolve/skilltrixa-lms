import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

/**
 * HLS Video Player Component
 * Prevents downloads and ensures secure streaming
 * Tracks progress and updates backend
 */
const HLSVideoPlayer = ({ src, title, onError, sessionId }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const progressUpdateIntervalRef = useRef(null);
  const lastProgressUpdateRef = useRef({ watchedSeconds: 0, playbackPositionSeconds: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Prevent right-click context menu (prevents download)
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts (Ctrl+S, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "S")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag and drop
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent text selection
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    video.addEventListener("contextmenu", handleContextMenu);
    video.addEventListener("dragstart", handleDragStart);
    video.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("keydown", handleKeyDown);

    // Initialize HLS
    if (Hls.isSupported()) {
      console.log("🎬 [HLSPlayer] Initializing HLS with URL:", src);
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        // CORS configuration - don't set headers manually, let browser handle CORS
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = false;
          // Add Authorization header if we have a token (for playlist endpoint)
          const token = localStorage.getItem("accessToken");
          if (token && url.includes('/api/hls-playlist/')) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          // Signed URLs should already have proper CORS from R2
        },
        // Retry and timeout configuration
        maxLoadingDelay: 4,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLoadingTimeOut: 20000,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 10000,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("✅ [HLSPlayer] Manifest parsed successfully", data);
        setIsLoading(false);
        setError(null);
        // Try to play automatically once manifest is ready
        video.play().catch((err) => {
          console.warn("⚠️ [HLSPlayer] Autoplay prevented (user interaction required):", err);
        });
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log("📊 [HLSPlayer] Level loaded", data);
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log("📦 [HLSPlayer] Fragment loaded", data.frag?.url);
        if (isLoading) {
          setIsLoading(false);
        }
      });

      hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
        console.log("⏳ [HLSPlayer] Fragment loading", data.frag?.url);
      });

      hls.on(Hls.Events.BUFFER_APPENDED, () => {
        if (isLoading) {
          setIsLoading(false);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("❌ [HLSPlayer] HLS Error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("❌ [HLSPlayer] Fatal network error, attempting recovery");
              try {
                hls.startLoad();
              } catch (e) {
                console.error("❌ [HLSPlayer] Recovery failed:", e);
                hls.destroy();
                setIsLoading(false);
                setError("Network error. Please check your connection and try again.");
                if (onError) onError(data);
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("❌ [HLSPlayer] Fatal media error, attempting recovery");
              try {
                hls.recoverMediaError();
              } catch (e) {
                console.error("❌ [HLSPlayer] Media recovery failed:", e);
                hls.destroy();
                setIsLoading(false);
                setError("Video playback error. Please try again.");
                if (onError) onError(data);
              }
              break;
            default:
              console.error("❌ [HLSPlayer] Fatal error, cannot recover:", data);
              hls.destroy();
              setIsLoading(false);
              setError(`Failed to load video: ${data.details || "Unknown error"}`);
              if (onError) onError(data);
              break;
          }
        } else {
          // Non-fatal errors - log but don't stop playback
          console.warn("⚠️ [HLSPlayer] Non-fatal error:", data);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      console.log("🎬 [HLSPlayer] Using native HLS support (Safari)");
      video.src = src;
      video.crossOrigin = "anonymous";
      
      video.addEventListener("loadedmetadata", () => {
        console.log("✅ [HLSPlayer] Metadata loaded (Safari)");
        setIsLoading(false);
        setError(null);
      });
      
      video.addEventListener("canplay", () => {
        console.log("✅ [HLSPlayer] Can play (Safari)");
        setIsLoading(false);
      });
      
      video.addEventListener("error", (e) => {
        console.error("❌ [HLSPlayer] Video error (Safari):", e);
        setIsLoading(false);
        setError("Failed to load video. Please try again.");
        if (onError) onError(e);
      });
    } else {
      console.error("❌ [HLSPlayer] HLS not supported");
      setIsLoading(false);
      setError("HLS is not supported in your browser.");
      if (onError) onError(new Error("HLS not supported"));
    }

    // Progress tracking - update every 10 seconds
    const updateProgress = async () => {
      if (!sessionId || !video || video.readyState < 2) return; // Need at least HAVE_CURRENT_DATA

      const watchedSeconds = Math.floor(video.currentTime);
      const playbackPositionSeconds = Math.floor(video.currentTime);
      
      // Only update if there's meaningful change (at least 5 seconds)
      const timeDiff = Math.abs(watchedSeconds - lastProgressUpdateRef.current.watchedSeconds);
      if (timeDiff < 5 && lastProgressUpdateRef.current.watchedSeconds > 0) {
        return; // Skip if less than 5 seconds difference
      }

      try {
        const { progressAPI } = await import("../utils/api");
        await progressAPI.updateSessionProgress(sessionId, {
          watchedSeconds,
          playbackPositionSeconds,
          completed: false,
          deviceInfo: navigator.userAgent
        });
        
        lastProgressUpdateRef.current = { watchedSeconds, playbackPositionSeconds };
        console.log(`📊 [HLSPlayer] Progress updated: ${watchedSeconds}s`);
      } catch (err) {
        console.error("❌ [HLSPlayer] Failed to update progress:", err);
      }
    };

    // Set up progress tracking interval (every 10 seconds)
    let timeupdateTimeout;
    const handleTimeUpdate = () => {
      if (!sessionId) return;
      clearTimeout(timeupdateTimeout);
      timeupdateTimeout = setTimeout(() => {
        updateProgress();
      }, 5000); // Throttle to every 5 seconds
    };

    const handleEnded = () => {
      if (sessionId && video) {
        const watchedSeconds = Math.floor(video.duration || video.currentTime);
        const playbackPositionSeconds = Math.floor(video.duration || video.currentTime);
        
        (async () => {
          try {
            const { progressAPI } = await import("../utils/api");
            await progressAPI.updateSessionProgress(sessionId, {
              watchedSeconds,
              playbackPositionSeconds,
              completed: true,
              deviceInfo: navigator.userAgent
            });
            console.log(`✅ [HLSPlayer] Video ended, progress marked as complete`);
          } catch (err) {
            console.error("❌ [HLSPlayer] Failed to update progress on end:", err);
          }
        })();
      }
    };

    if (sessionId) {
      progressUpdateIntervalRef.current = setInterval(() => {
        updateProgress();
      }, 10000); // Update every 10 seconds

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
    }

    // Cleanup
    return () => {
      video.removeEventListener("contextmenu", handleContextMenu);
      video.removeEventListener("dragstart", handleDragStart);
      video.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);

      if (sessionId) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
        if (timeupdateTimeout) {
          clearTimeout(timeupdateTimeout);
        }
      }

      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
        progressUpdateIntervalRef.current = null;
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, onError, sessionId]);

  if (error) {
    return (
      <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold mb-2">Video Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        className="w-full h-full"
        style={{
          pointerEvents: "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
        playsInline
        crossOrigin="anonymous"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HLSVideoPlayer;

