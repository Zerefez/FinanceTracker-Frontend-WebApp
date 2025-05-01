import { useState } from "react";
import { useJobs } from "./useJobs";

/**
 * Hook for managing paycheck data and job selection
 */
export function usePaycheck() {
  const { jobs, loading } = useJobs();
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectedJob = jobs.find((job) => job.companyName === selectedCompanyName) || null;

  const handleJobSelect = (companyName: string) => {
    setSelectedCompanyName(companyName);
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
