import { Job } from "../components/Job";
import { apiService } from "./apiService";

// Mock data for development without backend
const mockJobs: Job[] = [
  // {
  //   title: 'Software Engineer',
  //   companyName: 'Nvidia Inc.',
  //   startDate: 'January 2023',
  //   endDate: 'Present'
  // },
  // {
  //   title: 'Data Analyst',
  //   companyName: 'Data Insights LLC',
  //   startDate: 'June 2022',
  //   endDate: 'December 2022'
  // },
  // {
  //   CompanyName: 'Tesla Motors',
  //   HourlyRate: 250,
  //   TaxCard: 'Main card',
  //   EmploymentType: 'Part-time'
  // }
];

// Local storage key
const JOB_STORAGE_KEY = "app_jobs";

// Helper to initialize local storage with mock data if empty
const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(JOB_STORAGE_KEY)) {
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(mockJobs));
  }
};

export const jobService = {
  // Get all jobs for the current user
  getJobs: async (): Promise<Job[]> => {
    try {
      // Try API first
      return await apiService.get<Job[]>("/Job/GetAllJobsForUser");
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
    // For development without backend, use local storage
    // initializeLocalStorage();
    // const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
    // return storedJobs ? JSON.parse(storedJobs) : [];
  },

  // Get a job by company name
  getJobByCompanyName: async (companyName: string): Promise<Job | null> => {
    try {
      // Try API first by filtering from all jobs (assuming no direct endpoint)
      const jobs = await jobService.getJobs();
      return jobs.find((job) => job.companyName === companyName) || null;
    } catch (error) {
      console.error(`Error fetching job ${companyName}:`, error);
      return null;
    }
  },

  // Create a new job
  registerJob: async (job: Job): Promise<Job> => {
    try {
      // Try API first
      return await apiService.post<Job>("/Job/RegisterJob", job);
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  // Update an existing job
  updateJob: async (job: Job): Promise<Job> => {
    try {
      // Try API first
      return await apiService.post<Job>(`/Job/UpdateJob/${job.companyName}`, job);
    } catch (error) {
      console.error(`Error updating job ${job.companyName}:`, error);
      throw error;
    }
  },

  // Delete a job
  deleteJob: async (companyName: string): Promise<void> => {
    try {
      // Try API first
      return await apiService.delete(`/Job/DeleteJob?companyName=${companyName}`);
    } catch (error) {
      console.error(`Error deleting job at ${companyName}:`, error);
      throw error;
    }
  },
};
