import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Job } from "../../components/Job";
import { jobService } from "../../services/jobService";

/**
 * Hook for managing job form state and operations
 */
export function useJobForm() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job>({
    Title: "",
    CompanyName: "",
    HourlyRate: 0,
    EmploymentType: "",
    TaxCard: "",
  });
  const [isNewJob, setIsNewJob] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  // Get job display name from Company Name
  const getJobDisplayName = (): string => {
    return job.CompanyName || "";
  };

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        if (!companyName || companyName === "new") {
          // Initialize empty job for new job form
          setJob({
            Title: "",
            CompanyName: "",
            HourlyRate: 0,
            EmploymentType: "",
            TaxCard: "",
          });
          setSelectedWeekdays([]);
        } else {
          setIsNewJob(false);
          const jobData = await jobService.getJobByCompanyName(companyName);
          if (jobData) {
            // Use the fetched job data
            setJob(jobData);

            // Initialize selected weekdays
            if (jobData.weekdays && jobData.weekdays.length > 0) {
              setSelectedWeekdays(jobData.weekdays);
            } else if (jobData.weekday) {
              setSelectedWeekdays([jobData.weekday]);
            } else {
              setSelectedWeekdays([]);
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
    const fieldName =
      name === "companyName"
        ? "CompanyName"
        : name === "hourlyRate"
          ? "HourlyRate"
          : name === "employmentType"
            ? "EmploymentType"
            : name === "taxCardType"
              ? "TaxCard"
              : name === "Title"
                ? "Title"
                : name;

    setJob((prev) => ({
      ...prev,
      [fieldName]: type === "number" ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Map field names to backend model properties
    const fieldMap: Record<string, string> = {
      taxCardType: "TaxCard",
      employmentType: "EmploymentType",
    };

    const fieldName = fieldMap[name] || name;

    setJob((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle weekday checkbox change
  const handleWeekdayChange = (weekday: string) => {
    setSelectedWeekdays((prev) => {
      if (prev.includes(weekday)) {
        return prev.filter((day) => day !== weekday);
      } else {
        return [...prev, weekday];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Ensure required fields are present
      const jobToSave: Job = {
        ...job,
        weekdays: selectedWeekdays,
        // For backward compatibility
        weekday: selectedWeekdays.length > 0 ? selectedWeekdays.join(", ") : undefined,
      };

      if (isNewJob) {
        await jobService.registerJob(jobToSave);
      } else {
        await jobService.updateJob(jobToSave);
      }

      // Navigate back to the jobs list
      navigate("/");
    } catch (error) {
      console.error("Error saving job:", error);
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
  };
}
