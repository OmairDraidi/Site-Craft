import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosResponse 
} from 'axios';
import { API_CONFIG } from '../config/api.config';
import { tokenStorage } from '../utils/storage';
import type { ApiError } from '../types/api.types';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          tokenStorage.removeToken();
          window.location.href = '/login';
          break;
        
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
