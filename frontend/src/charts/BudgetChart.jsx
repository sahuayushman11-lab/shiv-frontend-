import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../utils/currency';

export function BudgetChart({
  budgets = [],
  currencyCode = 'INR',
  height = 300
}) {
  if (!budgets || budgets.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl"
        style={{ height }}
      >
        No budgets set yet. Add a budget to track spending vs goals.
      </div>
    );
  }

  const chartData = budgets.slice(0, 5).map(b => ({
    name: b.name,
    budget: Number(b.budget || b.amount || 0),
    spent: Number(b.spent || 0)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Budget: {formatCurrency(payload[0]?.value, currencyCode)}
          </p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Spent: {formatCurrency(payload[1]?.value, currencyCode)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium capitalize">
                {value}
              </span>
            )}
          />
          <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="spent" name="Actual Spent" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BudgetChart;
