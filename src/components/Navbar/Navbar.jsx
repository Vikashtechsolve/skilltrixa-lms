import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  FileBadge,
  Award,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useState, useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useAuth } from "../../context/AuthContext";

const MENU = [
  { id: 1, title: "Home", to: "/app" },
  { id: 2, title: "Playlists", to: "/app/Playlist" },
  { id: 3, title: "Master Classes", to: "/app/MasterClass" },
  { id: 4, title: "Programs", to: "/app/programs" },
  { id: 5, title: "Blogs", to: "/app/Blogs" },
  { id: 6, title: "News", to: "/app/News" },
  { id: 7, title: "Interviews", to: "/app/interviews" },
  { id: 8, title: "Test", to: "https://test.vikashtechsolution.com/", external: true },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Figma style icons + labels - dynamic based on auth status
  const userMenu = [
    { id: 1, label: "Profile", icon: <User size={18} />, route: "/app/profile" },
    { id: 2, label: "Certification", icon: <FileBadge size={18} />,  route: "/app/profile/certifications", },
    { id: 3, label: "Badges", icon: <Award size={18} />,  route: "/app/profile/badges"  },
    { id: 4, label: "Dashboard", icon: <LayoutDashboard size={18} />, route: "/app/dashboard", },
    { 
      id: 5, 
      label: isAuthenticated ? "Sign Out" : "Sign In", 
      icon: <LogOut size={18} />, 
      route: isAuthenticated ? null : "/app/signin",
      isSignOut: isAuthenticated
    },
  ];

  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleLogoClick = () => {
    // If logged in, go to LMS home, otherwise go to landing page
    if (isAuthenticated) {
      navigate("/app");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="w-full bg-[#0F0F0F] h-20 flex items-center justify-between px-3 lg:px-12">
      {/* LOGO */}
      <div
        className="flex  cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src="/logo.svg" className="w-35" alt="Skilltrixa" />
      </div>

      {/* CENTER MENU */}
      <nav className="hidden md:flex items-center gap-10 mx-auto">
        {MENU.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.id}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-medium transition text-white hover:text-red-500"
              >
                {item.title}
              </a>
            );
          }
          return (
            <NavLink
              key={item.id}
              to={item.to}
              end
              className={({ isActive }) =>
                `text-[15px] font-medium transition 
                  ${isActive ? "text-red-500" : "text-white hover:text-red-500"}`
              }
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* SEARCH ICON */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-white text-xl hover:text-red-500 transition"
        >
          <Search size={22} />
        </button>

        {/* SEARCH BAR */}
        {showSearch && (
          <div
            className="flex items-center bg-[#1A1A1A] border border-gray-700
          rounded-full px-4 py-2 w-64 transition"
          >
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search here..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent text-white ml-3 w-full focus:outline-none"
            />

            <button
              onClick={() => setShowSearch(false)}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 cursor-pointer h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition text-white"
          >
            <User size={20} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-[#111111] text-white rounded-xl shadow-xl z-50 py-2">
              {userMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={async () => {
                    if (item.isSignOut) {
                      // Handle sign out
                      setDropdownOpen(false);
                      try {
                        await logout();
                        navigate("/");
                      } catch (error) {
                        console.error("Logout error:", error);
                        // Still navigate even if logout fails
                        navigate("/");
                      }
                    } else if (item.route) {
                      navigate(item.route);
                      setDropdownOpen(false);
                    }
                  }}
                  className="w-full flex cursor-pointer hover:underline items-center gap-3 px-4 py-3  transition text-left"
                >
                  {item.icon}
                  <span className="text-[15px]">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
