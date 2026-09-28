import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

export function ExpenseCard({
  expense,
  currencyCode = 'INR',
  onEdit,
  onDelete
}) {
  const categoryName = expense.categories?.name || 'Uncategorized';
  const categoryColor = expense.categories?.color || '#6366f1';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
              {expense.description}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <CreditCard className="w-3 h-3" />
                {expense.payment_method}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(expense.amount, currencyCode)}
          </span>
          <div className="flex items-center justify-end gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(expense.expense_date)}</span>
          </div>
        </div>
      </div>

      {expense.notes && (
        <p className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
          "{expense.notes}"
        </p>
      )}

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(expense)}
          aria-label={`Edit ${expense.description}`}
          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(expense)}
          aria-label={`Delete ${expense.description}`}
          className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;
