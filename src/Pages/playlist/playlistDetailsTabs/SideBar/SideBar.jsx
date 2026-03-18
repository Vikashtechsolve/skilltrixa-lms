import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaLayerGroup,
  FaBook,
} from "react-icons/fa";

const Sidebar = ({ modules = [], activeSessionKey, onSelectSession, playlistTitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModule, setOpenModule] = useState(null);

  // Open first module by default when modules are loaded
  useEffect(() => {
    if (modules.length > 0 && !openModule) {
      setOpenModule(modules[0].title);
    }
  }, [modules, openModule]);

  const handleModuleClick = (moduleTitle) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    setOpenModule(openModule === moduleTitle ? null : moduleTitle);
  };

  return (
    <aside
  className={`
    bg-zinc-900 flex flex-col flex-shrink-0
    transition-all duration-300 ease-in-out relative
    w-full
    md:w-[90%]
    lg:${isSidebarOpen ? "w-[90%]" : "w-20"}
  `}
>
      {/* <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        // Updated button colors
        className="absolute top-6 -right-3 z-10 bg-vts-card border border-gray-700 hover:bg-vts-red text-white p-2 rounded-full shadow-lg focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <FaChevronLeft size={12} />
        ) : (
          <FaChevronRight size={12} />
        )}
      </button> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700 h-16 flex items-center">
          <h2
            className={`
              text-lg font-semibold text-vts-red whitespace-nowrap
              transition-opacity duration-300
              ${isSidebarOpen ? "opacity-100" : "opacity-0 delay-200"}
            `}
          >
            {playlistTitle || "Playlist"}
          </h2>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {modules.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No modules available
            </div>
          ) : (
            modules.map((module) => {
              const moduleKey = module.title;
              const isModuleOpen = openModule === moduleKey;
              const moduleSessions = Array.isArray(module.sessions) ? module.sessions : [];
              
              // Debug logging
              if (modules.indexOf(module) === 0) {
                console.log("🔍 [Sidebar] First module:", module);
                console.log("🎬 [Sidebar] First module sessions:", moduleSessions);
                console.log("🔢 [Sidebar] Sessions count:", moduleSessions.length);
              }

              return (
                <div key={moduleKey}>
                  <button
                    onClick={() => handleModuleClick(moduleKey)}
                    className={`
                      flex items-center w-full px-4 py-3 text-left
                      text-gray-200 hover:bg-gray-700 focus:outline-none transition-colors
                      ${
                        !isSidebarOpen ? "justify-center px-0" : "justify-between"
                      }
                      ${isModuleOpen && isSidebarOpen ? "bg-gray-700" : ""}
                    `}
                  >
                    <div className="flex items-center">
                      <FaLayerGroup size={18} className="flex-shrink-0 mx-2" />
                      <span
                        className={`
                          font-medium ml-3 whitespace-nowrap
                          transition-all duration-300
                          ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}
                        `}
                      >
                        {module.title}
                      </span>
                    </div>
                    {isSidebarOpen &&
                      (isModuleOpen ? (
                        <FaChevronDown size={14} />
                      ) : (
                        <FaChevronRight size={14} />
                      ))}
                  </button>

                  {isSidebarOpen && isModuleOpen && (
                    <div className="pl-8 py-1">
                      {moduleSessions.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-xs">No sessions</div>
                      ) : (
                        moduleSessions.map((session) => {
                          const sessionKey = `${moduleKey}-${session.title}`;
                          const isActive = activeSessionKey === sessionKey;

                          return (
                            <div key={sessionKey || session.sessionId || session._id}>
                              <button
                                onClick={() => onSelectSession(sessionKey)}
                                className={`
                                  flex items-center w-full px-4 py-2 text-left
                                  text-gray-400 hover:bg-gray-600 focus:outline-none
                                  transition-colors rounded-md whitespace-nowrap
                                  ${
                                    isActive
                                      ? "bg-gray-600 text-white"
                                      : "hover:text-gray-200"
                                  }
                                `}
                              >
                                <FaBook size={14} className="mr-2 flex-shrink-0" />
                                <span>{session.title}</span>
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
