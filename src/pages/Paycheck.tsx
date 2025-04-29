import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PDFUploadComponent from "../components/PDFUpload";
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { usePaycheck } from "../lib/hooks";

export default function Paycheck() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { jobs, selectedJobId, setSelectedJobId, loading } = usePaycheck();

  // Set the selected job when URL param exists
  useEffect(() => {
    if (companyName && jobs.some(job => job.CompanyName === companyName)) {
      setSelectedJobId(companyName);
    }
  }, [companyName, jobs, setSelectedJobId]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <AnimatedText
          phrases={["Paycheck Management"]}
          accentWords={["Paycheck"]}
          className="mb-6 text-center text-3xl font-bold md:text-4xl lg:text-5xl"
          accentClassName="text-accent"
        />
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
          Manage your paychecks for each job. Upload and store your payslips for easy tracking.
        </p>

        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <label className="mb-2 block text-sm font-medium text-gray-700">Select a Job</label>
            <Select
              value={selectedJobId}
              onValueChange={setSelectedJobId}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.CompanyName} value={job.CompanyName}>
                    {job.Title || job.CompanyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => navigate("/jobs/new")}
              variant="outline"
              size="sm"
            >
              Add New Job
            </Button>
          </div>
        </div>

        {selectedJobId ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <PDFUploadComponent
              title="Upload Payslip"
              type="uploaded"
              jobId={selectedJobId}
              jobs={jobs}
            />
            <PDFUploadComponent
              title="Generated Payslip"
              type="generated"
              jobId={selectedJobId}
              jobs={jobs}
            />
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">
              Please select a job to manage its paychecks
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
