import api from './api';

export const analyticsService = {
  async getSummary() {
    return api.get('/analytics/summary');
  },

  async getCategoryAnalytics(startDate, endDate) {
    return api.get('/analytics/category', {
      params: { start_date: startDate, end_date: endDate }
    });
  },

  async getTimelineAnalytics(period = 'daily') {
    return api.get('/analytics/timeline', {
      params: { period }
    });
  },

  async getBudgetAnalytics() {
    return api.get('/analytics/budget');
  },

  async getSavingsAnalytics() {
    return api.get('/analytics/savings');
  }
};
