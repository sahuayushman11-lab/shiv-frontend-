import api from './api';

export const authService = {
  async register(userData) {
    return api.post('/auth/register', userData);
  },

  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  async updateProfile(updates) {
    return api.put('/auth/profile', updates);
  }
};
