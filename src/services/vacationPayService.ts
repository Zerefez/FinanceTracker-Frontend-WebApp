import { apiService } from "./apiService";

export interface VacationPayData {
    vacationPay: number;
  }


export const vacationPayService = {
      /**
   * Gets total vacation pay for a specific company and year
   * @param companyName - The name of the company to get vacation pay for
   * @param year - The year to calculate vacation pay for
   * @returns A promise that resolves to vacation pay data
   */
  getTotalVacationPay: async (companyName: string, year: number): Promise<VacationPayData> => {
    // Validate inputs
    if (!companyName || companyName.trim() === '') {
      throw new Error("Company name is required");
    }
    
    if (!year || isNaN(year) || year <= 0) {
      throw new Error("Valid year is required");
    }
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('companyName', companyName.trim());
      queryParams.append('year', year.toString());
      
      // Make API request
      return await apiService.get<VacationPayData>(`/Paychecks/VacationPay?${queryParams.toString()}`);
    } catch (error) {
      console.error("Failed to fetch vacation pay data:", error);
      throw error instanceof Error 
        ? error 
        : new Error("An unexpected error occurred while fetching vacation pay data");
    }
  }

};


