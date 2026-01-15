import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * Axios instance configured for HttpOnly cookie authentication with CSRF protection.
 * Tokens are stored in secure HttpOnly cookies and sent automatically.
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // CRITICAL: Enable credentials to send/receive cookies cross-origin
  withCredentials: true,
  // Enable XSRF token handling
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

/**
 * Get CSRF token from cookie
 */
function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use(
  (config) => {
    // Add CSRF token for state-changing requests
    if (["post", "put", "delete", "patch"].includes(config.method?.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    throw error;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors by attempting token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token is sent automatically via cookie
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.authenticated) {
          localStorage.setItem("isAuthenticated", "true");
          // Retry original request - new access token cookie is already set
          return api(originalRequest);
        }
      } catch (err) {
        // Refresh failed - clear auth state and redirect to login
        localStorage.removeItem("isAuthenticated");
        globalThis.location.href = "/login";
        throw err;
      }
    }

    throw error;
  }
);

export default api;
