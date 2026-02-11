/**
 * ========================================
 * SiteCraft API Contracts
 * ========================================
 * Complete TypeScript definitions for all API endpoints
 * Base URL: http://localhost:5263
 * API Version: v1
 */

// Re-export core types from their source files
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User as UserInfo,
} from './auth.types';

export type { ApiResponse, ApiError } from './api.types';

export { API_ENDPOINTS, API_CONFIG } from '../config/api.config';

// ============================================
// 🔐 AUTHENTICATION API
// ============================================

/**
 * POST /api/v1/auth/register - Register new user
 * POST /api/v1/auth/login - Login user
 * POST /api/v1/auth/refresh - Refresh access token
 * POST /api/v1/auth/logout - Logout user (revokes refresh tokens)
 * GET /api/v1/auth/me - Get current authenticated user
 * POST /api/v1/auth/forgot-password - Request password reset
 * POST /api/v1/auth/reset-password - Reset password with token
 */

/**
 * POST /api/v1/auth/refresh
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * POST /api/v1/auth/forgot-password
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * POST /api/v1/auth/reset-password
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export type UserRole = 'Owner' | 'Admin' | 'Member';

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

// ============================================
// 📦 TYPE GUARDS
// ============================================

/**
 * Type guard to check if response is success
 */
export function isApiSuccess<T>(
  response: any
): response is import('./api.types').ApiResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is error
 */
export function isApiError(
  response: any
): response is import('./api.types').ApiError {
  return response.success === false || !!response.statusCode;
}

// ============================================
// 🎯 USAGE EXAMPLES  
// ============================================

/**
 * See auth.service.ts and api.client.ts for real implementations.
 * All endpoints now use centralized API_ENDPOINTS from config/api.config.ts
 */

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
 *    Refresh tokens are automatically rotated on use.
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
