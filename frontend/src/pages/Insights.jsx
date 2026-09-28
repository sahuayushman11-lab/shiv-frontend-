import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { insightService } from '../services/insightService';
import InsightCard from '../components/InsightCard';
import LoadingSpinner from '../components/LoadingSpinner';

export function Insights() {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      setIsLoading(true);
      try {
        const res = await insightService.getInsights();
        setInsights(res.data?.insights || []);
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInsights();
  }, []);

  const TEEN_FINANCIAL_HABITS = [
    {
      title: 'The 24-Hour Rule for Impulse Wants',
      description: 'When you want to buy an expensive gadget, skin in a game, or trendy apparel, wait 24 hours. If you still want it tomorrow, review if it fits your budget.'
    },
    {
      title: 'Automate Your Savings First',
      description: 'Whenever you receive allowance or gift money, deposit 20% into your savings goal before spending on treats.'
    },
    {
      title: 'Small Snacks & Drinks Compound',
      description: 'A daily ₹50 coffee or snack equals ₹1,500 every single month — that is enough to buy high-end headphones or a gaming pass!'
    },
    {
      title: 'Track Every Transaction Immediately',
      description: 'Take 10 seconds to log every expense as soon as it happens so nothing slips through the cracks.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rule-Based Behavioral Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Spending Insights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Actionable feedback generated transparently from your real spending habits, budget thresholds, and savings targets.
        </p>
      </div>

      {/* Generated Insights Feed */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Personalized Observations for You</span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <LoadingSpinner size="md" className="text-indigo-600" />
          </div>
        ) : insights.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            Keep recording expenses! We need a few more logs to identify trends.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>

      {/* Educational Foundation: Teen Money Rules */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Essential Money Habits for Young Adults
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Timeless principles designed to give you a massive head start in life.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {TEEN_FINANCIAL_HABITS.map((habit, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {habit.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {habit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Insights;
