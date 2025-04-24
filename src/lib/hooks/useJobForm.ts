import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Job } from '../../components/Job';
import { jobService } from '../../services/jobService';

/**
 * Hook for managing job form state and operations
 */
export function useJobForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job>({ id: '' });
  const [isNewJob, setIsNewJob] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  // Get job display name from either title or companyName
  const getJobDisplayName = (): string => {
    if (job.title) return job.title;
    if (job.companyName) return job.companyName;
    return '';
  };

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        if (!id || id === 'new') {
          setIsNewJob(true);
          // Generate a random ID for new jobs
          setJob({ 
            id: `job_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` 
          });
          setSelectedWeekdays([]);
        } else {
          setIsNewJob(false);
          const jobData = await jobService.getJobById(id);
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
            console.error(`Job with id ${id} not found`);
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setJob(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (value ? parseFloat(value) : 0) : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setJob(prev => ({ ...prev, [name]: value }));
  };

  // Handle weekday checkbox change
  const handleWeekdayChange = (weekday: string) => {
    setSelectedWeekdays(prev => {
      if (prev.includes(weekday)) {
        return prev.filter(day => day !== weekday);
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
        id: job.id || `job_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        weekdays: selectedWeekdays,
        // For backward compatibility
        weekday: selectedWeekdays.length > 0 ? selectedWeekdays.join(', ') : undefined
      };
      
      if (isNewJob) {
        await jobService.createJob(jobToSave);
      } else {
        await jobService.updateJob(jobToSave.id, jobToSave);
      }
      
      // Navigate back to the jobs list
      navigate('/');
    } catch (error) {
      console.error('Error saving job:', error);
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
    handleSubmit
  };
} 