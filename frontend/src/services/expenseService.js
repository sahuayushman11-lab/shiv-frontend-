import api from './api';

export const expenseService = {
  async getExpenses(params = {}) {
    return api.get('/expenses', { params });
  },

  async getExpenseById(id) {
    return api.get(`/expenses/${id}`);
  },

  async createExpense(expenseData) {
    return api.post('/expenses', expenseData);
  },

  async updateExpense(id, updates) {
    return api.put(`/expenses/${id}`, updates);
  },

  async deleteExpense(id) {
    return api.delete(`/expenses/${id}`);
  },

  async getCategories() {
    return api.get('/categories');
  }
};
