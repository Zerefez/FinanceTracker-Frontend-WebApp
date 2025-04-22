// src/pages/jobs/[id].tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Job } from '../components/Job';
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { jobService } from '../services/jobService';

// Weekday options
const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Tax card types
const taxCardTypes = [
  "Main card", "Secondary card", "Exemption card"
];

// Employment types
const employmentTypes = [
  "Full-time", "Part-time", "Temporary", "Contract", "Freelance"
];

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job>({
    id: ''
    // Other fields will be added when needed
  });
  
  const [isNewJob, setIsNewJob] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for weekday selection
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="pb-12">
      <div className="md:px-6 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {isNewJob ? (
            <AnimatedText
              phrases={['Add New Job']}
              className="mb-4 text-4xl font-bold text-center"
              accentClassName="text-accent"
            />
          ) : (
            <AnimatedText
              phrases={[
                <React.Fragment key="edit-phrase">
                  Edit Job: <span className="text-accent">{job.companyName || job.company || ''}</span>
                </React.Fragment>
              ]}
              className="mb-4 text-4xl font-bold text-center"
              accentClassName="text-accent"
            />
          )}
          
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job ID - Hidden */}
              <input type="hidden" name="id" value={job.id} />
              
              {/* Title (if it exists from older job format) */}
              {job.title && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <Input 
                    name="title"
                    value={job.title || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              )}
              
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <Input 
                  name="companyName"
                  value={job.companyName || job.company || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              
              {/* CVR */}
              <div>
                <label className="block text-sm font-medium text-gray-700">CVR</label>
                <Input 
                  name="cvr"
                  value={job.cvr || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                  pattern="[0-9]{8}"
                  title="CVR must be 8 digits"
                />
              </div>
              
              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <Input 
                  name="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={job.hourlyRate || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              
              {/* Tax Card Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax Card Type</label>
                <Select 
                  value={job.taxCardType || ''} 
                  onValueChange={(value) => handleSelectChange('taxCardType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select tax card type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxCardTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <Select 
                  value={job.employmentType || ''} 
                  onValueChange={(value) => handleSelectChange('employmentType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Weekday Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workdays</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekdays.map(day => (
                    <Checkbox
                      key={day}
                      id={`weekday-${day}`}
                      label={day}
                      checked={selectedWeekdays.includes(day)}
                      onChange={() => handleWeekdayChange(day)}
                    />
                  ))}
                </div>
                {selectedWeekdays.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select at least one workday
                  </p>
                )}
              </div>
              
              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <Input 
                    name="startTime"
                    type="time"
                    value={job.startTime || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <Input 
                    name="endTime"
                    type="time"
                    value={job.endTime || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              {/* Supplement Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplement Amount</label>
                <Input 
                  name="supplementAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={job.supplementAmount || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-accent text-white hover:bg-accent/80"
                >
                  {isSaving ? 'Saving...' : (isNewJob ? 'Add Job' : 'Update Job')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}