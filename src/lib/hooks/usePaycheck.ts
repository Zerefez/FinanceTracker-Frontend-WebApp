import { useState } from 'react';
import { useJobs } from './useJobs';

/**
 * Hook for managing paycheck data and job selection
 */
export function usePaycheck() {
  const { jobs, loading } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectedJob = jobs.find(job => job.id === selectedJobId) || null;

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  return {
    jobs,
    loading,
    selectedJobId,
    selectedJob,
    isMenuOpen,
    setSelectedJobId: handleJobSelect,
    toggleMenu
  };
} 