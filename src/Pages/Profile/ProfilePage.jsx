import Sidebar from "./ProfileSidebar";
import { useRef, useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import userGrey from "../../assets/user-grey.png";
import Header from "../Header/Header";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";
import { AvatarSkeleton, FormSkeleton, TextSkeleton } from "../../components/skeletons";

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const { user, setUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(userGrey);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setProfile(user.avatarUrl || userGrey);
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 5MB" });
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfile(previewUrl);
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Upload to Cloudinary via backend
      const response = await authAPI.uploadAvatar(file);
      
      if (response.success) {
        // Update profile with Cloudinary URL
        setProfile(response.avatarUrl);
        // Update user context
        if (response.user) {
          setUser(response.user);
        }
        setMessage({ type: "success", text: "Avatar uploaded successfully!" });
        const timeout = parseInt(import.meta.env.VITE_SUCCESS_MESSAGE_TIMEOUT || "3000", 10);
        setTimeout(() => setMessage({ type: "", text: "" }), timeout);
      }
    } catch (error) {
      // Revert to previous avatar on error
      setProfile(user?.avatarUrl || userGrey);
      setMessage({ type: "error", text: error.message || "Failed to upload avatar" });
    } finally {
      setLoading(false);
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    
    try {
      // Allow empty phone number or any format
      const phoneValue = phone.trim() || "";
      
      const response = await authAPI.updateProfile(
        name.trim(),
        phoneValue,
        undefined // Avatar is handled separately via uploadAvatar
      );

      if (response.success) {
        setUser(response.user);
        // Update local phone state to match server response
        setPhone(response.user?.phone || "");
        setMessage({ type: "success", text: "Profile updated successfully!" });
        const timeout = parseInt(import.meta.env.VITE_SUCCESS_MESSAGE_TIMEOUT || "3000", 10);
        setTimeout(() => setMessage({ type: "", text: "" }), timeout);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleNameBlur = () => {
    const trimmedName = name.trim();
    const currentName = (user?.name || "").trim();
    if (trimmedName !== currentName) {
      handleSave();
    }
  };

  const handlePhoneBlur = () => {
    const trimmedPhone = phone.trim();
    const currentPhone = (user?.phone || "").trim();
    // Update if phone has changed (including empty to non-empty or vice versa)
    // Allow any format - with/without country code, spaces, dashes, etc.
    if (trimmedPhone !== currentPhone) {
      handleSave();
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      <div className="flex bg-[#141414] pt-16 text-white min-h-screen">
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* Center Column */}
        <div className="flex-1 flex flex-col items-cente px-4 pt-8">
          {/* Show skeleton only in profile section while loading */}
          {authLoading || !user ? (
            <>
              {/* Title */}
              <TextSkeleton lines={1} width="1/6" height="h-10" className="mb-8" />

              {/* Avatar */}
              <div className="relative mb-14 flex flex-col items-center lg:w-3xl">
                <AvatarSkeleton size="w-48 h-48 md:w-56 md:h-56" />
                <div className="absolute bottom-2 right-0 md:bottom-4 md:right-4">
                  <div className="bg-black p-2 rounded-full border border-white/25 w-8 h-8"></div>
                </div>
              </div>

              {/* Form */}
              <div className="w-full max-w-[650px] flex flex-col px-4 gap-6 ml-0 lg:ml-16">
                <FormSkeleton fields={3} />
              </div>
            </>
          ) : (
            <>
              {/* Title */}
              <h1 className="text-4xl font-light font-serif text-left mb-8 ">
                Profile
              </h1>

              {/* PROFILE IMAGE */}
              <div className="relative mb-14 flex flex-col items-center lg:w-3xl">
                <div className="relative">
                  <img
                    src={profile}
                    alt="User"
                    className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#d9d9d9] object-cover p-2 shadow-lg"
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => !loading && fileInputRef.current?.click()}
                  disabled={loading}
                  className="absolute bottom-2 right-0 md:bottom-4 md:right-4 bg-black p-2 rounded-full border border-white/25 hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  title="Upload avatar"
                >
                  <Pencil size={16} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>

              {/* MESSAGE */}
              {message.text && (
                <div className={`w-full max-w-[650px] px-4 ml-0 lg:ml-16 mb-4 ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}>
                  {message.text}
                </div>
              )}

              {/* FORM SECTION */}
              <div className="w-full max-w-[650px] flex flex-col px-4  gap-6 ml-0 lg:ml-16">
                {/* NAME */}
                <input
                  className="block w-full bg-transparent text-lg py-2 border-b border-white/20 outline-none text-white/60 focus:text-white focus:border-white/40 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameBlur}
                  placeholder="Name"
                  disabled={saving}
                />

                {/* EMAIL */}
                <input
                  className="block w-full bg-transparent text-lg py-2 border-b border-white/20 outline-none text-white/60 cursor-not-allowed"
                  value={email}
                  disabled
                  placeholder="Email"
                />

                {/* PHONE */}
                <input
                  type="tel"
                  className="block w-full bg-transparent text-lg py-2 border-b border-white/20 outline-none text-white/60 focus:text-white focus:border-white/40 transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={handlePhoneBlur}
                  placeholder="Phone Number"
                  disabled={saving || loading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
