import { Job } from '../components/Job';

// Mock data for development without backend
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer',
    companyName: 'Nvidia Inc.',
    startDate: 'January 2023',
    endDate: 'Present'
  },
  {
    id: '2',
    title: 'Data Analyst',
    companyName: 'Data Insights LLC',
    startDate: 'June 2022',
    endDate: 'December 2022'
  },
  {
    id: 'job_3456',
    companyName: 'Tesla Motors',
    hourlyRate: 250,
    taxCardType: 'Main card',
    employmentType: 'Part-time',
    cvr: '12345678',
    weekday: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    supplementAmount: 500
  }
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
      // return await apiService.get<Job[]>('/jobs');
      
      // For development without backend, use local storage
      initializeLocalStorage();
      const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      return storedJobs ? JSON.parse(storedJobs) : [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },
  
  // Get a job by ID
  getJobById: async (id: string): Promise<Job | null> => {
    try {
      // Try API first
      // return await apiService.get<Job>(`/jobs/${id}`);
      
      // For development without backend, use local storage
      initializeLocalStorage();
      const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
      return jobs.find(job => job.id === id) || null;
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      return null;
    }
  },
  
  // Create a new job
  createJob: async (job: Job): Promise<Job> => {
    try {
      // Try API first
      // return await apiService.post<Job>('/jobs', job);
      
      // For development without backend, use local storage
      initializeLocalStorage();
      const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
      
      // Generate a dynamic ID if not provided
      if (!job.id) {
        job.id = `job_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      }
      
      // Add job to array
      const updatedJobs = [...jobs, job];
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));
      
      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },
  
  // Update an existing job
  updateJob: async (id: string, job: Job): Promise<Job> => {
    try {
      // Try API first
      // return await apiService.put<Job>(`/jobs/${id}`, job);
      
      // For development without backend, use local storage
      initializeLocalStorage();
      const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
      
      // Update job
      const updatedJobs = jobs.map(j => j.id === id ? { ...job, id } : j);
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));
      
      return job;
    } catch (error) {
      console.error(`Error updating job ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a job
  deleteJob: async (id: string): Promise<void> => {
    try {
      // Try API first
      // await apiService.delete(`/jobs/${id}`);
      
      // For development without backend, use local storage
      initializeLocalStorage();
      const storedJobs = localStorage.getItem(JOB_STORAGE_KEY);
      const jobs: Job[] = storedJobs ? JSON.parse(storedJobs) : [];
      
      // Remove job
      const updatedJobs = jobs.filter(job => job.id !== id);
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));
    } catch (error) {
      console.error(`Error deleting job ${id}:`, error);
      throw error;
    }
  }
}; 