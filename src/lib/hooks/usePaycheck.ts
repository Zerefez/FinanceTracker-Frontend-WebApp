import { useEffect, useState } from "react";
import { useJobs } from "./useJobs";

// Key for localStorage
const LAST_SELECTED_JOB_KEY = 'lastSelectedJob';

/**
 * Hook for managing paycheck data and job selection
 */
export function usePaycheck() {
  const { jobs, loading } = useJobs();
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load selected job from localStorage on mount
  useEffect(() => {
    if (jobs.length > 0 && !selectedCompanyName) {
      const savedJob = localStorage.getItem(LAST_SELECTED_JOB_KEY);
      if (savedJob && jobs.some(job => job.companyName === savedJob)) {
        setSelectedCompanyName(savedJob);
      }
    }
  }, [jobs, selectedCompanyName]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectedJob = jobs.find((job) => job.companyName === selectedCompanyName) || null;

  const handleJobSelect = (companyName: string) => {
    setSelectedCompanyName(companyName);
    // Save to localStorage when job is selected
    localStorage.setItem(LAST_SELECTED_JOB_KEY, companyName);
  };

  return {
    jobs,
    loading,
    selectedJobId: selectedCompanyName,
    selectedJob,
    isMenuOpen,
    setSelectedJobId: handleJobSelect,
    toggleMenu,
  };
}
