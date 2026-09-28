import api from './api';

export const budgetService = {
  async getBudgets() {
    return api.get('/budgets');
  },

  async getBudgetById(id) {
    return api.get(`/budgets/${id}`);
  },

  async createBudget(budgetData) {
    return api.post('/budgets', budgetData);
  },

  async updateBudget(id, updates) {
    return api.put(`/budgets/${id}`, updates);
  },

  async deleteBudget(id) {
    return api.delete(`/budgets/${id}`);
  }
};
