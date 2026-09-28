import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import ChartCard from '../components/ChartCard';
import SpendingLineChart from '../charts/SpendingLineChart';
import CategoryPieChart from '../charts/CategoryPieChart';
import CategoryBarChart from '../charts/CategoryBarChart';
import BudgetChart from '../charts/BudgetChart';
import SavingsChart from '../charts/SavingsChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

export function Analytics() {
  const { user } = useAuth();
  const currencyCode = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [period, setPeriod] = useState('daily');
  const {
    summary,
    categoryData,
    timelineData,
    budgetAnalytics,
    savingsAnalytics,
    isLoading
  } = useAnalytics(period);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual graphs, spending trajectories, and budget health metrics.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                period === p
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" className="text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Key Analytics Highlights */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs font-semibold text-slate-500 uppercase">Top Category</span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {summary.topCategory ? summary.topCategory.name : 'N/A'}
                </h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {summary.topCategory ? `${summary.topCategory.percentage}% of total spending` : 'No data'}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs font-semibold text-slate-500 uppercase">Avg Daily Spending</span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {formatCurrency(summary.averageDailySpending, currencyCode)}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Across this month's days
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs font-semibold text-slate-500 uppercase">Budget Utilization</span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {budgetAnalytics?.utilization || 0}%
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatCurrency(budgetAnalytics?.totalSpent || 0, currencyCode)} spent of {formatCurrency(budgetAnalytics?.totalBudget || 0, currencyCode)}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs font-semibold text-slate-500 uppercase">Overall Savings</span>
                <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {savingsAnalytics?.overallProgress || 0}%
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatCurrency(savingsAnalytics?.totalSaved || 0, currencyCode)} saved of {formatCurrency(savingsAnalytics?.totalTarget || 0, currencyCode)}
                </p>
              </div>
            </div>
          )}

          {/* Chart Section A: Spending Over Time */}
          <ChartCard
            title="Spending Over Time"
            subtitle={`Aggregated ${period} timeline trajectory`}
          >
            <SpendingLineChart
              data={timelineData}
              currencyCode={currencyCode}
              height={320}
            />
          </ChartCard>

          {/* Chart Section B: Category Pie and Bar Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Category Distribution"
              subtitle="Breakdown of expenses by category"
            >
              <CategoryPieChart
                data={categoryData}
                currencyCode={currencyCode}
                height={300}
              />
            </ChartCard>

            <ChartCard
              title="Category Comparison"
              subtitle="Comparing highest spending sectors"
            >
              <CategoryBarChart
                data={categoryData}
                currencyCode={currencyCode}
                height={300}
              />
            </ChartCard>
          </div>

          {/* Chart Section C: Budgets vs Actual & Savings Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Budget vs Actual Spending"
              subtitle="Comparison of planned limit vs recorded expense"
            >
              <BudgetChart
                budgets={budgetAnalytics?.budgets || []}
                currencyCode={currencyCode}
                height={300}
              />
            </ChartCard>

            <ChartCard
              title="Savings Target Progress"
              subtitle="Progress toward achieving your goals"
            >
              <SavingsChart
                goals={savingsAnalytics?.goals || []}
                currencyCode={currencyCode}
                height={300}
              />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
