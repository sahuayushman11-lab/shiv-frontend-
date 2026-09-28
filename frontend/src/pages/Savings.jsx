import React, { useState, useEffect } from 'react';
import { PlusCircle, Target, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { savingsService } from '../services/savingsService';
import SavingsCard from '../components/SavingsCard';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

export function Savings() {
  const { user } = useAuth();
  const currencyCode = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [depositGoal, setDepositGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: ''
  });
  const [formError, setFormError] = useState('');

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const res = await savingsService.getSavingsGoals();
      setGoals(res.data?.goals || []);
    } catch (err) {
      console.error('Failed to load savings goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: ''
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      deadline: goal.deadline || ''
    });
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Goal name is required');
      return;
    }
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      setFormError('Please enter a target amount greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingGoal) {
        await savingsService.updateSavingsGoal(editingGoal.id, {
          name: formData.name.trim(),
          targetAmount: Number(formData.targetAmount),
          currentAmount: Number(formData.currentAmount || 0),
          deadline: formData.deadline || null
        });
        setEditingGoal(null);
      } else {
        await savingsService.createSavingsGoal({
          name: formData.name.trim(),
          targetAmount: Number(formData.targetAmount),
          currentAmount: Number(formData.currentAmount || 0),
          deadline: formData.deadline || null
        });
        setIsAddModalOpen(false);
      }
      await loadGoals();
    } catch (err) {
      setFormError(err.message || 'Failed to save savings goal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositGoal || !depositAmount || Number(depositAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      await savingsService.depositToGoal(depositGoal.id, Number(depositAmount));
      setDepositGoal(null);
      setDepositAmount('');
      await loadGoals();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingGoal) return;
    setIsSubmitting(true);
    try {
      await savingsService.deleteSavingsGoal(deletingGoal.id);
      setDeletingGoal(null);
      await loadGoals();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalTarget = goals.reduce((acc, g) => acc + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((acc, g) => acc + Number(g.current_amount), 0);
  const completedGoals = goals.filter((g) => Number(g.current_amount) >= Number(g.target_amount)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Savings Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Save up for gadgets, books, gifts, and hobbies with gamified target progress!
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Top Goals Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Saved</span>
            <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(totalSaved, currencyCode)}
            </h4>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Target</span>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalTarget, currencyCode)}
            </h4>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Milestones</span>
              <h4 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {completedGoals} of {goals.length} Achieved
              </h4>
            </div>
            <Trophy className="w-7 h-7 text-amber-500" />
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" className="text-indigo-600" />
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          title="No savings goals yet"
          description="What are you excited to buy or save for? Headphones? A new bicycle? A gaming console? Create your goal now!"
          actionText="Create A Goal"
          onAction={openAddModal}
          icon={Target}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => (
            <SavingsCard
              key={goal.id}
              goal={goal}
              currencyCode={currencyCode}
              onDeposit={(g) => {
                setDepositGoal(g);
                setDepositAmount('');
              }}
              onEdit={openEditModal}
              onDelete={(g) => setDeletingGoal(g)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingGoal}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Headphones, Skate board"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Target Amount ({currencySymbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="3000.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Starting Amount ({currencySymbol})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Target Deadline (Optional)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingGoal(null);
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
              <span>{editingGoal ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        title={`Deposit into "${depositGoal?.name}"`}
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add saved allowance money toward this goal!
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Deposit Amount ({currencySymbol}) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              autoFocus
              placeholder="e.g. 500"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setDepositGoal(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !depositAmount}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md disabled:opacity-50"
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
              <span>Add Deposit</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete "${deletingGoal?.name}"?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default Savings;
