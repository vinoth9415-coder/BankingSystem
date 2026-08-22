import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bankingToken');
    const userData = localStorage.getItem('bankingUser');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    if (response.success) {
      const { token, ...userData } = response.data;
      localStorage.setItem('bankingToken', token);
      localStorage.setItem('bankingUser', JSON.stringify(userData));
      localStorage.setItem('role', userData.role);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, role: userData.role };
    }
    return { success: false, message: response.message };
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('role');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
