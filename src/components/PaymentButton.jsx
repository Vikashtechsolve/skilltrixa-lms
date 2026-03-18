import React, { useState } from "react";
import { subscriptionAPI } from "../utils/api";
import { tokenStorage } from "../utils/auth";

const PaymentButton = ({ selected, plans, onSuccess, onFailure, onNext }) => {
  const [loading, setLoading] = useState(false);

  const getSelectedPlanId = () => {
    if (!plans.length) return null;
    
    const planMap = {
      starter: plans.find(p => p.name.toLowerCase().includes("starter") || (p.billingCycle === "monthly" && p.price === 0)),
      monthly: plans.find(p => p.billingCycle === "monthly" && p.price > 0),
      yearly: plans.find(p => p.billingCycle === "yearly")
    };

    return planMap[selected]?._id || plans[0]?._id;
  };

  const handleClick = async () => {
    const planId = getSelectedPlanId();
    if (!planId) {
      onFailure({ error: "Plan not found" });
      return;
    }

    const selectedPlan = plans.find(p => p._id === planId);
    
    // Check if it's a free/starter plan BEFORE making API call
    const isFreePlan = selectedPlan && (
      selectedPlan.price === 0 || 
      selectedPlan.price === null || 
      selectedPlan.name?.toLowerCase().includes("starter")
    );
    
    console.log("Selected plan:", selectedPlan);
    console.log("Is free plan:", isFreePlan);
    
    setLoading(true);
    try {
      const orderResponse = await subscriptionAPI.createOrder(planId);
      
      console.log("Order response:", orderResponse);
      
      // Free plan (Starter Plan) - activate directly without payment
      // Check multiple conditions to ensure we don't show payment popup
      if (orderResponse.success && (
        orderResponse.isFreePlan === true || 
        !orderResponse.order || 
        isFreePlan
      )) {
        console.log("Activating free plan without payment");
        setLoading(false);
        // Now log in the user after free plan activation
        const user = tokenStorage.getUser();
        if (user && orderResponse.subscription) {
          // Update user data with subscription info
          const updatedUser = {
            ...user,
            subscription: orderResponse.subscription
          };
          tokenStorage.setTokens(
            tokenStorage.getAccessToken(),
            tokenStorage.getRefreshToken(),
            updatedUser
          );
        }
        onSuccess({ isFreePlan: true, subscription: orderResponse.subscription });
        return;
      }
      
      // Paid plan - proceed with payment
      // Only proceed if order exists AND it's NOT a free plan
      // Double-check: if isFreePlan is true or plan price is 0, don't proceed
      if (
        orderResponse.success && 
        orderResponse.order && 
        orderResponse.order.orderId && 
        orderResponse.isFreePlan !== true &&
        !isFreePlan
      ) {
        console.log("Proceeding with payment for paid plan");
        const { orderId, amount, currency } = orderResponse.order;
        const razorpayKey = orderResponse.key;
        
        if (!razorpayKey) {
          onFailure({ error: "Payment gateway key not found" });
          setLoading(false);
          return;
        }
        
        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
          const script = document.createElement("script");
          script.src = import.meta.env.VITE_RAZORPAY_CHECKOUT_SCRIPT_URL || "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => initiatePayment(orderId, amount, currency, planId, razorpayKey);
          script.onerror = () => {
            onFailure({ error: "Failed to load payment gateway" });
            setLoading(false);
          };
          document.body.appendChild(script);
        } else {
          initiatePayment(orderId, amount, currency, planId, razorpayKey);
        }
      } else if (orderResponse.success && (orderResponse.isFreePlan || isFreePlan)) {
        // This should have been handled above, but double-check to prevent payment popup
        console.log("Free plan detected, skipping payment");
        setLoading(false);
        const user = tokenStorage.getUser();
        if (user && orderResponse.subscription) {
          const updatedUser = {
            ...user,
            subscription: orderResponse.subscription
          };
          tokenStorage.setTokens(
            tokenStorage.getAccessToken(),
            tokenStorage.getRefreshToken(),
            updatedUser
          );
        }
        onSuccess({ isFreePlan: true, subscription: orderResponse.subscription });
      } else {
        onFailure({ error: orderResponse.message || "Failed to create order" });
        setLoading(false);
      }
    } catch (error) {
      onFailure(error);
      setLoading(false);
    }
  };

  const initiatePayment = (orderId, amount, currency, planId, razorpayKey) => {
    const user = tokenStorage.getUser();
    const options = {
      key: razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID || "",
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency || import.meta.env.VITE_DEFAULT_CURRENCY || "INR",
      name: import.meta.env.VITE_PAYMENT_GATEWAY_NAME || import.meta.env.VITE_APP_NAME || "Skilltrixa LMS",
      description: import.meta.env.VITE_APP_DESCRIPTION || "Subscription Payment",
      order_id: orderId,
      prefill: {
        name: user?.name || import.meta.env.VITE_RAZORPAY_PREFILL_NAME || "",
        email: user?.email || import.meta.env.VITE_RAZORPAY_PREFILL_EMAIL || "",
        contact: user?.phone || import.meta.env.VITE_RAZORPAY_PREFILL_CONTACT || "",
      },
      theme: {
        color: import.meta.env.VITE_APP_THEME_COLOR || "#ED0331",
      },
      handler: async function (response) {
        try {
          const verifyResponse = await subscriptionAPI.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            planId
          );

          if (verifyResponse.success) {
            onSuccess(response);
          } else {
            onFailure({ error: import.meta.env.VITE_ERROR_PAYMENT_VERIFICATION_FAILED || "Payment verification failed" });
          }
        } catch (error) {
          onFailure(error);
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          onFailure({ error: "Payment cancelled" });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      setLoading(false);
      onFailure(response.error || { error: "Payment failed" });
    });
  };

  const getSelectedPlan = () => {
    const planId = getSelectedPlanId();
    return plans.find(p => p._id === planId);
  };

  const selectedPlan = getSelectedPlan();
  const isFreePlan = selectedPlan && selectedPlan.price === 0;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`max-w-xl cursor-pointer w-full md:w-1/2 bg-red-700 hover:bg-red-800 text-white font-semibold py-4 rounded-md shadow-md ${
        loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading 
        ? (isFreePlan ? "Activating Plan..." : "Processing...") 
        : (isFreePlan ? "Activate Free Plan" : "Next")
      }
    </button>
  );
};

export default PaymentButton;

