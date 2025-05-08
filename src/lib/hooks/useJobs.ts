import { useEffect, useState } from "react";
import { toastService } from "../../components/ui/toast";
import { Job } from "../../pages/JobOverviewPage";
import { jobService } from "../../services/jobService";
import { localStorageService } from "../../services/localStorageService";

/**
 * Hook for fetching and managing jobs data
 */
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch jobs from API
      const data = await jobService.getJobs();
      
      // Enhance jobs with locally stored workdays
      const jobsWithWorkdays = data.map(job => {
        if (job.companyName) {
          const workdays = localStorageService.getWorkdaysForJob(job.companyName);
          return {
            ...job,
            weekdays: workdays,
            weekday: workdays.length > 0 ? workdays.join(", ") : undefined
          };
        }
        return job;
      });
      
      setJobs(jobsWithWorkdays);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch jobs"));
      toastService.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const registerJob = async (job: Job): Promise<Job> => {
    try {
      const newJob = await jobService.registerJob(job);
      
      // Save workdays to local storage if provided
      if (newJob.companyName && job.weekdays && job.weekdays.length > 0) {
        localStorageService.saveWorkdaysForJob(newJob.companyName, job.weekdays);
      }
      
      // Add workdays back to the job object for the UI
      const enhancedJob = {
        ...newJob,
        weekdays: job.weekdays || [],
        weekday: job.weekdays && job.weekdays.length > 0 
          ? job.weekdays.join(", ") 
          : undefined
      };
      
      setJobs((prev) => [...prev, enhancedJob]);
      toastService.success(`Job at ${job.companyName} created successfully`);
      return enhancedJob;
    } catch (error) {
      console.error("Error registering job:", error);
      toastService.error("Failed to create job");
      throw error;
    }
  };

  const updateJob = async (job: Job): Promise<Job> => {
    try {
      const updatedJob = await jobService.updateJob(job);
      
      // Save workdays to local storage if provided
      if (updatedJob.companyName && job.weekdays) {
        localStorageService.saveWorkdaysForJob(updatedJob.companyName, job.weekdays);
      }
      
      // Add workdays back to the job object for the UI
      const enhancedJob = {
        ...updatedJob,
        weekdays: job.weekdays || [],
        weekday: job.weekdays && job.weekdays.length > 0 
          ? job.weekdays.join(", ") 
          : undefined
      };
      
      setJobs((prev) => prev.map((j) => 
        (j.companyName === job.companyName ? enhancedJob : j))
      );
      
      toastService.success(`Job at ${job.companyName} updated successfully`);
      return enhancedJob;
    } catch (error) {
      console.error("Error updating job:", error);
      toastService.error(`Failed to update job at ${job.companyName}`);
      throw error;
    }
  };

  const deleteJob = async (companyName: string): Promise<void> => {
    try {
      await jobService.deleteJob(companyName);
      
      // Remove workdays from local storage
      localStorageService.removeWorkdaysForJob(companyName);
      
      // Update jobs state
      setJobs((prev) => prev.filter((job) => job.companyName !== companyName));
      toastService.success(`Job at ${companyName} deleted successfully`);
    } catch (error) {
      console.error("Error deleting job:", error);
      toastService.error(`Failed to delete job at ${companyName}`);
      throw error;
    }
  };

  const getJobByCompanyName = async (companyName: string): Promise<Job | null> => {
    try {
      const job = await jobService.getJobByCompanyName(companyName);
      
      if (job) {
        // Enhance job with locally stored workdays
        const workdays = localStorageService.getWorkdaysForJob(companyName);
        return {
          ...job,
          weekdays: workdays,
          weekday: workdays.length > 0 ? workdays.join(", ") : undefined
        };
      }
      
      return job;
    } catch (error) {
      console.error(`Error fetching job ${companyName}:`, error);
      toastService.error(`Failed to load job details for ${companyName}`);
      return null;
    }
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    registerJob,
    updateJob,
    deleteJob,
    getJobByCompanyName,
  };
}
