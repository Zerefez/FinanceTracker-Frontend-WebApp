import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VacationPayOverview, { VacationPayOverviewRef } from "../components/VacationPayOverview";
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { usePaycheck } from "../lib/hooks";

export default function VacationPay() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { jobs, selectedJobId, setSelectedJobId, loading } = usePaycheck();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  
  // Reference to the vacation pay overview component for refreshing
  const vacationPayOverviewRef = useRef<VacationPayOverviewRef>(null);
  
  // Function to refresh the vacation pay data
  const refreshVacationPayData = () => {
    vacationPayOverviewRef.current?.refresh();
  };
  
  // Set the selected job when URL param exists
  useEffect(() => {
    if (companyName && jobs.some((job) => job.companyName === companyName)) {
      setSelectedJobId(companyName);
    }
  }, [companyName, jobs, setSelectedJobId]);

  // Check if a job is selected
  const hasSelectedJob = selectedJobId !== undefined && selectedJobId !== null && selectedJobId !== "";

  // Generate year options for the select dropdown (current year and 4 previous years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  // Refresh vacation pay data when selectedJobId or year changes
  useEffect(() => {
    if (hasSelectedJob) {
      refreshVacationPayData();
    }
  }, [selectedYear, hasSelectedJob, selectedJobId]);

  return (
    <section>
      <div className="h-[100vh] px-4 sm:px-6 md:px-6 pb-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10 lg:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={["Vacation Pay Overview"]}
              accentWords={["Vacation Pay"]}
              className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={["View your total vacation pay for a selected year."]}
              className="mb-4 text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            />
          </div>
        </div>
        <div className="my-4 sm:my-5">
          <div className="mb-6 sm:mb-8 border-b border-black pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <AnimatedText
                  phrases={["Select Job"]}
                  accentWords={["Select", "Job"]}
                  className="mb-3 sm:mb-4 block text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl"
                  accentClassName="text-accent"
                />

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="w-full max-w-[300px]">
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading jobs...
                        </SelectItem>
                      ) : jobs.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No jobs available
                        </SelectItem>
                      ) : (
                        jobs.map((job) => (
                          <SelectItem key={job.companyName} value={job.companyName}>
                            {job.title || job.companyName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  {hasSelectedJob && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/jobs/${selectedJobId}`)}
                      className="whitespace-nowrap"
                    >
                      Edit Job Details
                    </Button>
                  )}
                </div>
              </div>
              
              {hasSelectedJob && (
                <div>
                  <p className="mb-2 text-sm text-gray-600">Select Year</p>
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                    <SelectTrigger className="w-full max-w-[200px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year.value} value={year.value.toString()}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Vacation Pay Overview Component */}
            <VacationPayOverview 
              ref={vacationPayOverviewRef}
              companyName={selectedJobId} 
              initialYear={selectedYear}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
