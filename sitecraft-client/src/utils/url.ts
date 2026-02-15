import { API_CONFIG } from '../config/api.config';

/**
 * Resolves a potentially relative image URL to a full URL
 * or handles it for proxy usage.
 */
export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return '';
  
  // Return as-is if it's already a full URL, blob URL, or data URI
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  // In development, if BASE_URL is empty (proxy mode), return as is
  // The Vite proxy will handle the /uploads path
  if (!API_CONFIG.BASE_URL && (url.startsWith('/api') || url.startsWith('/uploads'))) {
    return url;
  }

  // Fallback: prefix with BASE_URL if absolute path provided
  const baseUrl = API_CONFIG.BASE_URL || '';
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${normalizedUrl}`;
};
