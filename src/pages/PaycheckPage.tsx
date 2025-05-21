import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaycheckOverview, { PaycheckOverviewRef } from "../components/PaycheckOverview";
import WorkshiftModal from "../components/WorkshiftModal";
import WorkshiftTable from "../components/WorkshiftTable";
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
import { useWorkshifts } from "../lib/hooks/useWorkshifts";

export default function Paycheck() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { jobs, selectedJobId, setSelectedJobId, loading } = usePaycheck();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Reference to the paycheck overview component for refreshing
  const paycheckOverviewRef = useRef<PaycheckOverviewRef>(null);

  // Function to refresh the paycheck data
  const refreshPaycheckData = () => {
    paycheckOverviewRef.current?.refresh();
  };

  // Set the selected job when URL param exists
  useEffect(() => {
    if (companyName && jobs.some((job) => job.companyName === companyName)) {
      setSelectedJobId(companyName);
    }
  }, [companyName, jobs, setSelectedJobId]);

  // Check if a job is selected
  const hasSelectedJob =
    selectedJobId !== undefined && selectedJobId !== null && selectedJobId !== "";

  // Use the workshifts custom hook
  const {
    workshifts,
    loadingWorkshifts,
    error,
    isModalOpen,
    setIsModalOpen,
    editingWorkshiftId,
    handleDeleteWorkshift,
    handleAddNewWorkshift,
    handleEditWorkshift,
    handleWorkshiftSaved,
  } = useWorkshifts(selectedJobId, refreshPaycheckData);

  // Generate month options for the select dropdown
  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Refresh paycheck data when selectedJobId or month changes
  useEffect(() => {
    if (hasSelectedJob) {
      refreshPaycheckData();
    }
  }, [selectedMonth, hasSelectedJob, selectedJobId, refreshPaycheckData]);

  return (
    <section>
      <div className="h-full px-4 pb-8 sm:px-6 md:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10 lg:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={["Here is your latest Paycheck overview."]}
              accentWords={["latest", "Paycheck"]}
              className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={["Select a Job to view your latest paycheck."]}
              className="mb-4 text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            />
          </div>
        </div>
        <div className="my-4 sm:my-5">
          <div className="mb-6 border-b border-black pb-6 sm:mb-8 sm:pb-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <AnimatedText
                  phrases={["Select Job"]}
                  accentWords={["Select", "Job"]}
                  className="mb-3 block text-xl font-semibold sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl"
                  accentClassName="text-accent"
                />

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
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

                  <div className="flex gap-2">
                    {hasSelectedJob && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/jobs/${selectedJobId}`)}
                        className="whitespace-nowrap"
                      >
                        Edit Job Details
                      </Button>
                    )}

                    {hasSelectedJob && (
                      <Button
                        variant="submit"
                        onClick={() => navigate(`/paycheck-compare/${selectedJobId}`)}
                        className="whitespace-nowrap"
                      >
                        Compare With Actual Paycheck
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {hasSelectedJob && (
                <div>
                  <p className="mb-2 text-sm text-gray-600">Select Month</p>
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => setSelectedMonth(Number(value))}
                  >
                    <SelectTrigger className="w-full max-w-[200px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8 xl:gap-[100px]">
            <div className="w-full rounded-lg border-2 border-gray-200 p-3 sm:p-4 md:p-5">
              <AnimatedText
                phrases={["Overview of workshift"]}
                accentWords={["Overview of workshift"]}
                className="mb-4 text-xl font-bold sm:text-2xl md:text-2xl lg:text-3xl"
                accentClassName="text-accent"
              />

              <div className="mb-4 flex justify-end">
                {hasSelectedJob ? (
                  <Button
                    onClick={handleAddNewWorkshift}
                    className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs text-white transition-colors duration-200 hover:bg-accent/90 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <Plus size={14} className="sm:size-7" />
                    Add New Workshift
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex items-center gap-1 text-xs opacity-70 sm:gap-2 sm:text-sm"
                  >
                    <Plus size={14} className="sm:size-7" />
                    Select a job to add workshift
                  </Button>
                )}
              </div>

              {/* Workshift Table Component */}
              <WorkshiftTable
                workshifts={workshifts}
                loadingWorkshifts={loadingWorkshifts}
                error={error}
                hasSelectedJob={hasSelectedJob}
                selectedJobId={selectedJobId}
                onEditWorkshift={handleEditWorkshift}
                onDeleteWorkshift={handleDeleteWorkshift}
              />
            </div>

            {/* Paycheck Overview Component */}
            <PaycheckOverview
              ref={paycheckOverviewRef}
              companyName={selectedJobId}
              month={selectedMonth}
            />
          </div>
        </div>
      </div>

      {/* Workshift Modal */}
      {hasSelectedJob && (
        <WorkshiftModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobId={selectedJobId}
          workshiftId={editingWorkshiftId}
          onWorkshiftSaved={handleWorkshiftSaved}
        />
      )}
    </section>
  );
}
