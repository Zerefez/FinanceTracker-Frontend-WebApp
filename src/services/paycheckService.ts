import { apiService } from './apiService';

export interface PaycheckData {
  paycheckId: number;
  tax: number;
  salaryBeforeTax: number;
  holidaySupplement: number;
  pension: number;
  vacationPay: number;
  salaryAfterTax: number;
  taxDeduction: number;
  amContribution: number;
  workedHours: number;
}


export const paycheckService = {
  /**
   * Gets paycheck data for a specific company and month
   */
  getPaycheckData: async (companyName?: string, month?: number): Promise<PaycheckData> => {
    if (!companyName) {
      throw new Error("Company name is required");
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('companyName', companyName);
    
    if (month !== undefined) {
      queryParams.append('month', month.toString());
    }
    
    return apiService.get<PaycheckData>(`/Paychecks?${queryParams.toString()}`);
  },

}; 