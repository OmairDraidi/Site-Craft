import { 
  createContext, 
  useState, 
  useEffect, 
  useCallback,
  ReactNode 
} from 'react';
import { authService } from '../services/auth.service';
import type { 
  AuthContextType, 
  User, 
  LoginRequest, 
  RegisterRequest 
} from '../types/auth.types';

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getCurrentUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Optionally validate token with backend
          // await refreshAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth state
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      // Re-throw to handle in component
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      setToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  // Refresh Auth (validate token)
  const refreshAuth = useCallback(async () => {
    try {
      const updatedUser = await authService.refreshAuth();
      setUser(updatedUser);
    } catch (error) {
      // Token invalid, logout
      logout();
      throw error;
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
