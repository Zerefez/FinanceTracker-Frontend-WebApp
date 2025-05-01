import { WorkShift } from "../lib/hooks/useWorkshiftForm";
import { apiService } from "./apiService";

// Storage key for local development
const WORKSHIFTS_STORAGE_KEY = "app_workshifts";

// Initialize mock data for development
const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(WORKSHIFTS_STORAGE_KEY)) {
    const mockWorkshifts: WorkShift[] = [
      {
        startTime: new Date(2023, 5, 1, 8, 0),
        endTime: new Date(2023, 5, 1, 16, 0),
        jobId: "Nvidia Inc."
      },
      {
        startTime: new Date(2023, 5, 2, 9, 0),
        endTime: new Date(2023, 5, 2, 17, 0),
        jobId: "Nvidia Inc."
      },
      {
        startTime: new Date(2023, 5, 3, 10, 0),
        endTime: new Date(2023, 5, 3, 18, 0),
        jobId: "Tesla Motors"
      },
    ];
    localStorage.setItem(WORKSHIFTS_STORAGE_KEY, JSON.stringify(mockWorkshifts));
  }
};

// Helper to serialize dates when storing in localStorage
const serializeWorkshift = (workshift: WorkShift): any => {
  return {
    ...workshift,
    startTime: workshift.startTime.toISOString(),
    endTime: workshift.endTime.toISOString(),
  };
};

// Helper to deserialize dates when retrieving from localStorage
const deserializeWorkshift = (data: any): WorkShift => {
  return {
    ...data,
    startTime: new Date(data.startTime),
    endTime: new Date(data.endTime),
  };
};

export const workshiftService = {
  // Get all workshifts for the current user
  getUserWorkshifts: async (jobId?: string): Promise<WorkShift[]> => {
    try {
      // Try API first
      const endpoint = jobId 
        ? `/WorkShift/GetUserWorkshiftsByJob/${jobId}`
        : "/WorkShift/GetUserWorkshifts";
      return await apiService.get<WorkShift[]>(endpoint);
    } catch (error) {
      console.error("Error fetching workshifts from API, using local storage:", error);
      
      // Fallback to local storage for development
      initializeLocalStorage();
      const storedWorkshifts = localStorage.getItem(WORKSHIFTS_STORAGE_KEY);
      
      if (storedWorkshifts) {
        const parsedWorkshifts = JSON.parse(storedWorkshifts);
        const deserializedWorkshifts = parsedWorkshifts.map(deserializeWorkshift);
        
        // Filter by jobId if provided
        if (jobId) {
          return deserializedWorkshifts.filter((ws: WorkShift) => ws.jobId === jobId);
        }
        
        return deserializedWorkshifts;
      }
      
      return [];
    }
  },

  // Get a workshift by ID
  getWorkshiftById: async (id: string): Promise<WorkShift | null> => {
    try {
      // Try API first
      return await apiService.get<WorkShift>(`/WorkShift/${id}`);
    } catch (error) {
      console.error(`Error fetching workshift ${id} from API, using local storage:`, error);
      
      // Fallback to local storage for development
      initializeLocalStorage();
      const storedWorkshifts = localStorage.getItem(WORKSHIFTS_STORAGE_KEY);
      
      if (storedWorkshifts) {
        const parsedWorkshifts = JSON.parse(storedWorkshifts);
        const workshift = parsedWorkshifts[parseInt(id)]; // Using index as ID for development
        
        return workshift ? deserializeWorkshift(workshift) : null;
      }
      
      return null;
    }
  },

  // Create a new workshift
  createWorkshift: async (workshift: WorkShift): Promise<WorkShift> => {
    try {
      // Try API first
      return await apiService.post<WorkShift>("/WorkShift", workshift);
    } catch (error) {
      console.error("Error creating workshift in API, using local storage:", error);
      
      // Fallback to local storage for development
      initializeLocalStorage();
      const storedWorkshifts = localStorage.getItem(WORKSHIFTS_STORAGE_KEY);
      const workshifts = storedWorkshifts ? JSON.parse(storedWorkshifts) : [];
      
      // Add new workshift
      workshifts.push(serializeWorkshift(workshift));
      localStorage.setItem(WORKSHIFTS_STORAGE_KEY, JSON.stringify(workshifts));
      
      return workshift;
    }
  },

  // Update an existing workshift
  updateWorkshift: async (id: string, workshift: WorkShift): Promise<WorkShift> => {
    try {
      // Try API first
      return await apiService.put<WorkShift>(`/WorkShift/${id}`, workshift);
    } catch (error) {
      console.error(`Error updating workshift ${id} in API, using local storage:`, error);
      
      // Fallback to local storage for development
      initializeLocalStorage();
      const storedWorkshifts = localStorage.getItem(WORKSHIFTS_STORAGE_KEY);
      
      if (storedWorkshifts) {
        const workshifts = JSON.parse(storedWorkshifts);
        const index = parseInt(id);
        
        if (index >= 0 && index < workshifts.length) {
          workshifts[index] = serializeWorkshift(workshift);
          localStorage.setItem(WORKSHIFTS_STORAGE_KEY, JSON.stringify(workshifts));
        }
      }
      
      return workshift;
    }
  },

  // Delete a workshift
  deleteWorkshift: async (id: string): Promise<void> => {
    try {
      // Try API first
      await apiService.delete(`/WorkShift/${id}`);
    } catch (error) {
      console.error(`Error deleting workshift ${id} from API, using local storage:`, error);
      
      // Fallback to local storage for development
      initializeLocalStorage();
      const storedWorkshifts = localStorage.getItem(WORKSHIFTS_STORAGE_KEY);
      
      if (storedWorkshifts) {
        const workshifts = JSON.parse(storedWorkshifts);
        const index = parseInt(id);
        
        if (index >= 0 && index < workshifts.length) {
          workshifts.splice(index, 1);
          localStorage.setItem(WORKSHIFTS_STORAGE_KEY, JSON.stringify(workshifts));
        }
      }
    }
  }
}; 