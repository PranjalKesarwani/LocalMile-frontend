import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "../Url";

// Token storage keys
const TOKEN_KEY = "admin_token";
const REFRESH_TOKEN_KEY = "localmile_refresh_token";
const USER_INFO_KEY = "admin_info";

/**
 * Token Management Utilities
 */
export const tokenStorage = {
  /**
   * Get stored access token
   */
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Store access token
   */
  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Store refresh token
   */
  setRefreshToken: (refreshToken: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  /**
   * Store both tokens
   */
  setTokens: (token: string, refreshToken?: string): void => {
    tokenStorage.setToken(token);
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken);
    }
  },

  /**
   * Remove all tokens
   */
  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  },

  /**
   * Check if token exists
   */
  hasToken: (): boolean => {
    return tokenStorage.getToken() !== null;
  },

  /**
   * Store user info
   */
  setUserInfo: (userInfo: any): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  },

  /**
   * Get user info
   */
  getUserInfo: (): any | null => {
    if (typeof window === "undefined") return null;
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  /**
   * Clear user info
   */
  clearUserInfo: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_INFO_KEY);
  },

  /**
   * Clear all auth data
   */
  clearAll: (): void => {
    tokenStorage.clearTokens();
    tokenStorage.clearUserInfo();
  },
};

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attach token to request headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();

    // Attach token to Authorization header if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle token refresh, error handling, and response transformation
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    // Check if response contains token and store it
    if (response.data?.token) {
      tokenStorage.setToken(response.data.token);
    }

    // Check if response contains refresh token
    if (response.data?.refreshToken) {
      tokenStorage.setRefreshToken(response.data.refreshToken);
    }

    // Store user info if present
    if (response.data?.user || response.data?.userInfo) {
      tokenStorage.setUserInfo(response.data.user || response.data.userInfo);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = tokenStorage.getRefreshToken();

      // Try to refresh token if refresh token exists
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          if (response.data?.token) {
            tokenStorage.setToken(response.data.token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          tokenStorage.clearAll();

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/admin-auth";
          }

          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear all and redirect
        tokenStorage.clearAll();

        if (typeof window !== "undefined") {
          window.location.href = "/admin-auth";
        }
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      console.error("[API Error Response]", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("[API Error Request]", error.request);
    } else {
      // Error setting up request
      console.error("[API Error]", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API Client Methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  /**
   * POST request
   */
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  /**
   * PUT request
   */
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },

  /**
   * Get the underlying axios instance for custom requests
   */
  getInstance: (): AxiosInstance => {
    return apiClient;
  },
};

/**
 * Export the axios instance directly as well
 */
export default apiClient;

/**
 * Helper function to handle login and store tokens
 */
export const handleLogin = (response: AxiosResponse): void => {
  const { adminToken, adminInfo } = response.data;

  if (adminToken) {
    tokenStorage.setTokens(adminToken);
  }

  if (adminInfo) {
    tokenStorage.setUserInfo(adminInfo);
  }
};

/**
 * Helper function to handle logout
 */
export const handleLogout = (): void => {
  tokenStorage.clearAll();

  if (typeof window !== "undefined") {
    window.location.href = "/admin-auth";
  }
};
