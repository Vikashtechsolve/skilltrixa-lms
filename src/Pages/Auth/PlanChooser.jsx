import React, { useState, useEffect } from "react";
import StarterPlan from "../../components/Cards/StarterPlan";
import MonthlyPlan from "../../components/Cards/MonthlyPlan";
import YearlyPlan from "../../components/Cards/YearlyPlan";
import { useNavigate, useLocation } from "react-router-dom";
import { plansAPI, subscriptionAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { tokenStorage } from "../../utils/auth";
import PaymentButton from "../../components/PaymentButton";

/**
 * PlanChooser
 * Composes the three plan cards and provides Next button
 * Usage: <PlanChooser onNext={(planId) => ...} />
 */
export default function PlanChooser({ onNext }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeLogin, isAuthenticated } = useAuth();

  const [selected, setSelected] = useState("starter");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [freePlanExpired, setFreePlanExpired] = useState(!!location.state?.expiredFreePlan);

  useEffect(() => {
    // Check if we have tokens from previous step (OTP verification) or existing login
    const accessToken = location.state?.accessToken || tokenStorage.getAccessToken();
    const refreshToken = location.state?.refreshToken || tokenStorage.getRefreshToken();

    // If no tokens and not authenticated, redirect to landing page
    if (!accessToken && !isAuthenticated) {
      navigate("/");
      return;
    }

    // Set tokens if we have them from location state
    if (location.state?.accessToken && !tokenStorage.getAccessToken()) {
      tokenStorage.setTokens(
        location.state.accessToken,
        location.state.refreshToken,
        location.state.user
      );
    }

    // Check if user already has an active subscription (and set freePlanExpired from API)
    checkExistingSubscription();
    fetchPlans();
  }, [navigate, location, isAuthenticated]);

  // When free plan is expired, force selection to monthly so user cannot submit free plan
  useEffect(() => {
    if (freePlanExpired && selected === "starter") {
      setSelected("monthly");
    }
  }, [freePlanExpired, selected]);

  const checkExistingSubscription = async () => {
    try {
      const response = await subscriptionAPI.getStatus();
      const hasActiveSubscription =
        response.status === "active" &&
        response.endAt &&
        new Date(response.endAt) > new Date();

      if (hasActiveSubscription) {
        // User already has subscription, redirect to original location or LMS
        const from = location.state?.from || "/app";
        navigate(from);
        return;
      }
      // When no active subscription, use backend flag for expired free plan (one-time view)
      setFreePlanExpired(response.expiredFreePlan === true);
    } catch (error) {
      console.error("Subscription check error:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Fetching plans...");
      const plansData = await plansAPI.listPlans();
      console.log("Plans received:", plansData);
      
      if (Array.isArray(plansData)) {
        setPlans(plansData);
        // If no plans found, set default selection
        if (plansData.length === 0) {
          setError("No plans available. Please contact support.");
        } else {
          // Auto-select starter plan if available
          const starterPlan = plansData.find(p => 
            p.name.toLowerCase().includes("starter") || 
            (p.billingCycle === "monthly" && p.price === 0)
          );
          if (starterPlan) {
            setSelected("starter");
          }
        }
      } else {
        console.error("Invalid plans data:", plansData);
        setError("Invalid response from server. Please try again.");
        setPlans([]);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      // Use the error message from the API call which already includes the URL
      setError(err.message || "Failed to load plans. Please check your network connection.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Map plan selection to plan ID from database
  const getSelectedPlanId = () => {
    if (!plans.length) return null;
    
    // Map UI selection to database plan
    const planMap = {
      starter: plans.find(p => p.name.toLowerCase().includes("starter") || p.billingCycle === "monthly" && p.price === 0),
      monthly: plans.find(p => p.billingCycle === "monthly" && p.price > 0),
      yearly: plans.find(p => p.billingCycle === "yearly")
    };

    return planMap[selected]?._id || plans[0]?._id;
  };

  const handlePaymentSuccess = async (razorpayResponse) => {
    setProcessingPayment(true);
    try {
      
      // Free plan - already activated, now log in user
      if (razorpayResponse.isFreePlan) {
        // Get user data and complete login
        const user = tokenStorage.getUser();
        if (user) {
          // Update user with subscription info if available
          const updatedUser = razorpayResponse.subscription 
            ? { ...user, subscription: razorpayResponse.subscription }
            : user;
          
          // Complete login process
          completeLogin(updatedUser);
          
          // Redirect to original location or LMS
          const from = location.state?.from || "/app";
          navigate(from);
          return;
        }
        const from = location.state?.from || "/app";
        navigate(from);
        return;
      }

      // Paid plan - verify payment
      const planId = getSelectedPlanId();
      if (!planId) {
        throw new Error("Plan not found");
      }

      const verifyResponse = await subscriptionAPI.verifyPayment(
        razorpayResponse.razorpay_order_id,
        razorpayResponse.razorpay_payment_id,
        razorpayResponse.razorpay_signature,
        planId
      );

      if (verifyResponse.success) {
        // Get user data and complete login
        const user = tokenStorage.getUser();
        if (user) {
          // Update user with subscription info
          const updatedUser = verifyResponse.subscription 
            ? { ...user, subscription: verifyResponse.subscription }
            : user;
          
          // Complete login process
          completeLogin(updatedUser);
          
          // Redirect to original location or LMS
          const from = location.state?.from || "/app";
          navigate(from);
        } else {
          const from = location.state?.from || "/app";
          navigate(from);
        }
      } else {
        setError("Payment verification failed. Please contact support.");
      }
    } catch (err) {
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentFailure = (error) => {
    setError(error.error?.description || error.message || "Payment failed. Please try again.");
    setProcessingPayment(false);
  };

  // This function is no longer used - PaymentButton handles everything
  const handleNext = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-white py-4 ">
      <header className="w-full h-14 border-b border-gray-500 px-4 md:px-12 flex justify-between items-center py-4 ">
       
        <img
          src="/logo.svg"
          alt="Skilltrixa"
          className=" h-20 w-20 md:h-40 md:w-40 object-contain"
        />

        <button
          onClick={() => navigate("/app/signin")}
          className="cursor-pointer"
        >
          <p className=" font-medium underline text-sm md:text-base">Sign out</p>
        </button>
      </header>

      <div className="max-w-[1200px] mt-8 mx-auto px-6">
        <div className="mb-6 text-left">
          <p className="text-sm text-gray-600">Step 2 of 3</p>
          <h2 className="text-md md:text-3xl font-bold text-gray-900 mt-2">
            Choose the Learning Plan that’s right for you
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading plans...</p>
          </div>
        ) : error && !plans.length ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPlans}
              className="mt-4 text-red-700 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                {freePlanExpired && (
                  <p className="text-center text-red-600 font-medium text-sm mb-2">
                    Your free plan is expired.
                  </p>
                )}
                <StarterPlan
                  selected={selected}
                  onSelect={setSelected}
                  disabled={freePlanExpired}
                />
              </div>
              <MonthlyPlan selected={selected} onSelect={setSelected} />
              <YearlyPlan selected={selected} onSelect={setSelected} />
            </div>

            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              {processingPayment ? (
                <div className="text-center">
                  <p className="text-gray-600">Processing payment...</p>
                </div>
              ) : (
                <PaymentButton
                  selected={selected}
                  plans={plans}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  onNext={handleNext}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
