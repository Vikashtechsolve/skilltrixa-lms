import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import { tokenStorage } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount - persists across browser sessions
  useEffect(() => {
    const checkAuth = async () => {
      // First check if session is expired (1 week)
      if (tokenStorage.isExpired()) {
        tokenStorage.clear();
        setLoading(false);
        return;
      }

      const token = tokenStorage.getAccessToken();
      if (token) {
        try {
          // Always verify token with backend to ensure it's still valid
          const response = await authAPI.getMe();
          if (response.success) {
            setUser(response.user);
            // Preserve existing tokens and expiration
            const existingUser = tokenStorage.getUser() || response.user;
            tokenStorage.setTokens(
              tokenStorage.getAccessToken(),
              tokenStorage.getRefreshToken(),
              response.user,
              !!localStorage.getItem("tokenExpiry") // Preserve remember me status
            );
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            tokenStorage.clear();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Try to refresh token if expired
          if (error.message?.includes("401") || error.message?.includes("expired")) {
            try {
              const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: tokenStorage.getRefreshToken() }),
              });
              const refreshData = await refreshResponse.json();
              
              if (refreshResponse.ok && refreshData.success) {
                tokenStorage.updateTokens(refreshData.accessToken, refreshData.refreshToken);
                // Retry getMe
                const retryResponse = await authAPI.getMe();
                if (retryResponse.success) {
                  setUser(retryResponse.user);
                  setIsAuthenticated(true);
                  setLoading(false);
                  return;
                }
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
            }
          }
          // Token expired or invalid, clear storage
          tokenStorage.clear();
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Set up periodic token refresh (every 30 minutes)
    const refreshInterval = setInterval(async () => {
      if (tokenStorage.isAuthenticated() && !tokenStorage.isExpired()) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/refresh-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
              tokenStorage.updateTokens(data.accessToken, data.refreshToken);
            }
          } catch (error) {
            console.error("Periodic token refresh failed:", error);
          }
        }
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        // Store tokens with rememberMe flag (defaults to true for 1-week persistence)
        tokenStorage.setTokens(
          response.accessToken,
          response.refreshToken,
          response.user,
          rememberMe
        );
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.message || "Login failed" };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await authAPI.register(name, email, password, phone);
      if (response.success) {
        return response;
      }
      return { success: false, error: response.message || response.error || "Registration failed" };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message || "Registration failed. Please check if backend is running." };
    }
  };

  const verifyOtp = async (email, otp, skipLogin = false, rememberMe = true) => {
    try {
      const response = await authAPI.verifyOtp(email, otp);
      if (response.success) {
        // If skipLogin is true, don't log in yet (for plan selection flow)
        if (!skipLogin) {
          tokenStorage.setTokens(
            response.accessToken,
            response.refreshToken,
            response.user,
            rememberMe
          );
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          // Store tokens temporarily but don't set auth state
          // This allows API calls but prevents LMS access
          tokenStorage.setTokens(
            response.accessToken,
            response.refreshToken,
            response.user,
            rememberMe
          );
        }
        return { success: true, user: response.user, accessToken: response.accessToken, refreshToken: response.refreshToken };
      }
      return { success: false, error: response.message || "OTP verification failed" };
    } catch (error) {
      return { success: false, error: error.message || "OTP verification failed" };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Method to complete login after plan selection
  const completeLogin = (userData) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      tokenStorage.setTokens(
        tokenStorage.getAccessToken(),
        tokenStorage.getRefreshToken(),
        userData
      );
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyOtp,
    logout,
    completeLogin,
    setUser,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

