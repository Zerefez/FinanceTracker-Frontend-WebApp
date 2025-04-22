// src/pages/jobs/[id].tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useJobForm } from '../lib/hooks';

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
  const navigate = useNavigate();
  
  const {
    job,
    isNewJob,
    isSaving,
    isLoading,
    selectedWeekdays,
    handleInputChange,
    handleSelectChange,
    handleWeekdayChange,
    handleSubmit
  } = useJobForm();

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
              
              {/* Weekdays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workdays</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekdays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`weekday-${day}`}
                        checked={selectedWeekdays.includes(day)}
                        onClick={() => handleWeekdayChange(day)}
                      />
                      <label
                        htmlFor={`weekday-${day}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Start/End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <Input 
                    name="startTime"
                    type="time"
                    value={job.startTime || ''}
                    onChange={handleInputChange}
                    className="mt-1"
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
                  />
                </div>
              </div>
              
              {/* Supplement */}
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
              
              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} variant="submit">
                  {isSaving ? 'Saving...' : (isNewJob ? 'Create Job' : 'Update Job')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}