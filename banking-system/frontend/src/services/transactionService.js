import api from './api';
import { mockStore } from './mockStore';

export const transactionService = {
  deposit: async (data) => {
    try {
      const response = await api.post('/transactions/deposit', data);
      return response;
    } catch (err) {
      console.warn('Backend unavailable, executing deposit in mock mode:', err);
      const res = mockStore.deposit(data);
      return { data: { success: true, message: 'Deposit successful', data: res } };
    }
  },

  withdraw: async (data) => {
    try {
      const response = await api.post('/transactions/withdraw', data);
      return response;
    } catch (err) {
      console.warn('Backend unavailable, executing withdrawal in mock mode:', err);
      const res = mockStore.withdraw(data);
      return { data: { success: true, message: 'Withdrawal successful', data: res } };
    }
  },

  transfer: async (data) => {
    try {
      const response = await api.post('/transactions/transfer', data);
      return response;
    } catch (err) {
      console.warn('Backend unavailable, executing transfer in mock mode:', err);
      const res = mockStore.transfer(data);
      return { data: { success: true, message: 'Transfer successful', data: res } };
    }
  },

  getAllTransactions: async (params) => {
    try {
      const response = await api.get('/transactions', { params });
      return response;
    } catch (err) {
      const list = mockStore.getTransactions(params || {});
      return {
        data: {
          success: true,
          data: {
            content: list,
            totalElements: list.length,
            totalPages: 1,
            number: 0,
            size: list.length,
          }
        }
      };
    }
  },

  getAccountTransactions: async (accountNumber) => {
    try {
      const response = await api.get(`/transactions/${accountNumber}`);
      return response;
    } catch (err) {
      const list = mockStore.getTransactions({ accountNumber });
      return { data: { success: true, data: list } };
    }
  },

  getRecentTransactions: async (limit = 10) => {
    try {
      const response = await api.get(`/transactions/recent/${limit}`);
      return response;
    } catch (err) {
      const list = mockStore.getTransactions({}).slice(0, limit);
      return { data: { success: true, data: list } };
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response;
    } catch (err) {
      const stats = mockStore.getStats();
      return { data: { success: true, data: stats } };
    }
  },

  getRecentDashboardTransactions: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/recent-transactions?limit=${limit}`);
      return response;
    } catch (err) {
      const list = mockStore.getTransactions({}).slice(0, limit);
      return { data: { success: true, data: list } };
    }
  },
};
