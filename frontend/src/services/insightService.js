import api from './api';

export const insightService = {
  async getInsights() {
    return api.get('/insights');
  }
};
