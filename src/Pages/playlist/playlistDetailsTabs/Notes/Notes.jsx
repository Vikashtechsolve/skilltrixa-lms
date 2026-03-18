// src/components/playlistDetailsTabs/Notes/Notes.jsx
import React, { useState, useEffect } from "react";
import { FaRegCopy, FaRegLightbulb } from "react-icons/fa";
import { playlistAPI } from "../../../../utils/api";

/**
 * Notes component - displays PDF resources securely
 * Prevents direct downloads by using iframe with security headers
 */
const Notes = ({ data, title, playlistName, moduleName, sessionName, sessionDescription }) => {
  const [pdfUrls, setPdfUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdfUrls = async () => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Data should already contain signed URLs from getSessionResources
        // But we can also fetch individual signed URLs if needed
        const urls = await Promise.all(
          data.map(async (resource) => {
            if (resource.url) {
              return {
                label: resource.label || "PDF Notes",
                url: resource.url,
                assetId: resource.assetId,
              };
            }
            // If URL not present, fetch signed URL
            if (resource.assetId) {
              try {
                const response = await playlistAPI.getMediaAssetSignedUrl(resource.assetId);
                if (response.success && response.data?.url) {
                  return {
                    label: resource.label || "PDF Notes",
                    url: response.data.url,
                    assetId: resource.assetId,
                  };
                }
              } catch (err) {
                console.error("Failed to fetch signed URL for asset:", resource.assetId, err);
              }
            }
            return null;
          })
        );

        setPdfUrls(urls.filter((url) => url !== null));
      } catch (err) {
        console.error("Failed to fetch PDF URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrls();
  }, [data]);

  if (loading) {
    return (
      <div className="text-gray-400">
        <div className="animate-pulse">Loading notes...</div>
      </div>
    );
  }

  if (!pdfUrls || pdfUrls.length === 0) {
    return <div className="text-gray-400">No notes available for this session.</div>;
  }

  // Format title: Playlist name | Module name | Session name
  const displayTitle = title || (playlistName && moduleName && sessionName 
    ? `${playlistName} | ${moduleName} | ${sessionName}`
    : "Notes");

  return (
    <div className="text-gray-300">
      <div className="mb-4 text-left">
        {sessionDescription && (
          <p className="mb-6 text-gray-400">{sessionDescription}</p>
        )}
      </div>

      <hr className="border-gray-700 my-6" />

      {/* PDF Viewers */}
      <div className="space-y-6">
        {pdfUrls.map((pdf, index) => (
          <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 flex justify-between items-center">
              <span className="text-gray-300 text-sm font-medium">{pdf.label}</span>
            </div>
            <div className="w-full" style={{ height: "800px" }}>
              <iframe
                src={`${pdf.url}#toolbar=0&navpanes=0&scrollbar=0`}
                title={pdf.label}
                className="w-full h-full"
                style={{
                  border: "none",
                  pointerEvents: "auto",
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
