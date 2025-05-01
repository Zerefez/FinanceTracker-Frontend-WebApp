import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PDFUploadComponent from "../components/PDFUpload";
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

export default function Paycheck() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { jobs, selectedJobId, setSelectedJobId, loading } = usePaycheck();

  // Set the selected job when URL param exists
  useEffect(() => {
    if (companyName && jobs.some((job) => job.companyName === companyName)) {
      setSelectedJobId(companyName);
    }
  }, [companyName, jobs, setSelectedJobId]);

  return (
    <section>
      <div className="h-full md:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={["Here is your latest Paycheck overview."]}
              accentWords={["latest", "Paycheck"]}
              className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={["Select a Job to view your latest paycheck."]}
              className="mb-4 text-2xl font-normal md:text-3xl lg:text-4xl"
            />
          </div>
        </div>
        <div className="my-5">
          <div className="mb-8 border-b border-black pb-8">
            <AnimatedText
              phrases={["Select Job"]}
              accentWords={["Select", "Job"]}
              className="mb-4 block text-2xl font-semibold md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />

            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="w-full md:w-[300px]">
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
          </div>

          <div className="grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <AnimatedText
                phrases={["Overview of workshift"]}
                accentWords={["Overview of workshift"]}
                className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />

              <div className="mb-4 flex justify-end">
                <Link
                  to="/workshift/new"
                  className="rounded-lg bg-accent px-4 py-2 text-white transition-colors duration-200 hover:bg-accent/90"
                >
                  Add New Workshift
                </Link>
              </div>
            </div>
            <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
              <AnimatedText
                phrases={["Latest user upload paycheck"]}
                accentWords={["Latest user upload paycheck"]}
                className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />
              <PDFUploadComponent
                title="Latest User Upload Paycheck"
                type="uploaded"
                jobId={selectedJobId}
                jobs={jobs}
              />
            </div>
          </div>

          {selectedJobId && (
            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={() => navigate(`/jobs/${selectedJobId}`)}>
                Edit Job Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
