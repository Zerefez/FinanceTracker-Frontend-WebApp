// src/pages/jobs/[id].tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useJobForm } from "../lib/hooks";

// Weekday options
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Tax card types
const taxCardTypes = ["Main card", "Secondary card", "Exemption card"];

// Employment types
const employmentTypes = ["Full-time", "Part-time", "Temporary", "Contract", "Freelance"];

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
    handleSubmit,
    handleDelete,
  } = useJobForm();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className="pb-12">
      <div className="min-h-screen md:px-6">
        <div className="mx-auto max-w-2xl">
          {isNewJob ? (
            <AnimatedText
              phrases={["Add New Job"]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          ) : (
            <AnimatedText
              phrases={[
                <React.Fragment key="edit-phrase">
                  Edit or delete Job: <span className="text-accent">{job.companyName || ""}</span>
                </React.Fragment>,
              ]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          )}

          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name as ID - Hidden */}
              <input type="hidden" name="CompanyName" value={job.companyName} />

              {/* Title (if it exists from older job format) */}
              {
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
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
                  Company Name {isNewJob ? "(required)" : "(read-only)"}
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
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
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
                <label className="block text-sm font-medium text-gray-700">Tax Card Type</label>
                <Select
                  value={job.taxCard || ""}
                  onValueChange={(value) => handleSelectChange("taxCardType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select tax card type" />
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
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <Select
                  value={job.employmentType || ""}
                  onValueChange={(value) => handleSelectChange("employmentType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment type" />
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
                <label className="mb-2 block text-sm font-medium text-gray-700">Workdays</label>
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

              {/* Submit Button */}
              <div className="flex items-center justify-between space-x-4">
                <div>
                  {!isNewJob && job.companyName && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/paycheck/${job.companyName}`)}
                    >
                      Go to This Job Paycheck
                    </Button>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Button type="button" variant="destructive" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : isNewJob ? "Create Job" : "Update Job"}
                  </Button>

                  {!isNewJob && (
                    <button
                      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={(e) => handleDelete(job.companyName, e)}
                    >
                      Delete
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
