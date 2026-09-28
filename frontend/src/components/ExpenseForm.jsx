import React, { useState, useEffect } from 'react';
import { formatISODate } from '../utils/date';
import { validateExpenseForm } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Bank Transfer', 'Other'];

export function ExpenseForm({
  initialData = null,
  categories = [],
  currencySymbol = '₹',
  onSubmit,
  onCancel,
  isLoading = false
}) {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    description: '',
    expenseDate: formatISODate(new Date()),
    paymentMethod: 'Cash',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        categoryId: initialData.category_id || initialData.categoryId || (categories[0]?.id || ''),
        description: initialData.description || '',
        expenseDate: initialData.expense_date || initialData.expenseDate || formatISODate(new Date()),
        paymentMethod: initialData.payment_method || initialData.paymentMethod || 'Cash',
        notes: initialData.notes || ''
      });
    } else if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateExpenseForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onSubmit({
        amount: Number(formData.amount),
        categoryId: formData.categoryId,
        description: formData.description.trim(),
        expenseDate: formData.expenseDate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim()
      });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save expense.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm">
          {errors.form}
        </div>
      )}

      {/* Amount Input */}
      <div>
        <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
          Amount ({currencySymbol}) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
            {currencySymbol}
          </div>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${errors.amount ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-base font-semibold`}
            required
          />
        </div>
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>

      {/* Category Dropdown */}
      <div>
        <label htmlFor="categoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${errors.categoryId ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm`}
          required
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
          Description *
        </label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="e.g. Lunch at canteen, Metro recharge"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm`}
          required
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      {/* Date & Payment Method Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="expenseDate" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
            Date *
          </label>
          <input
            id="expenseDate"
            name="expenseDate"
            type="date"
            value={formData.expenseDate}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${errors.expenseDate ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm`}
            required
          />
          {errors.expenseDate && <p className="mt-1 text-xs text-red-500">{errors.expenseDate}</p>}
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm"
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="2"
          placeholder="Extra details, location, or split info..."
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50"
        >
          {isLoading && <LoadingSpinner size="sm" />}
          {initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
