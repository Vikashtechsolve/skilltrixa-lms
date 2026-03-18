/**
 * Token Storage Utility
 * Stores tokens in localStorage for persistence across browser sessions
 * Implements 1-week persistent login
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: import.meta.env.VITE_TOKEN_STORAGE_ACCESS_KEY || "accessToken",
  REFRESH_TOKEN: import.meta.env.VITE_TOKEN_STORAGE_REFRESH_KEY || "refreshToken",
  USER: import.meta.env.VITE_TOKEN_STORAGE_USER_KEY || "user",
  LOGIN_TIMESTAMP: "loginTimestamp",
  TOKEN_EXPIRY: "tokenExpiry",
};

// 1 week in milliseconds
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const tokenStorage = {
  /**
   * Save tokens and user data with expiration tracking
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token
   * @param {object} user - User data
   * @param {boolean} rememberMe - Whether to remember for 1 week
   */
  setTokens: (accessToken, refreshToken, user = null, rememberMe = true) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    
    if (user) {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    }

    if (rememberMe) {
      const loginTimestamp = Date.now();
      const expiryTimestamp = loginTimestamp + ONE_WEEK_MS;
      localStorage.setItem(TOKEN_KEYS.LOGIN_TIMESTAMP, loginTimestamp.toString());
      localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, expiryTimestamp.toString());
    } else {
      // If not remembering, clear timestamp (session-based)
      localStorage.removeItem(TOKEN_KEYS.LOGIN_TIMESTAMP);
      localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
    }
  },

  /**
   * Get access token
   */
  getAccessToken: () => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get refresh token
   */
  getRefreshToken: () => {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get user data
   */
  getUser: () => {
    const userStr = localStorage.getItem(TOKEN_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated and session is valid
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (!token) return false;

    // Check if remember me was used
    const expiryTimestamp = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (expiryTimestamp) {
      const expiry = parseInt(expiryTimestamp, 10);
      const now = Date.now();
      
      // If expired, clear tokens
      if (now > expiry) {
        this.clear();
        return false;
      }
    }

    return true;
  },

  /**
   * Check if session is expired
   */
  isExpired: () => {
    const expiryTimestamp = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryTimestamp) return false; // Session-based, not expired by timestamp
    
    const expiry = parseInt(expiryTimestamp, 10);
    return Date.now() > expiry;
  },

  /**
   * Get time remaining until expiration (in milliseconds)
   */
  getTimeRemaining: () => {
    const expiryTimestamp = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryTimestamp) return null;
    
    const expiry = parseInt(expiryTimestamp, 10);
    const remaining = expiry - Date.now();
    return remaining > 0 ? remaining : 0;
  },

  /**
   * Update tokens (for refresh)
   */
  updateTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    }
    
    // Extend expiry if remember me was set
    const expiryTimestamp = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (expiryTimestamp) {
      const loginTimestamp = localStorage.getItem(TOKEN_KEYS.LOGIN_TIMESTAMP);
      if (loginTimestamp) {
        const newExpiry = parseInt(loginTimestamp, 10) + ONE_WEEK_MS;
        localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, newExpiry.toString());
      }
    }
  },

  /**
   * Clear all auth data
   */
  clear: () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.LOGIN_TIMESTAMP);
    localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
  },
};

