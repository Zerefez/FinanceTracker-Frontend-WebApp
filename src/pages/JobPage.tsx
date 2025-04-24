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
                  Edit Job:{" "}
                  <span className="text-accent">{job.companyName || job.company || ""}</span>
                </React.Fragment>,
              ]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          )}

          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job ID - Hidden */}
              <input type="hidden" name="id" value={job.id} />

              {/* Title (if it exists from older job format) */}
              {job.title && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <Input
                    name="title"
                    value={job.title || ""}
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
                  value={job.companyName || job.company || ""}
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
                  value={job.cvr || ""}
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
                  value={job.taxCardType || ""}
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

              {/* Weekdays */}
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

              {/* Start/End Time */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <Input
                    name="startTime"
                    type="time"
                    value={job.startTime || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <Input
                    name="endTime"
                    type="time"
                    value={job.endTime || ""}
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
                  value={job.supplementAmount || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center space-x-4">
                <div>
                  {!isNewJob && job.id && (
                    <Button
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(`/paycheck/${job.id}`)}
                    >
                      Go to This Job Paycheck
                    </Button>
                  )}
                </div>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving} variant="submit">
                    {isSaving ? "Saving..." : isNewJob ? "Create Job" : "Update Job"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
