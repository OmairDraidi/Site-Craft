/**
 * ========================================
 * SiteCraft API Contracts
 * ========================================
 * Complete TypeScript definitions for all API endpoints
 * Base URL: http://localhost:5263
 * API Version: v1
 */

// ============================================
// 🔐 AUTHENTICATION API
// ============================================

/**
 * POST /api/v1/auth/register
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * POST /api/v1/auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/v1/auth/refresh
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Shared Response for Login, Register, and Refresh
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO 8601 date string
  user: UserInfo;
}

export interface UserInfo {
  id: string; // UUID
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string; // UUID
}

export type UserRole = 'Owner' | 'Admin' | 'Member';

/**
 * POST /api/v1/auth/logout
 * Response: Standard ApiResponse (no data)
 */

/**
 * GET /api/v1/auth/me
 * Response contains: ApiResponse<UserInfo>
 */

// ============================================
// 👥 USERS API
// ============================================

/**
 * GET /api/v1/users
 */
export interface GetUsersResponse {
  tenantId: string; // UUID
  count: number;
  users: UserListItem[];
}

export interface UserListItem {
  id: string; // UUID
  tenantId: string; // UUID
  email: string;
  firstName: string;
  lastName: string;
  role: string; // "Owner" | "Admin" | "Member"
  isActive: boolean;
  createdAt: string; // ISO 8601
}

/**
 * POST /api/v1/users/seed-demo-user
 */
export interface SeedDemoUserResponse {
  message: string;
  userId: string; // UUID
  email: string;
  tenantId: string; // UUID
}

// ============================================
// 🏢 TENANTS API
// ============================================

/**
 * GET /api/v1/tenants/current
 */
export interface TenantInfo {
  id: string; // UUID
  name: string;
  subdomain: string;
  customDomain: string | null;
  status: TenantStatus;
  createdAt: string; // ISO 8601
}

export type TenantStatus = 'Active' | 'Suspended' | 'Inactive';

/**
 * GET /api/v1/tenants
 */
export interface GetAllTenantsResponse {
  count: number;
  tenants: TenantListItem[];
}

export interface TenantListItem {
  id: string; // UUID
  name: string;
  subdomain: string;
  status: string; // "Active" | "Suspended" | "Inactive"
  createdAt: string; // ISO 8601
}

/**
 * POST /api/v1/tenants/seed-demo
 * POST /api/v1/tenants/seed-second
 */
export interface SeedTenantResponse {
  message: string;
  tenantId: string; // UUID
  subdomain: string;
  instructions?: string;
}

// ============================================
// 📦 STANDARD API RESPONSE WRAPPERS
// ============================================

/**
 * Standard success response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Standard error response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

/**
 * Generic API Response type (success or error)
 */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// ============================================
// 🔧 REQUEST HEADERS
// ============================================

/**
 * Required/Optional headers for API requests
 */
export interface ApiHeaders {
  'Content-Type'?: 'application/json';
  'X-Tenant-Id'?: string; // Required for most endpoints
  'Authorization'?: string; // Format: "Bearer {token}"
}

// ============================================
// 📝 TYPE GUARDS
// ============================================

/**
 * Type guard to check if response is success
 */
export function isApiSuccess<T>(
  response: ApiResult<T>
): response is ApiResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is error
 */
export function isApiError(
  response: ApiResult<unknown>
): response is ApiErrorResponse {
  return response.success === false;
}

// ============================================
// 🎯 USAGE EXAMPLES
// ============================================

/**
 * Example 1: Login Request
 * 
 * const loginData: LoginRequest = {
 *   email: 'admin@sitecraft.com',
 *   password: 'SecurePass123!'
 * };
 * 
 * const response = await axios.post<ApiResponse<AuthResponse>>(
 *   '/api/v1/auth/login',
 *   loginData,
 *   { headers: { 'X-Tenant-Id': 'default' } }
 * );
 * 
 * if (isApiSuccess(response.data)) {
 *   localStorage.setItem('token', response.data.data.accessToken);
 * }
 */

/**
 * Example 2: Get Users
 * 
 * const response = await axios.get<GetUsersResponse>(
 *   '/api/v1/users',
 *   { headers: { 'X-Tenant-Id': 'default' } }
 * );
 * 
 * console.log(`Found ${response.data.count} users`);
 */

/**
 * Example 3: Error Handling
 * 
 * try {
 *   const response = await axios.post('/api/v1/auth/login', data);
 * } catch (error) {
 *   if (axios.isAxiosError(error)) {
 *     const apiError = error.response?.data as ApiErrorResponse;
 *     console.error(apiError.message);
 *   }
 * }
 */

// ============================================
// 🚀 ENDPOINT CONSTANTS
// ============================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_ME: '/api/v1/auth/me',

  // Users
  USERS_LIST: '/api/v1/users',
  USERS_SEED_DEMO: '/api/v1/users/seed-demo-user',

  // Tenants
  TENANTS_CURRENT: '/api/v1/tenants/current',
  TENANTS_LIST: '/api/v1/tenants',
  TENANTS_SEED_DEMO: '/api/v1/tenants/seed-demo',
  TENANTS_SEED_SECOND: '/api/v1/tenants/seed-second',
} as const;

// ============================================
// 🌐 HTTP STATUS CODES
// ============================================

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// ============================================
// ⚙️ API CONFIGURATION
// ============================================

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5263',
  VERSION: 'v1',
  TIMEOUT: 30000,
  DEFAULT_TENANT: 'default',
} as const;

/**
 * ========================================
 * 📌 NOTES FOR DEVELOPERS
 * ========================================
 * 
 * 1. TENANT HEADER:
 *    Most endpoints require X-Tenant-Id header.
 *    Default tenant: "default"
 *    Other available: "demo", "companyb"
 * 
 * 2. AUTHENTICATION:
 *    Protected endpoints require:
 *    Authorization: Bearer {your_jwt_token}
 * 
 * 3. TOKEN EXPIRY:
 *    Access tokens expire in 60 minutes.
 *    Use refresh token endpoint before expiry.
 * 
 * 4. ERROR HANDLING:
 *    Always check response.success before accessing data.
 *    Use type guards (isApiSuccess/isApiError) for safety.
 * 
 * 5. UUID FORMAT:
 *    All IDs are UUIDs (e.g., "3fa85f64-5717-4562-b3fc-2c963f66afa6")
 * 
 * 6. DATES:
 *    All dates are in ISO 8601 format (e.g., "2026-02-10T12:00:00Z")
 */
