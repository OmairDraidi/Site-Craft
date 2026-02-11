import type { User } from '../types/auth.types';

// Local Storage Utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

// Token Management
export const tokenStorage = {
  getToken: (): string | null => storage.get<string>('sitecraft_token'),
  setToken: (token: string): void => storage.set('sitecraft_token', token),
  removeToken: (): void => storage.remove('sitecraft_token'),
};

// User Management
export const userStorage = {
  getUser: () => storage.get<User>('sitecraft_user'),
  setUser: (user: User): void => storage.set('sitecraft_user', user),
  removeUser: (): void => storage.remove('sitecraft_user'),
};

// Refresh Token Management
export const refreshTokenStorage = {
  getRefreshToken: (): string | null => storage.get<string>('sitecraft_refresh_token'),
  setRefreshToken: (token: string): void => storage.set('sitecraft_refresh_token', token),
  removeRefreshToken: (): void => storage.remove('sitecraft_refresh_token'),
};
