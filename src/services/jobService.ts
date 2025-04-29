import { Job } from '../components/Job';
import { apiService } from './apiService';

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
const JOB_STORAGE_KEY = 'app_jobs';

// Helper to initialize local storage with mock data if empty
const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(JOB_STORAGE_KEY)) {
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(mockJobs));
  }
};

export const jobService = {
  // Get all jobs
  getJobs: async (): Promise<Job[]> => {
    try {
      // Try API first
      return await apiService.get<Job[]>('/Job/GetAllJobsForUser');
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
    // For development without backend, use local storage
    // initializeLocalStorage();
    // const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
    // return storedJobs ? JSON.parse(storedJobs) : [];

  },

  // // Get a job by ID
  // getJobById: async (id: string): Promise<Job | null> => {
  //   try {
  //     // Try API first
  //     // return await apiService.get<Job>(`/jobs/${id}`);

  //     // For development without backend, use local storage
  //     initializeLocalStorage();
  //     const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
  //     const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
  //     return jobs.find(job => job.id === id) || null;
  //   } catch (error) {
  //     console.error(`Error fetching job ${id}:`, error);
  //     return null;
  //   }
  // },

  // Create a new job
  registerJob: async (job: Job): Promise<Job> => {
    try {
      // Try API first
      return await apiService.post<Job>('/Job/RegisterJob', job);

      // // For development without backend, use local storage
      // initializeLocalStorage();
      // const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      // const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];

      // // Generate a dynamic ID if not provided
      // if (!job.id) {
      //   job.id = `job_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      // }

      // // Add job to array
      // const updatedJobs = [...jobs, job];
      // localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));

      // return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update an existing job
  updateJob: async (companyName: string, job: Job): Promise<Job> => {
    try {
      // Try API first
      return await apiService.put<Job>(`/jobs/${companyName}`, job);

      // // For development without backend, use local storage
      // initializeLocalStorage();
      // const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      // const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];

      // // // Update job
      // const updatedJobs = jobs.map(j => j.id === id ? { ...job, id } : j);
      // localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));

      // return job;
    } catch (error) {
      console.error(`Error updating job at ${companyName}:`, error);
      throw error;
    }
  },

  // Delete a job
  deleteJob: async (companyName: string): Promise<void> => {
    try {
      // Try API first
      return await apiService.delete(`/Job/DeleteJob${companyName}`);

      // // For development without backend, use local storage
      // initializeLocalStorage();
      // const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      // const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];

      // // Remove job
      // const updatedJobs = jobs.filter(job => job.id !== id);
      // localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));
    } catch (error) {
      console.error(`Error deleting job at ${companyName}:`, error);
      throw error;
    }
  }
}; 