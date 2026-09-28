import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InsightCard({ insight }) {
  const isWarning = insight.severity === 'warning';
  const isSuccess = insight.severity === 'success';

  const severityStyles = isWarning
    ? {
        border: 'border-amber-200 dark:border-amber-900/40',
        bg: 'bg-amber-50/60 dark:bg-amber-950/20',
        iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400',
        tagBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        tagText: 'Review Alert'
      }
    : isSuccess
    ? {
        border: 'border-emerald-200 dark:border-emerald-900/40',
        bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
        iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400',
        tagBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        tagText: 'Great Habit'
      }
    : {
        border: 'border-indigo-100 dark:border-indigo-900/40',
        bg: 'bg-indigo-50/40 dark:bg-indigo-950/20',
        iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-400',
        tagBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        tagText: '💡 Smart Insight'
      };

  const Icon = isWarning ? AlertTriangle : isSuccess ? CheckCircle : Lightbulb;

  return (
    <div className={`p-5 rounded-2xl border ${severityStyles.border} ${severityStyles.bg} transition-all hover:shadow-sm`}>
      <div className="flex items-start gap-3.5">
        <div className={`p-2.5 rounded-xl ${severityStyles.iconBg} flex-shrink-0 mt-0.5`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${severityStyles.tagBg}`}>
              {severityStyles.tagText}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {insight.title}
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {insight.message}
          </p>

          {insight.actionText && insight.actionLink && (
            <div className="mt-3">
              <Link
                to={insight.actionLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <span>{insight.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsightCard;
