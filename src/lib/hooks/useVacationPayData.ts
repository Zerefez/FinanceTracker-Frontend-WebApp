import { useCallback, useEffect, useState } from 'react';
import { toastService } from '../../components/ui/toast';
import { VacationPayData, vacationPayService } from '../../services/vacationPayService';

/**
 * Hook to fetch and manage vacation pay data for a specific company and year
 */
export const useVacationPayData = (companyName?: string, year?: number) => {
  const [vacationPayData, setVacationPayData] = useState<VacationPayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Get current year if not provided
  const currentYear = year ?? new Date().getFullYear();

  // Function to fetch vacation pay data
  const fetchVacationPayData = useCallback(async () => {
    if (!companyName) {
      setVacationPayData(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await vacationPayService.getTotalVacationPay(companyName, currentYear);
      setVacationPayData(data);
    } catch (error) {
      console.error("Error fetching vacation pay data:", error);
      
      // Set more specific error message depending on the error
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to load vacation pay data. Please try again.";
        
      setError(errorMessage);
      toastService.error("Could not retrieve vacation pay data");
    } finally {
      setLoading(false);
    }
  }, [companyName, currentYear]);

  // Function to manually trigger a refresh
  const refreshVacationPayData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Load vacation pay data when a company is selected or refresh is triggered
  useEffect(() => {
    fetchVacationPayData();
  }, [fetchVacationPayData, refreshTrigger]);

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(value);
  };

  return {
    vacationPayData,
    loading,
    error,
    formatCurrency,
    refreshVacationPayData
  };
}; 