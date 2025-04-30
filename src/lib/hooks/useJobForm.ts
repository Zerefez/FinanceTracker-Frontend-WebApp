import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Job } from "../../components/Job";
import { confirmationDialogService } from "../../components/ui/confirmation-dialog";
import { toastService } from "../../components/ui/toast";
import { jobService } from "../../services/jobService";
import { localStorageService } from "../../services/localStorageService";
import { useLocalization } from "./useLocalization";

/**
 * Hook for managing job form state and operations
 */
export function useJobForm() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { t } = useLocalization();

  const [job, setJob] = useState<Job>({
    title: "",
    companyName: "",
    hourlyRate: 0,
    employmentType: "",
    taxCard: "",
  });
  const [isNewJob, setIsNewJob] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  // Get job display name from Company Name
  const getJobDisplayName = (): string => {
    return job.companyName || "";
  };

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        if (!companyName || companyName === "new") {
          // Initialize empty job for new job form
          setJob({
            title: "",
            companyName: "",
            hourlyRate: 0,
            employmentType: "",
            taxCard: "",
          });
          setSelectedWeekdays([]);
        } else {
          setIsNewJob(false);
          const jobData = await jobService.getJobByCompanyName(companyName);
          if (jobData) {
            // Use the fetched job data
            setJob(jobData);

            // Load workdays from local storage instead of relying on backend
            const savedWorkdays = localStorageService.getWorkdaysForJob(companyName);
            if (savedWorkdays && savedWorkdays.length > 0) {
              setSelectedWeekdays(savedWorkdays);
            } else {
              // Fallback to any previously stored values if available
              if (jobData.weekdays && jobData.weekdays.length > 0) {
                setSelectedWeekdays(jobData.weekdays);
              } else if (jobData.weekday) {
                setSelectedWeekdays([jobData.weekday]);
              } else {
                setSelectedWeekdays([]);
              }
            }
          } else {
            console.error(`Job with company name ${companyName} not found`);
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [companyName, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // If the input is for companyName, update the CompanyName property
    setJob((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Map field names to backend model properties
    const fieldMap: Record<string, string> = {
      taxCardType: "taxCard",
      employmentType: "employmentType",
    };

    const fieldName = fieldMap[name] || name;

    setJob((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle weekday checkbox change
  const handleWeekdayChange = (weekday: string) => {
    setSelectedWeekdays((prev) => {
      const newWeekdays = prev.includes(weekday)
        ? prev.filter((day) => day !== weekday)
        : [...prev, weekday];
      
      // Save to local storage if we have a company name
      if (job.companyName) {
        localStorageService.saveWorkdaysForJob(job.companyName, newWeekdays);
      }
      
      return newWeekdays;
    });
  };

  const handleDelete = async (companyName: string, e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = await confirmationDialogService.confirm({
      title: t('common.delete'),
      message: t('jobPage.deleteConfirmation', { companyName }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      type: "danger"
    });

    if (!confirmed) return;

    try {
      await jobService.deleteJob(companyName);
      
      // Remove workdays from local storage
      localStorageService.removeWorkdaysForJob(companyName);

      // Show success notification
      toastService.success(t('jobPage.deleteSuccess'));
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      toastService.error(t('jobPage.deleteError'));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create a copy of the job for saving to backend (without workdays)
      const jobToSave: Job = {
        ...job,
        // For backward compatibility only (not used by backend)
        weekday: selectedWeekdays.length > 0 ? selectedWeekdays.join(", ") : undefined,
      };

      let savedJob: Job;
      if (isNewJob) {
        savedJob = await jobService.registerJob(jobToSave);
        toastService.success(t('jobPage.createSuccess'));
      } else {
        savedJob = await jobService.updateJob(jobToSave);
        toastService.success(t('jobPage.updateSuccess'));
      }

      // Save workdays to local storage
      if (savedJob.companyName) {
        localStorageService.saveWorkdaysForJob(savedJob.companyName, selectedWeekdays);
      }

      // Navigate back to the jobs list
      navigate("/");
    } catch (error) {
      console.error("Error saving job:", error);
      toastService.error(isNewJob 
        ? t('jobPage.createError')
        : t('jobPage.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    job,
    isNewJob,
    isSaving,
    isLoading,
    selectedWeekdays,
    getJobDisplayName,
    handleInputChange,
    handleSelectChange,
    handleWeekdayChange,
    handleSubmit,
    handleDelete,
  };
}
