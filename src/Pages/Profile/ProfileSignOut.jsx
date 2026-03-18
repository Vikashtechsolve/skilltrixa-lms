import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "./ProfileSidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProfileSignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if API call fails
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      <div className="flex bg-[#141414] text-white pt-16 min-h-screen">
        {/* Sidebar */}
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-10 py-10">
          <h1 className="text-[40px] font-semibold mb-10 text-left">Profile</h1>

          {/* Header */}
          <div className="flex items-center gap-3 mb-12 cursor-default">
            <LogOut size={22} />
            <h1 className="text-2xl font-semibold">Sign Out</h1>
          </div>

          {/* Message Section */}
          <div className="max-w-2xl mx-auto text-center mt-4">
            <h2 className="text-xl font-medium mb-4">
              Are You Sure You Want to Sign Out?
            </h2>

            <p className="text-[#C6C6C6] text-sm mb-10">
              You will be logged out of your LMS account and will need to sign
              in again to continue learning.
            </p>

            {/* Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleSignOut}
                disabled={loading}
                className="w-full bg-[#151515] border border-[#262626] rounded-lg py-4 text-center hover:border-[#3A3A3A] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing out..." : "Yes"}
              </button>

              <button 
                onClick={handleCancel}
                disabled={loading}
                className="w-full bg-[#151515] border border-[#262626] rounded-lg py-4 text-center hover:border-[#3A3A3A] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSignOut;
