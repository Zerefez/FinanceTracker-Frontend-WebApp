import { useEffect, useState } from 'react';
import { Job } from '../../components/Job';
import { jobService } from '../../services/jobService';

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
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch jobs'));
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
      setJobs(prev => [...prev, newJob]);
      return newJob;
    } catch (error) {
      console.error('Error registering job:', error);
      throw error;
    }
  };

  const updateJob = async (job: Job): Promise<Job> => {
    try {
      const updatedJob = await jobService.updateJob(job);
      setJobs(prev => prev.map(j => j.CompanyName === job.CompanyName ? updatedJob : j));
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (companyName: string): Promise<void> => {
    try {
      await jobService.deleteJob(companyName);
      setJobs(prev => prev.filter(job => job.CompanyName !== companyName));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const getJobByCompanyName = async (companyName: string): Promise<Job | null> => {
    try {
      return await jobService.getJobByCompanyName(companyName);
    } catch (error) {
      console.error(`Error fetching job ${companyName}:`, error);
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
    getJobByCompanyName
  };
} 