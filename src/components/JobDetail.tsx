// src/pages/jobs/[id].tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useJobForm, useLocalization } from "../lib/hooks";
import AnimatedText from "./ui/animation/animatedText";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function JobDetail() {
  const navigate = useNavigate();
  const { t } = useLocalization();

  // Define weekdays and employment types using translation keys
  const weekdays = [
    t('jobPage.weekdays.monday'),
    t('jobPage.weekdays.tuesday'),
    t('jobPage.weekdays.wednesday'),
    t('jobPage.weekdays.thursday'),
    t('jobPage.weekdays.friday'),
    t('jobPage.weekdays.saturday'),
    t('jobPage.weekdays.sunday')
  ];

  // Numeric weekday values for supplement details
  const numericWeekdays = [
    { label: t('jobPage.weekdays.monday'), value: 0 },
    { label: t('jobPage.weekdays.tuesday'), value: 1 },
    { label: t('jobPage.weekdays.wednesday'), value: 2 },
    { label: t('jobPage.weekdays.thursday'), value: 3 },
    { label: t('jobPage.weekdays.friday'), value: 4 },
    { label: t('jobPage.weekdays.saturday'), value: 5 },
    { label: t('jobPage.weekdays.sunday'), value: 6 }
  ];

  // Tax card types
  const taxCardTypes = [
    t('jobPage.taxCards.main'),
    t('jobPage.taxCards.secondary'),
    t('jobPage.taxCards.exemption')
  ];

  // Employment types
  const employmentTypes = [
    t('jobPage.employmentTypes.fullTime'),
    t('jobPage.employmentTypes.partTime'),
    t('jobPage.employmentTypes.temporary'),
    t('jobPage.employmentTypes.contract'),
    t('jobPage.employmentTypes.freelance')
  ];

  const {
    job,
    isNewJob,
    isSaving,
    isLoading,
    selectedWeekdays,
    supplementDetails,
    handleInputChange,
    handleSelectChange,
    handleWeekdayChange,
    addSupplementDetail,
    removeSupplementDetail,
    updateSupplementDetail,
    handleSubmit,
    handleDelete,
    error,
  } = useJobForm();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('jobPage.loading')}</p>
      </div>
    );
  }

  // Format ISO date string to local time for input fields
  const formatTimeForInput = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toTimeString().slice(0, 5); // Get HH:MM format
  };

  // Parse local time to ISO date string
  const parseTimeToISO = (timeString: string): string => {
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today.toISOString();
  };

  return (
    <section className="pb-12">
      <div className="min-h-screen md:px-6">
        <div className="mx-auto max-w-2xl">
          {isNewJob ? (
            <AnimatedText
              phrases={[t('jobPage.addNewJob')]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          ) : (
            <AnimatedText
              phrases={[
                <React.Fragment key="edit-phrase">
                  {t('jobPage.editJob')}: <span className="text-accent">{job.companyName || ""}</span>
                </React.Fragment>,
              ]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          )}

          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            {error && (
              <div className="mb-4 rounded bg-red-100 p-2 text-red-700" data-testid="job-error">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6" role="form">
              {/* Company Name as ID - Hidden */}
              <input type="hidden" name="CompanyName" value={job.companyName} />

              {/* Title (if it exists from older job format) */}
              {
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('jobPage.jobTitle')}</label>
                  <Input
                    name="title"
                    value={job.title || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              }

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('jobPage.companyName')} {isNewJob ? t('jobPage.companyNameRequired') : t('jobPage.companyNameReadOnly')}
                </label>
                <Input
                  name="companyName"
                  value={job.companyName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                  required={isNewJob}
                  readOnly={!isNewJob}
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('jobPage.hourlyRate')}</label>
                <Input
                  name="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={job.hourlyRate || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              {/* Tax Card Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('jobPage.taxCardType')}</label>
                <Select
                  value={job.taxCard || ""}
                  onValueChange={(value) => handleSelectChange("taxCardType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t('jobPage.selectTaxCard')} />
                  </SelectTrigger>
                  <SelectContent>
                    {taxCardTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('jobPage.employmentType')}</label>
                <Select
                  value={job.employmentType || ""}
                  onValueChange={(value) => handleSelectChange("employmentType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t('jobPage.selectEmploymentType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weekdays - UI only, not part of backend model */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">{t('jobPage.workdays')}</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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

              {/* Supplement Details Section */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="mb-4 text-lg font-medium">{t('jobPage.supplementDetails')}</h3>
                
                {supplementDetails.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-2">{t('jobPage.noSupplementDetails')}</p>
                ) : (
                  <div className="space-y-4">
                    {supplementDetails.map((detail, index) => (
                      <div key={index} className="border rounded-md p-4 relative">
                        <button 
                          type="button" 
                          className="absolute top-2 right-2 text-red-500"
                          onClick={() => removeSupplementDetail(index)}
                        >
                          ✕
                        </button>
                        
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Weekday */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">{t('jobPage.supplementWeekday')}</label>
                            <Select
                              value={detail.weekday.toString()}
                              onValueChange={(value) => updateSupplementDetail(index, 'weekday', parseInt(value))}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder={t('jobPage.selectWeekday')} />
                              </SelectTrigger>
                              <SelectContent>
                                {numericWeekdays.map((day) => (
                                  <SelectItem key={day.value} value={day.value.toString()}>
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Amount */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">{t('jobPage.supplementAmount')}</label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={detail.amount}
                              onChange={(e) => updateSupplementDetail(index, 'amount', parseFloat(e.target.value))}
                              className="mt-1"
                            />
                          </div>

                          {/* Start Time */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">{t('jobPage.supplementStartTime')}</label>
                            <Input
                              type="time"
                              value={formatTimeForInput(detail.startTime)}
                              onChange={(e) => updateSupplementDetail(index, 'startTime', parseTimeToISO(e.target.value))}
                              className="mt-1"
                            />
                          </div>

                          {/* End Time */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">{t('jobPage.supplementEndTime')}</label>
                            <Input
                              type="time"
                              value={formatTimeForInput(detail.endTime)}
                              onChange={(e) => updateSupplementDetail(index, 'endTime', parseTimeToISO(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-4"
                  onClick={addSupplementDetail}
                >
                  {t('jobPage.addSupplementDetail')}
                </Button>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
                <div className="w-full md:w-auto">
                  {!isNewJob && job.companyName && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={() => navigate(`/paycheck/${job.companyName}`)}
                    >
                      {t('jobPage.goToPaycheck')}
                    </Button>
                  )}
                </div>
                <div className="flex flex-col space-y-2 w-full md:flex-row md:space-y-0 md:space-x-4 md:w-auto">
                  <Button type="button" variant="outline" className="w-full md:w-auto" onClick={() => navigate(-1)}>
                    {t('jobPage.cancel')}
                  </Button>
                  <Button type="submit" variant="submit" className="w-full md:w-auto" disabled={isSaving}>
                    {isSaving ? t('jobPage.saving') : isNewJob ? t('jobPage.createJob') : t('jobPage.updateJob')}
                  </Button>

                  {!isNewJob && (
                    <button
                      className="w-full md:w-auto rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={(e) => handleDelete(job.companyName, e)}
                    >
                      {t('jobPage.delete')}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
