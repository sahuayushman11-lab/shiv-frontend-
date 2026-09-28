import React from 'react';
import { Edit2, Trash2, PlusCircle, CheckCircle, Target, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

export function SavingsCard({
  goal,
  currencyCode = 'INR',
  onDeposit,
  onEdit,
  onDelete
}) {
  const target = Number(goal.target_amount);
  const current = Number(goal.current_amount);
  const progress = Math.min(100, Math.round(goal.progress || 0));
  const isAchieved = current >= target;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              {isAchieved ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                {goal.name}
              </h4>
              {goal.deadline && (
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>Target: {formatDate(goal.deadline)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              aria-label={`Edit ${goal.name}`}
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(goal)}
              aria-label={`Delete ${goal.name}`}
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Display */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(current, currencyCode)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              of {formatCurrency(target, currencyCode)} ({progress}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${isAchieved ? 'bg-emerald-500' : 'bg-indigo-600'} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {isAchieved ? '🎉 Goal Completed!' : `Remaining: ${formatCurrency(Math.max(0, target - current), currencyCode)}`}
        </span>
        <button
          onClick={() => onDeposit(goal)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Deposit
        </button>
      </div>
    </div>
  );
}

export default SavingsCard;
