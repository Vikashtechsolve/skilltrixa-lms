import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "./ProfileSidebar";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { notificationAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ProfileNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications({
        page: 1,
        limit: 50,
      });
      if (response.success && response.data) {
        setNotifications(response.data.items || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.deleteNotification(notificationId);
      // Remove from local state
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      // Update unread count if it was unread
      const deletedNotif = notifications.find((n) => n._id === notificationId);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification._id, { stopPropagation: () => {} });
    }
    // Navigate if linkUrl exists
    if (notification.linkUrl) {
      navigate(notification.linkUrl);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      <div className="flex flex-col mt-16 md:flex-row bg-[#141414] text-white min-h-screen">
        {/* Sidebar (full width on mobile) */}
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-5 sm:px-8 md:px-10 py-8 md:py-10">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-semibold mb-6 text-left">
            Profile
          </h1>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
            <Bell size={22} />
            <h1 className="text-xl sm:text-2xl font-semibold text-left">
              Notifications
            </h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition"
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-gray-400">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-[#161616] border border-[#242424] rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] sm:min-h-[300px] w-full md:w-3/4">
              <Bell size={48} className="text-gray-500 mb-4" />
              <p className="text-lg font-medium mb-3">No Notifications</p>
              <p className="text-sm text-[#C6C6C6] leading-6 max-w-[420px]">
                You're all caught up! New notifications will appear here when there are updates.
              </p>
            </div>
          ) : (
            /* Notification Cards */
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`
                bg-[#161616] 
                rounded-lg 
                    border 
                p-4 sm:p-5 
                hover:border-[#3A3A3A] 
                transition 
                cursor-pointer 
                w-full md:w-3/4
                    ${item.read ? "border-[#262626]" : "border-[#3A3A3A] bg-[#1a1a1a]"}
                  `}
              >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!item.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <p className={`font-medium mb-1 text-left ${item.read ? "text-[#C6C6C6]" : "text-white"}`}>
                          {item.title}
                </p>
                      </div>
                      <p className={`text-sm text-left mb-2 ${item.read ? "text-[#C6C6C6]" : "text-gray-300"}`}>
                        {item.message}
                      </p>
                      <p className="text-xs text-gray-500 text-left">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(item._id, e)}
                          className="p-1 hover:bg-[#2a2a2a] rounded transition"
                          title="Mark as read"
                        >
                          <Check size={16} className="text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(item._id, e)}
                        className="p-1 hover:bg-[#2a2a2a] rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileNotifications;
