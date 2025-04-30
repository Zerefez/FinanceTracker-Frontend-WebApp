// Service for managing data in local storage

// Storage keys
const STORAGE_KEYS = {
  JOB_WORKDAYS: 'app_job_workdays',
};

export type JobWorkdays = Record<string, string[]>;

export const localStorageService = {
  // Get all job workdays
  getJobWorkdays: (): JobWorkdays => {
    const storedData = localStorage.getItem(STORAGE_KEYS.JOB_WORKDAYS);
    return storedData ? JSON.parse(storedData) : {};
  },

  // Get workdays for a specific job
  getWorkdaysForJob: (companyName: string): string[] => {
    const allWorkdays = localStorageService.getJobWorkdays();
    return allWorkdays[companyName] || [];
  },

  // Save workdays for a specific job
  saveWorkdaysForJob: (companyName: string, weekdays: string[]): void => {
    const allWorkdays = localStorageService.getJobWorkdays();
    allWorkdays[companyName] = weekdays;
    localStorage.setItem(STORAGE_KEYS.JOB_WORKDAYS, JSON.stringify(allWorkdays));
  },

  // Remove workdays for a specific job
  removeWorkdaysForJob: (companyName: string): void => {
    const allWorkdays = localStorageService.getJobWorkdays();
    delete allWorkdays[companyName];
    localStorage.setItem(STORAGE_KEYS.JOB_WORKDAYS, JSON.stringify(allWorkdays));
  },

  // Clear all job workdays
  clearAllJobWorkdays: (): void => {
    localStorage.removeItem(STORAGE_KEYS.JOB_WORKDAYS);
  }
}; 