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

  const createJob = async (job: Job): Promise<Job> => {
    try {
      const newJob = await jobService.createJob(job);
      setJobs(prev => [...prev, newJob]);
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  const updateJob = async (id: string, job: Job): Promise<Job> => {
    try {
      const updatedJob = await jobService.updateJob(id, job);
      setJobs(prev => prev.map(j => j.id === id ? updatedJob : j));
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (id: string): Promise<void> => {
    try {
      await jobService.deleteJob(id);
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const getJobById = async (id: string): Promise<Job | null> => {
    try {
      return await jobService.getJobById(id);
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      return null;
    }
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    getJobById
  };
} 