import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  Target,
  BarChart3,
  Lightbulb,
  User,
  Settings,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: ReceiptText },
  { name: 'Budgets', path: '/budgets', icon: PiggyBank },
  { name: 'Savings Goals', path: '/savings', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Smart Insights', path: '/insights', icon: Lightbulb, badge: 'Smart' },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen p-5 transition-colors">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
            TeenExpense
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Smart Money Habit
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-400 text-slate-950 uppercase">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Educational Footer Card */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
          <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
            🌱 The 50/30/20 Habit
          </p>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400/80 mt-1 leading-relaxed">
            Aim for 50% Needs, 30% Wants, and 20% right into your Savings!
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
