/**
 * ========================================
 * SiteCraft API Configuration
 * ========================================
 * For full API documentation see: /API_DOCUMENTATION.md
 * For TypeScript contracts see: /src/types/api-contracts.types.ts
 */

// API Configuration
export const API_CONFIG = {
  // Use empty string in dev to leverage Vite proxy, full URL in production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'http://localhost:5263'),
  TIMEOUT: 30000,
  TOKEN_KEY: 'sitecraft_token',
  USER_KEY: 'sitecraft_user',
  REFRESH_TOKEN_KEY: 'sitecraft_refresh_token',
  DEFAULT_TENANT: 'default',
} as const;

/**
 * All API Endpoints
 * Organized by domain for easy maintenance
 */
export const API_ENDPOINTS = {
  // 🔐 Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  
  // 👥 Users
  USERS: {
    LIST: '/api/v1/users',
    ME: '/api/v1/auth/me',
    PROFILE: '/api/v1/users/profile',
    SEED_DEMO: '/api/v1/users/seed-demo-user',
  },
  
  // 🏢 Tenants
  TENANTS: {
    CURRENT: '/api/v1/tenants/current',
    LIST: '/api/v1/tenants',
    SEED_DEMO: '/api/v1/tenants/seed-demo',
    SEED_SECOND: '/api/v1/tenants/seed-second',
  },
  
  // 📄 Templates
  TEMPLATES: {
    LIST: '/api/v1/templates',
    BY_ID: (id: string) => `/api/v1/templates/${id}`,
    APPLY: (id: string) => `/api/v1/templates/${id}/apply`,
    FAVORITE: (id: string) => `/api/v1/templates/${id}/favorite`,
    FAVORITES: '/api/v1/templates/favorites',
  },
  
  // 📁 Projects
  PROJECTS: {
    LIST: '/api/v1/projects',
    BY_ID: (id: string) => `/api/v1/projects/${id}`,
    APPLY_TEMPLATE: (id: string, templateId: string) => `/api/v1/projects/${id}/apply-template/${templateId}`,
    STATUS: (id: string) => `/api/v1/projects/${id}/status`,
    PAGES: (id: string) => `/api/v1/projects/${id}/pages`,
  },
  
  // 📄 Pages
  PAGES: {
    LIST: '/api/v1/pages',
    BY_ID: (id: string) => `/api/v1/pages/${id}`,
    PUBLISH: (id: string) => `/api/v1/pages/${id}/publish`,
    UNPUBLISH: (id: string) => `/api/v1/pages/${id}/unpublish`,
  },

  // � Menus
  MENUS: {
    LIST: '/api/v1/menus',
    BY_ID: (id: string) => `/api/v1/menus/${id}`,
    CREATE_ITEM: (id: string) => `/api/v1/menus/${id}/items`,
    UPDATE_ITEM: (id: string) => `/api/v1/menus/items/${id}`,
    DELETE_ITEM: (id: string) => `/api/v1/menus/items/${id}`,
    REORDER: (id: string) => `/api/v1/menus/${id}/reorder`,
  },

  // �🌐 Sites
  SITES: {
    BY_ID: (id: string) => `/api/v1/sites/${id}`,
    UPLOAD: (id: string, type: 'logo' | 'favicon') => `/api/v1/sites/${id}/upload?type=${type}`,
  },
  
  // 🏥 Health
  HEALTH: '/api/health',
} as const;

/**
 * Available Tenant IDs for Multi-Tenancy
 */
export const TENANT_IDS = {
  DEFAULT: 'default',
  DEMO: 'demo',
  COMPANY_B: 'companyb',
} as const;

/**
 * Common HTTP Headers
 */
export const API_HEADERS = {
  TENANT_ID: 'X-Tenant-Id',
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
} as const;
