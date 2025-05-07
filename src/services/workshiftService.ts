import { WorkShift } from "../lib/hooks/useWorkshiftForm";
import { apiService } from "./apiService";
import { authService } from "./authService";

// Helper function to preserve local time when converting to ISO string
const dateToISOWithLocalTime = (date: Date): string => {
  // Preserve local time by using the individual components
  const pad = (num: number) => String(num).padStart(2, '0');
  
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const workshiftService = {
  // Get all workshifts for the current user
  getUserWorkshifts: async (jobId?: string): Promise<WorkShift[]> => {
    const response = await apiService.get<WorkShift[]>(`/Workshifts`);
    // Parse date strings to Date objects
    return response.map(ws => ({
      ...ws,
      startTime: new Date(ws.startTime),
      endTime: new Date(ws.endTime)
    }));
  },

  // Get a workshift by ID
  getWorkshiftById: async (id: string): Promise<WorkShift | null> => {
    // Use the correct endpoint
    const response = await apiService.get<WorkShift>(`/Workshifts/${id}`);
    
    if (response) {
      // Parse date strings to Date objects
      return {
        ...response,
        startTime: new Date(response.startTime),
        endTime: new Date(response.endTime)
      };
    }
    
    return null;
  },

  // Create a new workshift
  createWorkshift: async (workshift: WorkShift): Promise<WorkShift> => {
    // Get current user ID from auth service
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id || '';
    
    // Format the request body exactly as expected by the backend API
    // Use our helper to preserve local time
    const requestBody = {
      startTime: dateToISOWithLocalTime(workshift.startTime),
      endTime: dateToISOWithLocalTime(workshift.endTime),
      userId: userId,
      jobId: workshift.jobId
    };

    try {
      console.log("Sending workshift data:", requestBody);
      // Use the correct endpoint
      const response = await apiService.post<WorkShift>("/Workshifts", requestBody);
      
      // Parse date strings to Date objects
      return {
        ...response,
        startTime: new Date(response.startTime),
        endTime: new Date(response.endTime)
      };
    } catch (error) {
      console.error("Error creating workshift:", error);
      throw error;
    }
  },

  // Update an existing workshift
  updateWorkshift: async (id: string, workshift: WorkShift): Promise<WorkShift> => {
    // Get current user ID from auth service
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id || '';
    
    // Format the request body according to the API schema
    // Use our helper to preserve local time
    const requestBody = {
      startTime: dateToISOWithLocalTime(workshift.startTime),
      endTime: dateToISOWithLocalTime(workshift.endTime),
      userId: userId,
      jobId: workshift.jobId
    };

    // Use the update endpoint
    const response = await apiService.put<WorkShift>(`/Paycheck/updateWorkshift/${id}`, requestBody);
    
    // Parse date strings to Date objects
    return {
      ...response,
      startTime: new Date(response.startTime),
      endTime: new Date(response.endTime)
    };
  },

  // Delete a workshift
  deleteWorkshift: async (id: string): Promise<void> => {
    await apiService.delete(`/Paycheck/deleteWorkshift/${id}`);
  }
}; 