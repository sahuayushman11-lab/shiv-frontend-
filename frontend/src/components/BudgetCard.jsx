import React from 'react';
import { Edit2, Trash2, PieChart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export function BudgetCard({
  budget,
  currencyCode = 'INR',
  onEdit,
  onDelete
}) {
  const amount = Number(budget.amount);
  const spent = Number(budget.spent || 0);
  const remaining = Number(budget.remaining || 0);
  const utilization = Math.min(100, Math.round(budget.utilization || 0));
  const isExceeded = spent > amount;

  let progressColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
  let statusText = 'On Track';

  if (isExceeded) {
    progressColor = 'bg-red-500';
    badgeColor = 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300';
    statusText = 'Exceeded';
  } else if (utilization >= 80) {
    progressColor = 'bg-amber-500';
    badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
    statusText = 'Near Limit';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">
              {budget.name}
            </h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
              {statusText}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
            {budget.period} budget
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            aria-label={`Edit ${budget.name}`}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget)}
            aria-label={`Delete ${budget.name}`}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-600 dark:text-slate-400">
            {utilization}% used
          </span>
          <span className="text-slate-900 dark:text-white font-bold">
            {formatCurrency(spent, currencyCode)} of {formatCurrency(amount, currencyCode)}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} rounded-full transition-all duration-500`}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Remaining
        </span>
        <span className={`font-bold ${isExceeded ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
          {formatCurrency(remaining, currencyCode)}
        </span>
      </div>
    </div>
  );
}

export default BudgetCard;
