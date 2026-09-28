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
  X,
  Sparkles
} from 'lucide-react';

const MAIN_MOBILE_LINKS = [
  { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: ReceiptText },
  { name: 'Budgets', path: '/budgets', icon: PiggyBank },
  { name: 'Savings', path: '/savings', icon: Target },
];

const ALL_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: ReceiptText },
  { name: 'Budgets', path: '/budgets', icon: PiggyBank },
  { name: 'Savings Goals', path: '/savings', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Smart Insights', path: '/insights', icon: Lightbulb },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function MobileNavbar({ isOpen, onClose }) {
  return (
    <>
      {/* Bottom Sticky Tab Bar for Phones */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around"
      >
        {MAIN_MOBILE_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Slide-over Mobile Drawer for Full Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    TeenExpense
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {ALL_LINKS.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 text-center">
              Empowering Teens to Master Money 🚀
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNavbar;
