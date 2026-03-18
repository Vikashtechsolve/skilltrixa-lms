// src/components/playlistDetailsTabs/Assignment/Assignment.jsx
import React, { useState, useEffect } from "react";
import { Download, FileText, FileArchive } from "lucide-react";
import { playlistAPI } from "../../../../utils/api";

/**
 * Assignment component - displays assignment resources (PDF, ZIP, etc.)
 * Allows viewing and downloading assignment files
 */
const Assignment = ({ data, title, playlistName, moduleName, sessionName, sessionDescription }) => {
  const [assignmentUrls, setAssignmentUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignmentUrls = async () => {
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
                label: resource.label || "Assignment",
                url: resource.url,
                assetId: resource.assetId,
                type: resource.type,
                mimeType: resource.mimeType,
                sizeBytes: resource.sizeBytes,
              };
            }
            // If URL not present, fetch signed URL
            if (resource.assetId) {
              try {
                const response = await playlistAPI.getMediaAssetSignedUrl(resource.assetId);
                if (response.success && response.data?.url) {
                  return {
                    label: resource.label || "Assignment",
                    url: response.data.url,
                    assetId: resource.assetId,
                    type: resource.type,
                    mimeType: resource.mimeType,
                    sizeBytes: resource.sizeBytes,
                  };
                }
              } catch (err) {
                console.error("Failed to fetch signed URL for asset:", resource.assetId, err);
              }
            }
            return null;
          })
        );

        setAssignmentUrls(urls.filter((url) => url !== null));
      } catch (err) {
        console.error("Failed to fetch assignment URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentUrls();
  }, [data]);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper function to get file icon based on type
  const getFileIcon = (type, mimeType) => {
    if (type === "zip" || mimeType?.includes("zip")) {
      return <FileArchive size={20} className="text-blue-400" />;
    }
    if (type === "pdf" || mimeType?.includes("pdf")) {
      return <FileText size={20} className="text-red-400" />;
    }
    return <FileText size={20} className="text-gray-400" />;
  };

  // Helper function to check if file can be viewed in iframe
  const canViewInIframe = (type, mimeType) => {
    return type === "pdf" || mimeType?.includes("pdf");
  };

  if (loading) {
    return (
      <div className="text-gray-400">
        <div className="animate-pulse">Loading assignments...</div>
      </div>
    );
  }

  if (!assignmentUrls || assignmentUrls.length === 0) {
    return <div className="text-gray-400">No assignments available for this session.</div>;
  }

  // Format title: Playlist name | Module name | Session name
  const displayTitle = title || (playlistName && moduleName && sessionName 
    ? `${playlistName} | ${moduleName} | ${sessionName}`
    : "Assignments");

  return (
    <div className="text-gray-300">
      <div className="mb-4 text-left">
        {sessionDescription && (
          <p className="mb-6 text-gray-400">{sessionDescription}</p>
        )}
      </div>

      <hr className="border-gray-700 my-6" />

      {/* Assignment Files */}
      <div className="space-y-6">
        {assignmentUrls.map((assignment, index) => (
          <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getFileIcon(assignment.type, assignment.mimeType)}
                <div>
                  <span className="text-gray-300 text-sm font-medium">{assignment.label}</span>
                  {assignment.sizeBytes && (
                    <span className="text-gray-400 text-xs ml-2">
                      ({formatFileSize(assignment.sizeBytes)})
                    </span>
                  )}
                </div>
              </div>
              <a
                href={assignment.url}
                download
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
              >
                <Download size={16} />
                Download
              </a>
            </div>
            
            {/* PDF Viewer for PDF files */}
            {canViewInIframe(assignment.type, assignment.mimeType) ? (
              <div className="w-full" style={{ height: "800px" }}>
                <iframe
                  src={`${assignment.url}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={assignment.label}
                  className="w-full h-full"
                  style={{
                    border: "none",
                    pointerEvents: "auto",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  {getFileIcon(assignment.type, assignment.mimeType)}
                  <div>
                    <p className="text-gray-300 mb-2">
                      {assignment.type === "zip" 
                        ? "This is a ZIP archive containing assignment files."
                        : "Preview not available for this file type."}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Click the download button above to access the file.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignment;

