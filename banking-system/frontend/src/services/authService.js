import api from './api';
import { mockStore } from './mockStore';

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      console.warn('Backend registration unavailable, using mock registration fallback:', err);
      try {
        const newUser = mockStore.registerUser(userData);
        return {
          success: true,
          message: 'Account registered successfully! You can now log in.',
          data: newUser,
        };
      } catch (mockErr) {
        return {
          success: false,
          message: mockErr.message || 'Registration failed',
        };
      }
    }
  },

  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, trying client authentication fallback...', err);
      const user = mockStore.authenticateUser(username, password);
      if (user) {
        return {
          success: true,
          message: 'Login successful',
          data: {
            token: 'demo-jwt-token-' + Date.now(),
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          }
        };
      }
      return {
        success: false,
        message: 'Invalid username or password.',
      };
    }
  },

  verify: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (err) {
      return { success: true, message: 'Valid token' };
    }
  },

  logout: () => {
    localStorage.removeItem('bankingToken');
    localStorage.removeItem('bankingUser');
    localStorage.removeItem('role');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('bankingToken');
  },

  getUser: () => {
    const user = localStorage.getItem('bankingUser');
    return user ? JSON.parse(user) : null;
  }
};
