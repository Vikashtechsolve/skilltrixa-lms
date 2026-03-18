import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  FileBadge,
  Award,
  Bell,
  Plus,
  LogOut,
  ListCheck,
  ArrowLeft,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

export default function ProfileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const items = [
    { key: "profile", label: "Profile", icon: User, path: "/app/profile" },
    {
      key: "progress",
      label: "Student Progress",
      icon: GraduationCap,
      path: "/app/profile/progress",
    },
    {
      key: "certificates",
      label: "Certificates",
      icon: FileBadge,
      path: "/app/profile/certificates",
    },
    {
      key: "badges",
      label: "Badges Earned",
      icon: Award,
      path: "/app/profile/badges",
    },
    {
      key: "subscription",
      label: "Subscription",
      icon: ListCheck,
      path: "/app/profile/subscription",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/app/profile/notifications",
    },
    {
      key: "watchlist",
      label: "Watchlist",
      icon: Plus,
      path: "/app/profile/watchlist",
      special: true,
    },
    {
      key: "signout",
      label: "Sign Out",
      icon: LogOut,
      path: "/app/profile/signout",
    },
  ];

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      {/* Mobile Hamburger */}
      {!open && (
        <button
          className="md:hidden p-3 text-white fixed top-3 left-4 z-50 backdrop-blur-lg rounded-lg"
          onClick={() => setOpen(true)}
        >
          <Menu size={36} />
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-[#141414] text-white px-6 py-5 z-40
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close (mobile) */}
        <button
          className="md:hidden absolute top-4 right-4 text-white"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Back button */}
        <div
          className="flex items-center gap-3 mb-10 cursor-pointer mt-10 md:mt-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          <span className="text-[15px] font-medium">Back to Skilltrixa</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-4">
          {items.map((it) => (
            <NavLink
              key={it.key}
              to={it.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-4 text-[15px] transition-all duration-200 ${
                  isActive ? "text-red-500" : "text-white hover:text-gray-300"
                }`
              }
            >
              {it.special ? (
                <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center">
                  <it.icon size={18} />
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">
                  <it.icon size={18} />
                </div>
              )}
              {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
