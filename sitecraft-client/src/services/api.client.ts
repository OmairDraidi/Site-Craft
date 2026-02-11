import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig
} from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { tokenStorage, refreshTokenStorage } from '../utils/storage';
import type { ApiError, ApiResponse } from '../types/api.types';
import type { AuthResponse } from '../types/auth.types';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Process queued requests after refresh
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request Interceptor - Add token and tenant ID to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add tenant ID header if not already set
    if (config.headers && !config.headers['X-Tenant-Id']) {
      config.headers['X-Tenant-Id'] = API_CONFIG.DEFAULT_TENANT;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = refreshTokenStorage.getRefreshToken();

      // If no refresh token, logout immediately
      if (!refreshToken) {
        tokenStorage.removeToken();
        refreshTokenStorage.removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint (use axios directly to avoid interceptor recursion)
        const baseURL = API_CONFIG.BASE_URL || window.location.origin;
        const response = await axios.post<ApiResponse<AuthResponse>>(
          `${baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Tenant-Id': API_CONFIG.DEFAULT_TENANT,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens
        tokenStorage.setToken(accessToken);
        refreshTokenStorage.setRefreshToken(newRefreshToken);

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as Error, null);
        tokenStorage.removeToken();
        refreshTokenStorage.removeRefreshToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error types
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 403:
          // Forbidden - No permission
          console.error('Access denied');
          break;
        
        case 404:
          console.error('Resource not found');
          break;
        
        case 500:
          console.error('Server error');
          break;
      }

      // Return formatted error
      return Promise.reject({
        message: data?.message || 'An error occurred',
        errors: data?.errors,
        statusCode: status,
      } as ApiError);
    }

    // Network error
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      } as ApiError);
    }

    // Something else happened
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
    } as ApiError);
  }
);

export default apiClient;
