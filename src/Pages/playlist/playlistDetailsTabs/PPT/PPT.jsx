// src/components/playlistDetailsTabs/PPT/PPT.jsx
import React, { useState, useEffect } from "react";
import {
  FaShareSquare,
  FaPencilAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { playlistAPI } from "../../../../utils/api";

/**
 * PPT component - displays PPTX files from R2 storage securely
 * Uses Office Online Viewer with custom navigation
 */
const PPT = ({ pptData, title, playlistName, moduleName, sessionName, sessionDescription }) => {
  const [pptResources, setPptResources] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPptUrls = async () => {
      if (!pptData || !Array.isArray(pptData) || pptData.length === 0) {
        setPptResources([]);
        setLoading(false);
        return;
      }

      // Fetch signed URLs for PPTX resources from R2
      const resources = await Promise.all(
        pptData.map(async (resource) => {
          if (resource.url) {
            return {
              label: resource.label || "Presentation",
              url: resource.url,
              assetId: resource.assetId,
            };
          }
          if (resource.assetId) {
            try {
              const response = await playlistAPI.getMediaAssetSignedUrl(resource.assetId);
              if (response.success && response.data?.url) {
                return {
                  label: resource.label || "Presentation",
                  url: response.data.url,
                  assetId: resource.assetId,
                };
              }
            } catch (err) {
              console.error("Failed to fetch signed URL:", err);
            }
          }
          return null;
        })
      );

      const validResources = resources.filter((r) => r !== null && r.url);
      setPptResources(validResources);
      setLoading(false);
    };

    fetchPptUrls();
  }, [pptData]);

  const totalSlides = pptResources.length;

  if (loading) {
    return (
      <div className="text-gray-400">
        <div className="animate-pulse">Loading presentation...</div>
      </div>
    );
  }

  if (totalSlides === 0) {
    return <div className="text-gray-400">No presentation slides available.</div>;
  }

  return (
    <div className="text-gray-300 relative" style={{ position: "relative", overflow: "visible" }}>
      <style>{`
        /* Remove ALL borders, outlines, and yellow focus indicators */
        * {
          -webkit-tap-highlight-color: transparent !important;
        }
        button:focus,
        button:focus-visible,
        button:active,
        button:hover,
        div:focus,
        div:focus-visible,
        *:focus,
        *:focus-visible,
        *:active {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        iframe:focus,
        iframe:hover,
        iframe:active,
        iframe {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        /* Hide Office Online Viewer bottom bar */
        iframe[src*="officeapps.live.com"] {
          border: none !important;
          outline: none !important;
        }
      `}</style>
      
      <div className="mb-4 text-left">
        {sessionDescription && (
          <p className="mb-6 text-gray-400">{sessionDescription}</p>
        )}
      </div>

      {/* Header */}
      

      {/* Content */}
      <div style={{ position: "relative" }}>
        {/* Slide Viewer */}
        <div className="relative bg-zinc-900 p-4 rounded-lg" style={{ border: "none", outline: "none", boxShadow: "none", position: "relative" }}>
          <div className="bg-white rounded-md shadow-lg overflow-hidden" style={{ border: "none", outline: "none", boxShadow: "none", position: "relative" }}>
            {/* PPTX files - Use Office Online Viewer */}
            <div className="w-full relative" style={{ height: "600px", overflow: "hidden" }}>
              <div style={{ 
                height: "650px", 
                overflow: "hidden",
                clipPath: "inset(0 0 50px 0)",
                position: "relative"
              }}>
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptResources[currentIndex].url)}`}
                  title={pptResources[currentIndex].label}
                  className="w-full bg-white"
                  style={{ 
                    border: "none", 
                    outline: "none",
                    margin: 0,
                    padding: 0,
                    height: "650px",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: "scale(1.02)",
                    transformOrigin: "top left"
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  allowFullScreen
                  frameBorder="0"
                  scrolling="no"
                />
                {/* Overlay to hide Microsoft border */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none",
                  border: "2px solid #27272a",
                  borderRadius: "6px",
                  zIndex: 1
                }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls - Left/Right buttons */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
              }}
              className="transition-all cursor-pointer"
              style={{ 
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 99999, 
                border: "none", 
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                color: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
                pointerEvents: "auto",
                visibility: "visible",
                opacity: 1
              }}
              aria-label="Previous slide"
              onMouseDown={(e) => e.preventDefault()}
              onFocus={(e) => e.target.blur()}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % totalSlides);
              }}
              className="transition-all cursor-pointer"
              style={{ 
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 99999, 
                border: "none", 
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                color: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
                pointerEvents: "auto",
                visibility: "visible",
                opacity: 1
              }}
              aria-label="Next slide"
              onMouseDown={(e) => e.preventDefault()}
              onFocus={(e) => e.target.blur()}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              <FaChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PPT;
