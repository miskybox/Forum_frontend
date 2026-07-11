import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 20000);
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);
// Render free tier puede tardar 30-60s en despertar de un cold start; con el
// warm-up disparado al cargar la app (main.jsx) 1 reintento suele bastar,
// pero se deja margen extra para el caso de que el warm-up no llegue a tiempo.
const MAX_RETRIES = Number(import.meta.env.VITE_API_RETRY_COUNT || 2);

const COLD_START_RETRY_ENDPOINTS = [
  '/categories',
  '/forums',
  '/posts',
  '/countries',
  '/travel',
  '/trivia',
  '/feed/explore'
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function logApiError(error, originalRequest) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.error(
    `❌ [API] Error ${error.response?.status || 'NETWORK'}: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`
  );
}

function isRetryableRequest(error, originalRequest) {
  if (!originalRequest) {
    return false;
  }

  if (originalRequest.skipRetry) {
    return false;
  }

  const method = originalRequest.method?.toLowerCase();
  const isRetryableMethod = RETRYABLE_METHODS.has(method);
  const isTimeoutOrNetwork = error.code === 'ECONNABORTED' || !error.response;
  const requestUrl = originalRequest.url || '';
  const isColdStartEndpoint = COLD_START_RETRY_ENDPOINTS.some((endpoint) =>
    requestUrl.startsWith(endpoint)
  );

  return isRetryableMethod && isTimeoutOrNetwork && isColdStartEndpoint;
}

async function retryRequestIfPossible(originalRequest) {
  originalRequest._retryCount = originalRequest._retryCount || 0;

  if (originalRequest._retryCount >= MAX_RETRIES) {
    return null;
  }

  originalRequest._retryCount += 1;
  const backoffMs = 1500 * originalRequest._retryCount;

  if (import.meta.env.DEV) {
    console.warn(
      `⏳ [API] Retry ${originalRequest._retryCount}/${MAX_RETRIES} in ${backoffMs}ms: ${originalRequest.url}`
    );
  }

  await delay(backoffMs);
  return api(originalRequest);
}

function shouldAttemptRefresh(error, originalRequest) {
  const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
  const hasSessionHint = localStorage.getItem("isAuthenticated") === "true";

  return error.response?.status === 401 && hasSessionHint && !originalRequest?._retry && !isAuthEndpoint;
}

function addUserMessage(error) {
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
    // Demo alojada en plan gratuito: el servidor se duerme tras inactividad y el primer
    // arranque puede tardar. No es un fallo de conexión real, solo hay que darle un momento.
    error.userMessage = 'El servidor se está iniciando (puede tardar unos segundos la primera vez). Por favor, inténtalo de nuevo en un momento.';
    return;
  }

  if (!error.response) {
    error.userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    return;
  }

  if (error.response.status === 503) {
    error.userMessage = 'El servidor está arrancando, intenta de nuevo en unos segundos.';
  } else if (error.response.status === 500) {
    error.userMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
  } else if (error.response.status === 403) {
    error.userMessage = 'No tienes permisos para realizar esta acción.';
  }
}

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
  // Render/Neon cold starts can exceed 15s; allow more time on first hit.
  timeout: API_TIMEOUT_MS,
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
    
    // Security: Log requests in development without sensitive data
    if (import.meta.env.DEV) {
      // Don't log auth endpoint data (may contain passwords)
      const isAuthRequest = config.url?.includes('/auth/');
      console.log(`🌐 [API] ${config.method?.toUpperCase()} ${config.url}`,
        isAuthRequest ? '(auth data hidden)' : ''
      );
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
    // Security: Log responses in development without sensitive data
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    logApiError(error, originalRequest);

    // Retry idempotent requests for transient errors (cold start/network hiccups)
    if (isRetryableRequest(error, originalRequest)) {
      const retriedResponse = await retryRequestIfPossible(originalRequest);
      if (retriedResponse) {
        return retriedResponse;
      }
    }

    // Handle 401 with refresh only when client believes there is an active session.
    if (shouldAttemptRefresh(error, originalRequest)) {
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

    addUserMessage(error);

    throw error;
  }
);

export default api;
