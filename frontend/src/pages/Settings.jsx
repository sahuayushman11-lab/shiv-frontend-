import React, { useState } from 'react';
import { Moon, Sun, Shield, Database, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';
import { budgetService } from '../services/budgetService';
import { savingsService } from '../services/savingsService';
import LoadingSpinner from '../components/LoadingSpinner';

export function Settings() {
  const { darkMode, toggleDarkMode, user } = useAuth();
  const [isPopulatingDemo, setIsPopulatingDemo] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  // Quick Demo Seeder for testing visualizations instantly
  const handleLoadDemoData = async () => {
    setIsPopulatingDemo(true);
    setDemoLoaded(false);
    try {
      // 1. Get default categories
      const catRes = await expenseService.getCategories();
      const categories = catRes.data?.categories || [];

      const foodCat = categories.find(c => c.name.includes('Food'))?.id || categories[0]?.id;
      const transportCat = categories.find(c => c.name.includes('Transport'))?.id || categories[1]?.id;
      const entertainmentCat = categories.find(c => c.name.includes('Entertainment'))?.id || categories[2]?.id;
      const shoppingCat = categories.find(c => c.name.includes('Shopping'))?.id || categories[3]?.id;
      const educationCat = categories.find(c => c.name.includes('Education'))?.id || categories[4]?.id;

      const today = new Date();
      const daysAgo = (days) => {
        const d = new Date();
        d.setDate(today.getDate() - days);
        return d.toISOString().split('T')[0];
      };

      // Add realistic sample expenses
      await expenseService.createExpense({
        amount: 250,
        categoryId: foodCat,
        description: 'School Canteen Lunch & Juice',
        expenseDate: daysAgo(1),
        paymentMethod: 'Cash',
        notes: 'Double burger and drink'
      });
      await expenseService.createExpense({
        amount: 120,
        categoryId: transportCat,
        description: 'Bus Pass Top-up',
        expenseDate: daysAgo(3),
        paymentMethod: 'UPI'
      });
      await expenseService.createExpense({
        amount: 499,
        categoryId: entertainmentCat,
        description: 'Cinema Ticket & Popcorn',
        expenseDate: daysAgo(5),
        paymentMethod: 'Debit Card'
      });
      await expenseService.createExpense({
        amount: 350,
        categoryId: educationCat,
        description: 'Science Project Notebook & Pens',
        expenseDate: daysAgo(7),
        paymentMethod: 'Cash'
      });
      await expenseService.createExpense({
        amount: 850,
        categoryId: shoppingCat,
        description: 'New Graphic T-Shirt',
        expenseDate: daysAgo(10),
        paymentMethod: 'UPI'
      });

      // Add sample budgets
      await budgetService.createBudget({
        name: 'Snacks & Cafeteria',
        amount: 800,
        period: 'monthly',
        categoryId: foodCat
      });
      await budgetService.createBudget({
        name: 'Fun & Hangouts',
        amount: 1200,
        period: 'monthly',
        categoryId: entertainmentCat
      });

      // Add sample savings goal
      await savingsService.createSavingsGoal({
        name: 'Wireless Gaming Headphones',
        targetAmount: 2500,
        currentAmount: 1250,
        deadline: new Date(today.getFullYear(), today.getMonth() + 2, 1).toISOString().split('T')[0]
      });

      setDemoLoaded(true);
    } catch (err) {
      console.error('Failed to load demo data:', err);
    } finally {
      setIsPopulatingDemo(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize display themes, privacy controls, and testing data.
        </p>
      </div>

      {/* Appearance & Dark Mode */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Theme Mode
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose between vibrant light mode or sleek, high-contrast dark mode.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => !darkMode && toggleDarkMode()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all ${
              darkMode
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm font-bold">Dark Mode</span>
          </button>

          <button
            onClick={() => darkMode && toggleDarkMode()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all ${
              !darkMode
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm font-bold">Light Mode</span>
          </button>
        </div>
      </div>

      {/* Security & Teen Privacy */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Privacy & Security Assurance
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Your financial data is encrypted. Passwords are salted and hashed using industry-standard bcrypt.
          No bank accounts or credit card numbers are ever stored.
        </p>
      </div>

      {/* Development & Demo Helper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Instant Sample Data Loader
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Populate realistic sample expenses, budgets, and savings goals to immediately preview charts and insights.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleLoadDemoData}
            disabled={isPopulatingDemo}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
          >
            {isPopulatingDemo ? (
              <LoadingSpinner size="sm" />
            ) : demoLoaded ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Database className="w-4 h-4 text-indigo-400" />
            )}
            <span>{demoLoaded ? 'Sample Data Loaded! Check Dashboard' : 'Load Demo Teen Finances'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
