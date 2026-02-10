import type { ApiError } from '../types/api.types';

/**
 * Format API error for display
 */
export const formatApiError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    
    if (apiError.message) {
      return apiError.message;
    }

    if (apiError.errors) {
      const errorMessages = Object.entries(apiError.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');
      return errorMessages;
    }
  }

  return 'An unexpected error occurred';
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    return apiError.statusCode === 0;
  }
  return false;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    return apiError.statusCode === 401;
  }
  return false;
};
