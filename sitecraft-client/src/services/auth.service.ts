import apiClient from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import { tokenStorage, userStorage } from '../utils/storage';
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
    localStorage.setItem('sitecraft_refresh_token', refreshToken);
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
    localStorage.setItem('sitecraft_refresh_token', refreshToken);
    userStorage.setUser(user);

    return response.data.data;
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear storage
    tokenStorage.removeToken();
    userStorage.removeUser();

    // Optionally call backend logout endpoint
    // apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {});
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
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Refresh authentication (validate token with backend)
   */
  async refreshAuth(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.ME);
    const user = response.data;
    
    // Update stored user
    userStorage.setUser(user);
    
    return user;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
