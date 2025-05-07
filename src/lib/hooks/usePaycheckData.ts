import { useCallback, useEffect, useState } from 'react';
import { toastService } from '../../components/ui/toast';
import { PaycheckData, paycheckService } from '../../services/paycheckService';

export const usePaycheckData = (companyName?: string, month?: number) => {
  const [paycheckData, setPaycheckData] = useState<PaycheckData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Get current month if not provided
  const currentMonth = month ?? new Date().getMonth() + 1; // JavaScript months are 0-indexed

  // Function to fetch paycheck data
  const fetchPaycheckData = useCallback(async () => {
    if (!companyName) {
      setPaycheckData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await paycheckService.getPaycheckData(companyName, currentMonth);
      setPaycheckData(data);
    } catch (error) {
      console.error("Error fetching paycheck data:", error);
      setError("Failed to load paycheck data. Please try again.");
      toastService.error("Could not retrieve paycheck data");
    } finally {
      setLoading(false);
    }
  }, [companyName, currentMonth]);

  // Function to manually trigger a refresh
  const refreshPaycheckData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Load paycheck data when a company is selected or refresh is triggered
  useEffect(() => {
    fetchPaycheckData();
  }, [fetchPaycheckData, refreshTrigger]);

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('da-DK', { style: 'percent', maximumFractionDigits: 2 }).format(value);
  };

  // Parse worked hours from a number (e.g., 10.89 hours)
  const parseWorkedHours = (hours: number): string => {
    if (!hours || isNaN(hours)) return "0h 0m";
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return {
    paycheckData,
    loading,
    error,
    formatCurrency,
    formatPercentage,
    parseWorkedHours,
    refreshPaycheckData
  };
}; 