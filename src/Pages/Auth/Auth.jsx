import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  const email = location.state?.email || "";
  const userId = location.state?.userId || "";
  const isNewUser = location.state?.isNewUser || false;
  const isForgotPassword = location.state?.isForgotPassword || false;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate(isForgotPassword ? "/app/signin" : "/");
    }
  }, [email, navigate, isForgotPassword]);

  const handleResendOtp = async () => {
    setResending(true);
    setError("");
    try {
      const response = isForgotPassword
        ? await authAPI.forgotPasswordSendOtp(email)
        : await authAPI.resendOtp(email);
      if (response.success) {
        if (isForgotPassword) {
          setError("");
          // Optional: show a brief success message in-page
        }
        alert("OTP resent successfully. Please check your email.");
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyAndSave = async () => {
    if (!otp || !password) {
      setError("Please enter both OTP and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isForgotPassword) {
        const response = await authAPI.resetPasswordWithOtp(email, otp, password);
        if (response.success) {
          setShowSuccessPopup(true);
          return;
        } else {
          setError(response.message || response.error || "Failed to update password");
        }
        setSaving(false);
        return;
      }

      // Signup flow: verify OTP but DON'T log in yet (skipLogin = true)
      const verifyResponse = await verifyOtp(email, otp, true);

      if (!verifyResponse.success) {
        setError(verifyResponse.error || "OTP verification failed");
        setSaving(false);
        return;
      }

      if (isNewUser) {
        try {
          await authAPI.updatePasswordAfterOtp(email, password);
        } catch (err) {
          console.error("Password update error:", err);
        }
      }

      const from = location.state?.from || "/app";
      navigate("/planChooser", {
        state: {
          email,
          userId,
          accessToken: verifyResponse.accessToken,
          refreshToken: verifyResponse.refreshToken,
          user: verifyResponse.user,
          from,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    navigate("/app/signin");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <header className="w-full h-20 border-b border-gray-500 px-4 md:px-12 flex justify-between items-center py-4">
        {/* logo: smaller on mobile, original size on md+ */}
        <img
          src="/logo.svg"
          alt="Skilltrixa"
          className="h-20 w-20 md:h-40 md:w-40 object-contain"
        />

        <button
          on
          onClick={() => navigate("/app/signin")}
          className="cursor-pointer"
        >
          <p className="font-medium underline text-sm md:text-base">Sign in</p>
        </button>
      </header>

      {/* heading area: keep same look but responsive spacing */}
      <div className="mt-18 md:mt-16 w-full px-4 md:px-0 max-w-[820px]">
        <div className="mx-auto" style={{ maxWidth: "580px" }}>
          {!isForgotPassword && (
            <p className="text-gray-900 text-left text-sm">
              Step <span className="font-bold">1</span> of{" "}
              <span className="font-bold">3</span>
            </p>
          )}
          <h1 className="text-2xl  text-left md:text-3xl font-bold mt-3 text-black">
            {isForgotPassword
              ? "Reset Your Password"
              : "Verify Your Email and Enter Your Password"}
          </h1>
          <p className="text-gray-600 text-left mt-3 text-sm">
            {isForgotPassword
              ? "We've sent a verification code to your email. Enter the OTP and your new password below."
              : "We've sent a verification code to your registered email address. Please confirm your identity and enter your password."}
          </p>
        </div>
      </div>

      {/* form area - same visual size on desktop, fluid on mobile */}
      <div className="w-full px-4 md:px-0 mt-6 md:mt-2">
        <div className="mx-auto w-full max-w-[580px] space-y-5">
          {/* Disabled Email Box */}
          <div className="flex items-center gap-3">
            <p className="text-left font-medium">Registered Email :</p>
            <span className="text-left text-red-500 text-black font-semibold">
              {email || "No email provided"}
            </span>
          </div>
          {/* OTP Input */}
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            className="w-full border border-gray-300 rounded-md p-3.5 placeholder:text-gray-400 outline-none text-black font-medium"
            maxLength={6}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          {/* Password Input */}
          <input
            type="password"
            placeholder={isForgotPassword ? "Enter new password" : "Enter Password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-md p-3.5 placeholder:text-gray-400 outline-none text-black font-medium"
          />

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleVerifyAndSave}
            disabled={saving}
            className={`w-full bg-red-700 text-white py-4 rounded-lg font-semibold shadow-md transition cursor-pointer ${
              saving ? "opacity-60 cursor-not-allowed" : "hover:bg-red-800"
            }`}
          >
            {saving
              ? isForgotPassword
                ? "Updating..."
                : "Verifying..."
              : isForgotPassword
                ? "Update Password"
                : "Next"}
          </button>
        </div>
      </div>

      {/* Themed success popup - same theme as SignIn (dark + red) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-[#141414] rounded-2xl p-8 shadow-[0_6px_20px_rgba(0,0,0,0.6)] border border-[#2b2b2b] text-white text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#B11C20]/20 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#B11C20]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Password updated successfully
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              You can now sign in with your new password.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full bg-[#B11C20] hover:bg-[#991219] rounded-lg py-3 text-white font-semibold transition"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
