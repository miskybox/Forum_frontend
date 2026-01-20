import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Flag to prevent multiple redirects
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  const match = /XSRF-TOKEN=([^;]+)/.exec(document.cookie);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Request interceptor - adds CSRF token and logs requests in development
 */
api.interceptors.request.use(
  (config) => {
    // Add CSRF token for state-changing requests
    if (["post", "put", "delete", "patch"].includes(config.method?.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
      }
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🌐 [API] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        withCredentials: config.withCredentials
      });
    }
    
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ [API] Request error:', error);
    }
    throw error;
  }
);

/**
 * Response interceptor - handles errors and token refresh
 */
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development with detailed info
    if (import.meta.env.DEV) {
      console.error(`❌ [API] Error ${error.response?.status || 'NETWORK'}:`, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }

    // Don't retry for login/register/refresh endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
    
    // Handle 401 errors by attempting token refresh (except for auth endpoints)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is sent automatically via cookie
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.authenticated) {
          localStorage.setItem("isAuthenticated", "true");
          processQueue(null);
          // Retry original request - new access token cookie is already set
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed - clear auth state
        localStorage.removeItem("isAuthenticated");
        
        // Only redirect if not already on login page
        if (!globalThis.location.pathname.includes('/login')) {
          console.warn('🔐 [API] Session expired, redirecting to login');
          globalThis.location.href = "/login?session=expired";
        }
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    // Enhance error message for network errors
    if (!error.response) {
      error.userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (error.response.status === 500) {
      error.userMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
    } else if (error.response.status === 403) {
      error.userMessage = 'No tienes permisos para realizar esta acción.';
    }

    throw error;
  }
);

export default api;
