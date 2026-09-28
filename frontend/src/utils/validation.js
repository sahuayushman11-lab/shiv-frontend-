/**
 * Client-side input validation helpers
 */

export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function isValidAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && num > 0;
}

export function validateExpenseForm({ amount, categoryId, description, expenseDate }) {
  const errors = {};
  if (!isValidAmount(amount)) {
    errors.amount = 'Please enter a valid amount greater than 0';
  }
  if (!categoryId) {
    errors.categoryId = 'Please select a category';
  }
  if (!description || !description.trim()) {
    errors.description = 'Please enter a description';
  }
  if (!expenseDate) {
    errors.expenseDate = 'Please select a date';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
