import React, { useEffect } from "react";
import RazorpayPayment from "./RazorpayPayment";

const AutoPay = () => {
  const handleSuccess = (response) => {
    alert("✅ Payment successful! " + JSON.stringify(response));
  };

  const handleFailure = (error) => {
    alert("❌ Payment failed! " + JSON.stringify(error));
  };

  // Auto-trigger payment when component mounts
  useEffect(() => {
    document.getElementById("autoPayBtn")?.click();
  }, []);

  return (
    <div style={{ padding: "50px" }}>
      <h2>💳 Auto Razorpay Payment Example</h2>

      {/* Button triggers payment, can be hidden if you want */}
      <RazorpayPayment
        amount={19} // The amount you want to pay
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        id="autoPayBtn"
      />
    </div>
  );
};

export default AutoPay;
