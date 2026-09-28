import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';

export function useExpenses(initialFilters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await expenseService.getCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  const fetchExpenses = useCallback(async (currentFilters = filters, currentPage = page) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await expenseService.getExpenses({
        ...currentFilters,
        page: currentPage,
        limit: 15
      });
      setExpenses(res.data.expenses || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Unable to load expenses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchExpenses(filters, page);
  }, [fetchExpenses, filters, page]);

  const addExpense = async (data) => {
    const res = await expenseService.createExpense(data);
    await fetchExpenses(filters, 1);
    setPage(1);
    return res.data.expense;
  };

  const updateExpense = async (id, data) => {
    const res = await expenseService.updateExpense(id, data);
    await fetchExpenses(filters, page);
    return res.data.expense;
  };

  const deleteExpense = async (id) => {
    await expenseService.deleteExpense(id);
    await fetchExpenses(filters, page);
  };

  return {
    expenses,
    categories,
    total,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
    isLoading,
    error,
    refreshExpenses: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
}

export default useExpenses;
