import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/currency';

const DEFAULT_COLORS = [
  '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
  '#10b981', '#6366f1', '#ef4444', '#eab308', '#d946ef', '#64748b'
];

export function CategoryPieChart({
  data = [],
  currencyCode = 'INR',
  height = 300
}) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl"
        style={{ height }}
      >
        No category spending recorded yet.
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.name,
    value: Number(item.total),
    percentage: item.percentage,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{d.name}</p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(d.value, currencyCode)} ({d.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryPieChart;
