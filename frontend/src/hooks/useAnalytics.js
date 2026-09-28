import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { insightService } from '../services/insightService';

export function useAnalytics(timelinePeriod = 'daily') {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [budgetAnalytics, setBudgetAnalytics] = useState(null);
  const [savingsAnalytics, setSavingsAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        summaryRes,
        categoryRes,
        timelineRes,
        budgetRes,
        savingsRes,
        insightsRes
      ] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategoryAnalytics(),
        analyticsService.getTimelineAnalytics(timelinePeriod),
        analyticsService.getBudgetAnalytics(),
        analyticsService.getSavingsAnalytics(),
        insightService.getInsights()
      ]);

      setSummary(summaryRes.data || null);
      setCategoryData(categoryRes.data?.categories || []);
      setTimelineData(timelineRes.data?.timeline || []);
      setBudgetAnalytics(budgetRes.data || null);
      setSavingsAnalytics(savingsRes.data || null);
      setInsights(insightsRes.data?.insights || []);
    } catch (err) {
      console.error('Analytics loading error:', err);
      setError(err.message || 'Unable to load analytics.');
    } finally {
      setIsLoading(false);
    }
  }, [timelinePeriod]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  return {
    summary,
    categoryData,
    timelineData,
    budgetAnalytics,
    savingsAnalytics,
    insights,
    isLoading,
    error,
    refreshAnalytics: fetchAllAnalytics
  };
}

export default useAnalytics;
