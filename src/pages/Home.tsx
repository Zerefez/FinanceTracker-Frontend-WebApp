import { Link } from 'react-router-dom';
import { Job } from "../components/Job";
import SUSection from "../components/SU";
import AnimatedText from "../components/ui/animation/animatedText";
import { useJobs } from '../lib/hooks';

// Weekday options for reference
const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Helper function to format weekdays
const formatWeekdays = (job: Job): string => {
  if (job.weekdays && job.weekdays.length > 0) {
    if (job.weekdays.length === weekdays.length) {
      return 'All weekdays';
    } else if (job.weekdays.length > 2) {
      return `${job.weekdays[0]}-${job.weekdays[job.weekdays.length - 1]}`;
    } else {
      return job.weekdays.join(', ');
    }
  } else if (job.weekday) {
    return job.weekday;
  }
  return '';
};

export default function Home() {
  const { jobs, loading } = useJobs();

  return (
    <section>
      <div className=" md:px-6 h-full">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={["Welcome to your finance tracker !"]}
              accentWords={["finance", "tracker"]}
              className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={[
                "Keep track of your finances with ease.",
                "Here is your economy overview.",
              ]}
              accentWords={["economy"]}
              className="mb-4 text-2xl md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />
          </div>
        </div>
        <div className="my-5 grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
          <div className="w-full rounded-lg border-2 border-gray-200 p-5">
            <AnimatedText
              phrases={["Jobs Overview"]}
              accentWords={["Jobs"]}
              className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />
            <div className="mb-4 flex justify-end">
              <Link 
                to="/jobs/new"
                className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Add New Job
              </Link>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-500">No jobs found</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link 
                    key={job.CompanyName} 
                    to={`/jobs/${job.CompanyName}`}
                    className="block hover:bg-gray-100 border border-gray-200 transition-colors duration-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{job.Title || job.CompanyName}</h3>
                        <p className="text-gray-600">{job.CompanyName}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {job.startDate ? `${job.startDate} - ${job.endDate || 'Present'}` : 
                         (job.weekdays || job.weekday ? `${formatWeekdays(job)} ${job.startTime}-${job.endTime}` : '')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <SUSection />
        </div>
      </div>
    </section>
  );
}