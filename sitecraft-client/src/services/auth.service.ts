import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import { tokenStorage, userStorage, refreshTokenStorage } from '../utils/storage';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../types/auth.types';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const { accessToken, refreshToken, user } = response.data.data;

    // Store tokens and user
    tokenStorage.setToken(accessToken);
    refreshTokenStorage.setRefreshToken(refreshToken);
    userStorage.setUser(user);

    return response.data.data;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    const { accessToken, refreshToken, user } = response.data.data;

    // Store tokens and user
    tokenStorage.setToken(accessToken);
    refreshTokenStorage.setRefreshToken(refreshToken);
    userStorage.setUser(user);

    return response.data.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint to revoke refresh tokens
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear all storage
      tokenStorage.removeToken();
      refreshTokenStorage.removeRefreshToken();
      userStorage.removeUser();
    }
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    return userStorage.getUser();
  }

  /**
   * Get current token from storage
   */
  getToken(): string | null {
    return tokenStorage.getToken();
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return refreshTokenStorage.getRefreshToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;

    // Update tokens and user
    tokenStorage.setToken(accessToken);
    refreshTokenStorage.setRefreshToken(newRefreshToken);
    userStorage.setUser(user);

    return response.data.data;
  }

  /**
   * Refresh authentication (validate token with backend)
   */
  async refreshAuth(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>(API_ENDPOINTS.USERS.ME);
    const user = response.data.data;
    
    // Update stored user
    userStorage.setUser(user);
    
    return user;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    // Note: Always returns success to prevent email enumeration
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, newPassword, confirmPassword }
    );
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
