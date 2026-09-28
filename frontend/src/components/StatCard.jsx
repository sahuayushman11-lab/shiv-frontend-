import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  badge,
  badgeType = 'neutral'
}) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/30'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/30'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/30'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/30'
    }
  };

  const badgeStyles = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  };

  const activeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className={`relative bg-white dark:bg-slate-900 border ${activeColor.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${activeColor.bg} ${activeColor.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h4>
        <div className="mt-1 flex items-center justify-between gap-2">
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {subtitle}
            </p>
          )}
          {badge && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeStyles[badgeType] || badgeStyles.neutral}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
