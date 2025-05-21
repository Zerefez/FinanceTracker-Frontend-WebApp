import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaycheckCompare from "../components/PaycheckCompare";
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
import { usePaycheckData } from "../lib/hooks/usePaycheckData";

export default function PaycheckComparePage() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { jobs, selectedJobId, setSelectedJobId, loading } = usePaycheck();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Use the paycheck data hook to get the generated paycheck
  const {
    paycheckData,
    loading: loadingPaycheck,
    refreshPaycheckData,
  } = usePaycheckData(selectedJobId, selectedMonth);

  // Handle reset
  const handleReset = () => {
    refreshPaycheckData();
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

  return (
    <section>
      <div className="h-full px-4 pb-8 sm:px-6 md:px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10 lg:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={["Compare your actual paycheck with the generated paycheck."]}
              accentWords={["Compare", "actual", "generated"]}
              className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={["Input values from your real paycheck and see the difference."]}
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

                  {hasSelectedJob && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/paycheck`)}
                      className="whitespace-nowrap"
                    >
                      View Paycheck
                    </Button>
                  )}
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

          {/* Paycheck Compare Component */}
          <PaycheckCompare
            generatedPaycheck={paycheckData}
            onReset={handleReset}
            loading={loadingPaycheck}
            hasSelectedJob={hasSelectedJob}
          />
        </div>
      </div>
    </section>
  );
}
