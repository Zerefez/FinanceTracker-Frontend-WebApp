import { apiService } from "./apiService";

export interface VacationPayData {
    vacationPay: number;
  }


export const vacationPayService = {
      /**
   * Gets total vacation pay for a specific company and year
   */
  getTotalVacationPay: async (companyName: string, year: number): Promise<VacationPayData> => {
    if (!companyName) {
      throw new Error("Company name is required");
    }
    
    if (!year) {
      throw new Error("Year is required");
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('companyName', companyName);
    queryParams.append('year', year.toString());
    
    return apiService.get<VacationPayData>(`/Paychecks/Total vacationPay?${queryParams.toString()}`);
  }

};


