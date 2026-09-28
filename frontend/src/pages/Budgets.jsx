import React, { useState, useEffect } from 'react';
import { PlusCircle, PiggyBank, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import { expenseService } from '../services/expenseService';
import BudgetCard from '../components/BudgetCard';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCurrencySymbol } from '../utils/currency';
import { formatISODate } from '../utils/date';

export function Budgets() {
  const { user } = useAuth();
  const currencyCode = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Budget form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'monthly',
    categoryId: '',
    startDate: '',
    endDate: ''
  });
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [budgetRes, catRes] = await Promise.all([
        budgetService.getBudgets(),
        expenseService.getCategories()
      ]);
      setBudgets(budgetRes.data?.budgets || []);
      setCategories(catRes.data?.categories || []);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setFormData({
      name: '',
      amount: '',
      period: 'monthly',
      categoryId: '',
      startDate: formatISODate(start),
      endDate: formatISODate(end)
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      amount: budget.amount,
      period: budget.period,
      categoryId: budget.category_id || '',
      startDate: budget.start_date || '',
      endDate: budget.end_date || ''
    });
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Budget name is required');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError('Please enter a valid budget amount');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, {
          name: formData.name.trim(),
          amount: Number(formData.amount),
          period: formData.period,
          categoryId: formData.categoryId || null
        });
        setEditingBudget(null);
      } else {
        await budgetService.createBudget({
          name: formData.name.trim(),
          amount: Number(formData.amount),
          period: formData.period,
          categoryId: formData.categoryId || null,
          startDate: formData.startDate,
          endDate: formData.endDate
        });
        setIsAddModalOpen(false);
      }
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to save budget.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBudget) return;
    setIsSubmitting(true);
    try {
      await budgetService.deleteBudget(deletingBudget.id);
      setDeletingBudget(null);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budget Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set spending caps for the month or specific categories to prevent overspending.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" className="text-indigo-600" />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No budgets created yet"
          description="Setting a budget helps you keep track of your spending habits and save for the things you love."
          actionText="Create Your First Budget"
          onAction={openAddModal}
          icon={PiggyBank}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currencyCode={currencyCode}
              onEdit={openEditModal}
              onDelete={(b) => setDeletingBudget(b)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Budget Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingBudget}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Budget Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Fun & Snacks"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Budget Amount ({currencySymbol}) *
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              placeholder="1000.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories (General)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingBudget(null);
              }}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md disabled:opacity-50"
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
              <span>{editingBudget ? 'Update Budget' : 'Save Budget'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget "${deletingBudget?.name}"?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default Budgets;
