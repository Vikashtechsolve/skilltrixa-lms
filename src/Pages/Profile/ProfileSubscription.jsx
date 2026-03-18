import { Check, Lock, Star, ListCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./ProfileSidebar";
import Header from "../Header/Header";
import { subscriptionAPI, plansAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function ProfileSubscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const subResponse = await subscriptionAPI.getStatus();
      setSubscription(subResponse);

      if (subResponse.planId) {
        const plans = await plansAPI.listPlans();
        const plan = plans.find((p) => p._id === subResponse.planId);
        setPlanDetails(plan);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate("/planChooser");
  };

  const isActive = subscription?.status === "active" && 
    subscription?.endAt && 
    new Date(subscription.endAt) > new Date();

  const planName = planDetails?.name || subscription?.planName || "No Plan";
  const isStarterPlan = planName.toLowerCase().includes("starter") || 
    (planDetails?.price === 0);
  
  // Show upgrade button only if:
  // 1. No active subscription, OR
  // 2. Active subscription but it's a starter/free plan
  // Don't show if user has an active paid plan
  const shouldShowUpgradeButton = !isActive || (isActive && isStarterPlan);

  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full z-40">
          <Header />
        </div>
        <div className="flex bg-[#141414] pt-16 text-white min-h-screen">
          <div className="mt-0 px-0 md:mt-8 md:px-12">
            <Sidebar />
          </div>
          <div className="flex-1 px-6 sm:px-10 py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading subscription...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>

      <div className="flex bg-[#141414] pt-16 text-white min-h-screen">
        {/* Sidebar */}
        <div className="mt-0 px-0 md:mt-8 md:px-12">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 sm:px-10 py-10">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold mb-8 text-left">Profile</h1>

          {/* Section Title */}
          <div className="flex items-center gap-2 mb-6">
            <ListCheck size={20} />
            <h2 className="text-xl font-medium">Subscription</h2>
          </div>

          {/* CURRENT PLAN BOX */}
          <div
            className="bg-[#111111] border border-white/10 rounded-xl px-6 py-5 mb-8 
                        w-full sm:w-[80%] lg:w-[60%] xl:w-[60%]"
          >
            <p className="text-[14px] text-left">
              <span className="font-medium">Your Current Plan :</span> {planName}
            </p>
            <p className="text-gray-400 text-[13px] mt-1 text-left">
              {isActive ? (
                <>
                  {isStarterPlan 
                    ? "You're on the free plan with limited access"
                    : `Active until ${new Date(subscription.endAt).toLocaleDateString()}`
                  }
                </>
              ) : (
                "No active subscription"
              )}
            </p>
          </div>

          {/* FEATURES SECTION */}
          <div
            className="bg-[#111111] border border-white/10 rounded-xl px-6 py-8 
                         sm:w-[80%] lg:w-[60%] xl:w-[60%]"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-10">
              {/* Included Features */}
              <div className="flex-1">
                <h3 className="font-medium mb-4 text-[15px] text-left">
                  Features Included :
                </h3>
                <div className="flex flex-col gap-3 text-[14px] text-gray-300">
                  {[
                    "Website Overview",
                    "Access to all playlist cards",
                    "Masterclass cards visible",
                    "Blogs cards visible",
                    "News cards visible",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked Features */}
              <div className="flex-1">
                <h3 className="font-medium mb-4 text-[15px] text-left">
                  Locked Features :
                </h3>
                <div className="flex flex-col gap-3 text-[14px] text-gray-300">
                  {[
                    "Playlist details (Notes, Videos, PPT, Text)",
                    "Doubt Session Access",
                    "Mentor Connect",
                    "Live Master Classes Access",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Lock size={18} className="text-yellow-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* UPGRADE BTN */}
          {shouldShowUpgradeButton && (
          <div
            className="flex justify-center mt-10 
                        w-full sm:w-[80%] lg:w-[60%] xl:w-[50%]"
          >
              <button 
                onClick={handleUpgrade}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition text-white text-[15px] px-10 py-4 rounded-md font-medium"
              >
              <Star size={18} color="#FFD700" fill="#FFD700" />
                {isActive && isStarterPlan ? "Upgrade to Premium" : "Subscribe Now"}
            </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
}
