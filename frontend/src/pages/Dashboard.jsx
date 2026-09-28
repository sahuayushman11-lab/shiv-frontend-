import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingDown,
  Calendar,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import SpendingLineChart from '../charts/SpendingLineChart';
import CategoryPieChart from '../charts/CategoryPieChart';
import BudgetChart from '../charts/BudgetChart';
import InsightCard from '../components/InsightCard';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { StatCardSkeleton } from '../components/Skeleton';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

export function Dashboard() {
  const { user } = useAuth();
  const [timelinePeriod, setTimelinePeriod] = useState('daily');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const {
    summary,
    categoryData,
    timelineData,
    budgetAnalytics,
    insights,
    isLoading: analyticsLoading,
    refreshAnalytics
  } = useAnalytics(timelinePeriod);

  const { categories, addExpense } = useExpenses();

  const currencyCode = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currencyCode);

  const handleAddExpenseSubmit = async (formData) => {
    await addExpense(formData);
    setIsAddExpenseModalOpen(false);
    refreshAnalytics();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Monthly Financial Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Friend'}! 👋
          </h1>
          <p className="mt-1 text-sm text-indigo-100/90 max-w-xl">
            Here is your financial habit snapshot for this month. Stay on track with your goals!
          </p>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      {analyticsLoading || !summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Monthly Allowance */}
          <StatCard
            title="Monthly Allowance"
            value={formatCurrency(summary.monthlyAllowance, currencyCode)}
            subtitle="Fixed monthly income / budget"
            icon={Wallet}
            color="indigo"
          />

          {/* Total Spent */}
          <StatCard
            title="Total Spent"
            value={formatCurrency(summary.totalSpent, currencyCode)}
            subtitle={`${summary.transactionCount} total purchases this month`}
            icon={CreditCard}
            color={summary.totalSpent > summary.monthlyAllowance ? 'rose' : 'emerald'}
            badge={summary.totalSpent > summary.monthlyAllowance ? 'Overspent' : 'Within Limit'}
            badgeType={summary.totalSpent > summary.monthlyAllowance ? 'danger' : 'success'}
          />

          {/* Remaining Balance */}
          <StatCard
            title="Remaining Money"
            value={formatCurrency(summary.remainingMoney, currencyCode)}
            subtitle="Allowance balance left"
            icon={TrendingDown}
            color={summary.remainingMoney < 0 ? 'rose' : 'blue'}
          />

          {/* Total Saved in Goals */}
          <StatCard
            title="Total Savings"
            value={formatCurrency(summary.totalSaved, currencyCode)}
            subtitle="Across all savings goals"
            icon={PiggyBank}
            color="emerald"
          />
        </div>
      )}

      {/* Secondary Highlights: Avg Daily Spending and Largest Expense */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Average Daily Spending
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(summary.averageDailySpending, currencyCode)} / day
                </h4>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400">
              ≈ {formatCurrency(summary.averageWeeklySpending, currencyCode)} / wk
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Largest Expense
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {summary.largestExpense ? formatCurrency(summary.largestExpense.amount, currencyCode) : 'None'}
                </h4>
              </div>
            </div>
            {summary.largestExpense && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {summary.largestExpense.description}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Charts Section: Line Chart & Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Over Time (Takes 2 columns on desktop) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Spending Over Time"
            subtitle="Track day-to-day transaction velocity"
            action={
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                {['daily', 'weekly', 'monthly'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setTimelinePeriod(p)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      timelinePeriod === p
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            }
          >
            <SpendingLineChart
              data={timelineData}
              currencyCode={currencyCode}
              height={290}
            />
          </ChartCard>
        </div>

        {/* Category Breakdown (Takes 1 column) */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Category Breakdown"
            subtitle="Where does your allowance go?"
          >
            <CategoryPieChart
              data={categoryData}
              currencyCode={currencyCode}
              height={290}
            />
          </ChartCard>
        </div>
      </div>

      {/* Smart Spending Insights Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Smart Spending Insights
            </h3>
          </div>
          <Link
            to="/insights"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {insights.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep recording your daily expenses. We will automatically generate personalized advice once spending patterns emerge!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 2).map((item) => (
              <InsightCard key={item.id} insight={item} />
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal Dialog */}
      <Modal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          categories={categories}
          currencySymbol={currencySymbol}
          onSubmit={handleAddExpenseSubmit}
          onCancel={() => setIsAddExpenseModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
