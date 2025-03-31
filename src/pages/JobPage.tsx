// src/pages/jobs/[id].tsx
import { useParams } from 'react-router-dom';
import Inner from "../components/Inner";
import { Job } from '../components/Job';
import AnimatedText from "../components/ui/animation/animatedText";

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

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();

    // Find the job based on the ID
    const job = jobs.find(j => j.id === id);
  
    if (!job) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500 text-2xl">Job not found</div>
        </div>
      );
    }

  return (
    <section>
      <Inner>
        <div className="mx-8 px-4 md:px-6 h-[100vh] ">
          <div className="max-w-2xl mx-auto">
            <AnimatedText
              phrases={[job.title]}
              className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl text-center"
              accentClassName="text-accent"
            />
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <div className="mb-4">
                <AnimatedText
                  phrases={[job.company]}
                  className="text-2xl font-semibold text-gray-800"
                />
                <p className="text-gray-600">
                  {job.startDate} - {job.endDate || 'Present'}
                </p>
              </div>
              {/* Add more job details here */}
              <div className="mt-6">
                <AnimatedText
                  phrases={["Job Description"]}
                  className="text-xl font-semibold mb-2"
                />
                <AnimatedText
                  phrases={[`Additional job details would be displayed here. In a real application,
                  you would fetch comprehensive job information from your backend`]}
                  className="text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </Inner>
    </section>
  );
}