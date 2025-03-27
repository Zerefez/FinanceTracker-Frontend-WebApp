import { useState } from "react";
import Inner from "../components/Inner";
import PDFUploadComponent from "../components/PDFUpload";
import AnimatedText from "../components/ui/animatedText";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Job } from "../types/Job";

export default function Paycheck() {
  // Mock job data - in a real app, this would come from an API
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Nvidia Inc.',
      startDate: 'January 2023',
      endDate: 'Present'
    },
    {
      id: '2',
      title: 'Data Analyst',
      company: 'Data Insights LLC',
      startDate: 'June 2022',
      endDate: 'December 2022'
    }
  ];

  const [selectedJobId, setSelectedJobId] = useState<string>('');

  return (
    <section>
      <Inner>
        <div className="mx-8 px-4 md:px-6 h-full">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
            <div className="w-full ">
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
                className="mb-4 text-2xl block font-semibold md:text-3xl lg:text-4xl"
                accentClassName="text-accent"
              />

              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
              <div className="w-[50wh] rounded-lg border-2 border-gray-200 p-5">
                <AnimatedText
                  phrases={["Latest generated paycheck"]}
                  accentWords={["Latest generated paycheck"]}
                  className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
                  accentClassName="text-accent"
                />
                <PDFUploadComponent 
                  title="Latest Generated Paycheck" 
                  type="generated" 
                  jobId={selectedJobId}
                  jobs={jobs}
                />
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
          </div>
        </div>
      </Inner>
    </section>
  );
}
