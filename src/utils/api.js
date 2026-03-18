// Import tokenStorage for expiration checks
import { tokenStorage } from "./auth";

// API Base URL - Update this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Always log API URL in production for debugging deployment issues
// This helps identify if env vars were set correctly during build
console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🔗 Environment Variable VITE_API_URL:", import.meta.env.VITE_API_URL || "NOT SET");
console.log("🔗 Mode:", import.meta.env.MODE);
console.log("🔗 Production:", import.meta.env.PROD);

// Warn if using default localhost URL in production
if (import.meta.env.PROD && API_BASE_URL === "http://localhost:8000") {
  console.error("❌ ERROR: Using default localhost API URL in production!");
  console.error("❌ VITE_API_URL environment variable was NOT set during build.");
  console.error("❌ Please set VITE_API_URL in your deployment platform's environment variables and rebuild.");
}

/**
 * Get stored access token
 */
const getAccessToken = () => {
  return tokenStorage.getAccessToken();
};

/**
 * Get stored refresh token
 */
const getRefreshToken = () => {
  return tokenStorage.getRefreshToken();
};

/**
 * API request wrapper with automatic token handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If response is not JSON, create error message
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error("Invalid response from server");
    }

    // If token expired, try to refresh
    if (response.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request with new token
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
        const retryResponse = await fetch(url, config);
        const retryData = await retryResponse.json();
        if (!retryResponse.ok) {
          throw new Error(retryData.message || retryData.error || "Request failed");
        }
        return retryData;
      }
    }

    if (!response.ok) {
      // Include validation errors if present
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(e => e.msg || e.message || JSON.stringify(e)).join(", ");
        throw new Error(data.message || errorMessages || data.error || `Request failed with status ${response.status}`);
      }
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Improve error messages for network issues
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      // Use environment variable for error message, but always show the actual API URL being used
      const customErrorMsg = import.meta.env.VITE_ERROR_BACKEND_CONNECTION;
      const errorMsg = customErrorMsg 
        ? `${customErrorMsg} (${API_BASE_URL})`
        : `Cannot connect to server at ${API_BASE_URL}. Please check your network connection and ensure the backend is running.`;
      throw new Error(errorMsg);
    }
    throw error;
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  // Check if session is expired (1 week)
  if (tokenStorage.isExpired()) {
    tokenStorage.clear();
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Update tokens while preserving expiration
      tokenStorage.updateTokens(data.accessToken, data.refreshToken);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Auth API calls
export const authAPI = {
  register: async (name, email, password, phone) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
  },

  verifyOtp: async (email, otp) => {
    return apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resendOtp: async (email) => {
    return apiRequest("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  forgotPasswordSendOtp: async (email) => {
    return apiRequest("/auth/forgot-password-send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPasswordWithOtp: async (email, otp, newPassword) => {
    return apiRequest("/auth/reset-password-with-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    tokenStorage.clear();
  },

  getMe: async () => {
    return apiRequest("/auth/me", {
      method: "GET",
    });
  },

  updatePasswordAfterOtp: async (email, newPassword) => {
    return apiRequest("/auth/update-password-after-otp", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    });
  },

  updateProfile: async (name, phone, avatarUrl) => {
    const payload = { name };
    // Always include phone, even if empty string
    if (phone !== undefined) {
      payload.phone = phone;
    }
    if (avatarUrl !== undefined) {
      payload.avatarUrl = avatarUrl;
    }
    return apiRequest("/auth/update-profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  uploadAvatar: async (imageFile) => {
    const token = getAccessToken();
    const url = `${API_BASE_URL}/auth/upload-avatar`;
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to upload avatar");
    }
    return data;
  },
};

// Plans API calls
export const plansAPI = {
  listPlans: async () => {
    return apiRequest("/plans", {
      method: "GET",
    });
  },
};

// Subscription API calls
export const subscriptionAPI = {
  createOrder: async (planId) => {
    return apiRequest("/subscription/create-order", {
      method: "POST",
      body: JSON.stringify({ planId }),
    });
  },

  verifyPayment: async (razorpay_order_id, razorpay_payment_id, razorpay_signature, planId) => {
    return apiRequest("/subscription/verify-payment", {
      method: "POST",
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
      }),
    });
  },

  getStatus: async () => {
    return apiRequest("/subscription/status", {
      method: "GET",
    });
  },
};

// Blogs API calls
export const blogsAPI = {
  // Get all blogs with optional pagination and filtering
  getBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.author) queryParams.append("author", params.author);
    if (params.tags) queryParams.append("tags", params.tags);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    return apiRequest(`/api/blogs${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  // Get blog by ID
  getBlogById: async (id) => {
    return apiRequest(`/api/blogs/${id}`, {
      method: "GET",
    });
  },

  // Create blog (with optional image file)
  createBlog: async (blogData, imageFile = null) => {
    const token = getAccessToken();
    const url = `${API_BASE_URL}/api/blogs`;
    const formData = new FormData();

    // Add text fields
    Object.keys(blogData).forEach((key) => {
      if (key !== "image" && blogData[key] !== undefined && blogData[key] !== null) {
        if (Array.isArray(blogData[key])) {
          blogData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, blogData[key]);
        }
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (blogData.image) {
      // If image URL provided, add it
      formData.append("image", blogData.image);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to create blog");
    }
    return data;
  },

  // Update blog
  updateBlog: async (id, blogData, imageFile = null) => {
    const token = getAccessToken();
    const url = `${API_BASE_URL}/api/blogs/${id}`;
    const formData = new FormData();

    // Add text fields
    Object.keys(blogData).forEach((key) => {
      if (key !== "image" && blogData[key] !== undefined && blogData[key] !== null) {
        if (Array.isArray(blogData[key])) {
          blogData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, blogData[key]);
        }
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (blogData.image) {
      formData.append("image", blogData.image);
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to update blog");
    }
    return data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    return apiRequest(`/api/blogs/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle watchlist
  toggleWatchlist: async (id) => {
    return apiRequest(`/api/blogs/${id}/watchlist`, {
      method: "POST",
    });
  },
};

// News API calls
export const newsAPI = {
  // Get all news with optional pagination and filtering
  getNews: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.author) queryParams.append("author", params.author);
    if (params.tags) queryParams.append("tags", params.tags);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    return apiRequest(`/api/news${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  // Get news by ID
  getNewsById: async (id) => {
    return apiRequest(`/api/news/${id}`, {
      method: "GET",
    });
  },

  // Create news (with optional image file)
  createNews: async (newsData, imageFile = null) => {
    const token = getAccessToken();
    const url = `${API_BASE_URL}/api/news`;
    const formData = new FormData();

    // Add text fields
    Object.keys(newsData).forEach((key) => {
      if (key !== "image" && newsData[key] !== undefined && newsData[key] !== null) {
        if (Array.isArray(newsData[key])) {
          newsData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, newsData[key]);
        }
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (newsData.image) {
      formData.append("image", newsData.image);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to create news");
    }
    return data;
  },

  // Update news
  updateNews: async (id, newsData, imageFile = null) => {
    const token = getAccessToken();
    const url = `${API_BASE_URL}/api/news/${id}`;
    const formData = new FormData();

    // Add text fields
    Object.keys(newsData).forEach((key) => {
      if (key !== "image" && newsData[key] !== undefined && newsData[key] !== null) {
        if (Array.isArray(newsData[key])) {
          newsData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, newsData[key]);
        }
      }
    });

    // Add image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (newsData.image) {
      formData.append("image", newsData.image);
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to update news");
    }
    return data;
  },

  // Delete news
  deleteNews: async (id) => {
    return apiRequest(`/api/news/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle watchlist
  toggleWatchlist: async (id) => {
    return apiRequest(`/api/news/${id}/watchlist`, {
      method: "POST",
    });
  },
};

// Comments API calls
export const commentsAPI = {
  // Get comments for a blog or news
  getComments: async (contentType, contentId) => {
    return apiRequest(`/api/comments/${contentType}/${contentId}`, {
      method: "GET",
    });
  },

  // Create a comment
  createComment: async (commentData) => {
    return apiRequest("/api/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  },

  // Update a comment
  updateComment: async (commentId, text) => {
    return apiRequest(`/api/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ text }),
    });
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    return apiRequest(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
  },
};

// Quiz API calls
export const quizAPI = {
  // Get quiz by ID (public endpoint)
  getQuizById: async (quizId) => {
    return apiRequest(`/api/quizzes/${quizId}`, {
      method: "GET",
    });
  },

  // Start quiz attempt (requires sessionId in body)
  startQuizAttempt: async (quizId, sessionId) => {
    return apiRequest(`/quizzes/${quizId}/attempts`, {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
  },

  // Submit quiz attempt
  submitQuizAttempt: async (quizId, attemptId, answers) => {
    return apiRequest(`/quizzes/${quizId}/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },

  // Get my quiz attempts
  getMyQuizAttempts: async (quizId) => {
    return apiRequest(`/quizzes/${quizId}/my-attempts`, {
      method: "GET",
    });
  },

  // Get quiz attempt by ID (full details)
  getQuizAttemptById: async (attemptId) => {
    return apiRequest(`/quiz-attempts/${attemptId}`, {
      method: "GET",
    });
  },
};

// Playlist API calls
export const playlistAPI = {
  // Get all playlists (public)
  getPlaylists: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.tag) queryParams.append("tag", params.tag);
    if (params.tags) queryParams.append("tags", params.tags);
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params.category) queryParams.append("category", params.category);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    return apiRequest(`/playlists${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  // Get playlist by ID (public) - uses slug or ID
  getPlaylistById: async (id) => {
    return apiRequest(`/playlists/${id}`, {
      method: "GET",
    });
  },

  // Get playlist modules (authenticated)
  getPlaylistModules: async (playlistId) => {
    return apiRequest(`/playlists/${playlistId}/modules`, {
      method: "GET",
    });
  },

  // Get session details (authenticated)
  getSessionById: async (sessionId) => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: "GET",
    });
  },

  // Get session resources with signed URLs (authenticated)
  getSessionResources: async (sessionId) => {
    return apiRequest(`/api/sessions/${sessionId}/resources`, {
      method: "GET",
    });
  },

  // Get quiz for a session (public endpoint)
  getSessionQuiz: async (sessionId) => {
    return apiRequest(`/sessions/${sessionId}/quiz`, {
      method: "GET",
    });
  },

  // Get media asset signed URL (authenticated)
  getMediaAssetSignedUrl: async (assetId) => {
    return apiRequest(`/media-assets/${assetId}/signed-url`, {
      method: "GET",
    });
  },
};

// Progress API calls
export const progressAPI = {
  // Get comprehensive progress summary
  getProgressSummary: async () => {
    return apiRequest("/api/progress/summary", {
      method: "GET",
    });
  },
  // Get continue watching data
  getContinueWatching: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);
    const queryString = queryParams.toString();
    return apiRequest(`/api/progress/continue-watching${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },
  // Update session progress
  updateSessionProgress: async (sessionId, progressData) => {
    return apiRequest(`/sessions/${sessionId}/progress`, {
      method: "POST",
      body: JSON.stringify(progressData),
    });
  },
};

// Notification API calls
export const notificationAPI = {
  // Get user notifications with pagination
  getNotifications: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.read !== undefined) queryParams.append("read", params.read);
    if (params.type) queryParams.append("type", params.type);

    const queryString = queryParams.toString();
    return apiRequest(`/api/notifications${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  // Get unread notification count
  getUnreadCount: async () => {
    return apiRequest("/api/notifications/unread-count", {
      method: "GET",
    });
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return apiRequest(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiRequest("/api/notifications/read-all", {
      method: "PUT",
    });
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    return apiRequest(`/api/notifications/${notificationId}`, {
      method: "DELETE",
    });
  },
};

// Masterclass API calls
export const masterclassAPI = {
  // Get all masterclasses with filtering
  getMasterclasses: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiRequest(`/api/masterclasses${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  // Get masterclass by slug
  getMasterclassBySlug: async (slug) => {
    return apiRequest(`/api/masterclasses/${slug}`, {
      method: "GET",
    });
  },

  // Get video URL for recorded masterclass
  getMasterclassVideoUrl: async (slug) => {
    return apiRequest(`/api/masterclasses/${slug}/video-url`, {
      method: "GET",
    });
  },

  // Get notes download URL
  getMasterclassNotesUrl: async (slug) => {
    return apiRequest(`/api/masterclasses/${slug}/notes-url`, {
      method: "GET",
    });
  },
};

export default apiRequest;

