import api from './api';
import { mockStore } from './mockStore';

export const accountService = {
  createAccount: async (data) => {
    try {
      const response = await api.post('/accounts', data);
      return response;
    } catch (err) {
      console.warn('Backend unavailable, using mock account creation:', err);
      const acc = mockStore.createAccount(data);
      return { data: { success: true, message: 'Account created', data: acc } };
    }
  },

  getAllAccounts: async (params) => {
    try {
      const response = await api.get('/accounts', { params });
      return response;
    } catch (err) {
      console.warn('Backend unavailable, returning mock accounts:', err);
      const search = params?.search || '';
      const list = mockStore.getAccounts(search);
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

  getAccount: async (accountNumber) => {
    try {
      const response = await api.get(`/accounts/${accountNumber}`);
      return response;
    } catch (err) {
      const acc = mockStore.getAccount(accountNumber);
      if (!acc) throw new Error('Account not found');
      return { data: { success: true, data: acc } };
    }
  },

  updateAccountStatus: async (accountNumber, status) => {
    try {
      const response = await api.put(`/accounts/${accountNumber}`, { status });
      return response;
    } catch (err) {
      const updated = mockStore.updateAccountStatus(accountNumber, status);
      return { data: { success: true, data: updated } };
    }
  },

  deleteAccount: async (accountNumber) => {
    try {
      const response = await api.delete(`/accounts/${accountNumber}`);
      return response;
    } catch (err) {
      mockStore.deleteAccount(accountNumber);
      return { data: { success: true, message: 'Account deleted' } };
    }
  },

  getTotalAccounts: async () => {
    try {
      const response = await api.get('/accounts/count');
      return response;
    } catch (err) {
      const stats = mockStore.getStats();
      return { data: { success: true, data: stats.totalAccounts } };
    }
  },
};
