import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

export function ExpenseTable({
  expenses = [],
  currencyCode = 'INR',
  onEdit,
  onDelete
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider">
            <th scope="col" className="py-3.5 px-4 sm:px-6">Date</th>
            <th scope="col" className="py-3.5 px-4">Description</th>
            <th scope="col" className="py-3.5 px-4">Category</th>
            <th scope="col" className="py-3.5 px-4">Payment Method</th>
            <th scope="col" className="py-3.5 px-4 text-right">Amount</th>
            <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {expenses.map((expense) => {
            const categoryName = expense.categories?.name || 'Uncategorized';
            const categoryColor = expense.categories?.color || '#6366f1';

            return (
              <tr
                key={expense.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                  {formatDate(expense.expense_date)}
                </td>
                <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                  <div>{expense.description}</div>
                  {expense.notes && (
                    <div className="text-xs text-slate-400 font-normal italic mt-0.5 line-clamp-1">
                      {expense.notes}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {categoryName}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    {expense.payment_method}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-right font-bold text-slate-900 dark:text-white text-base">
                  {formatCurrency(expense.amount, currencyCode)}
                </td>
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(expense)}
                      aria-label={`Edit ${expense.description}`}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      aria-label={`Delete ${expense.description}`}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
