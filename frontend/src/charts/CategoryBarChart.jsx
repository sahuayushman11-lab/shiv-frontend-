import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { formatCurrency } from '../utils/currency';

const BAR_COLORS = [
  '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
  '#10b981', '#6366f1', '#ef4444', '#eab308', '#d946ef'
];

export function CategoryBarChart({
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
        No category data available.
      </div>
    );
  }

  const chartData = data.slice(0, 7).map((item, index) => ({
    name: item.name,
    amount: Number(item.total),
    color: item.color || BAR_COLORS[index % BAR_COLORS.length]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(payload[0].value, currencyCode)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryBarChart;
