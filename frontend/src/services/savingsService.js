import api from './api';

export const savingsService = {
  async getSavingsGoals() {
    return api.get('/savings');
  },

  async getSavingsGoalById(id) {
    return api.get(`/savings/${id}`);
  },

  async createSavingsGoal(goalData) {
    return api.post('/savings', goalData);
  },

  async updateSavingsGoal(id, updates) {
    return api.put(`/savings/${id}`, updates);
  },

  async depositToGoal(id, amount) {
    return api.post(`/savings/${id}/deposit`, { amount });
  },

  async deleteSavingsGoal(id) {
    return api.delete(`/savings/${id}`);
  }
};
