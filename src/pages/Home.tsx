import { Link } from 'react-router-dom';
import Inner from "../components/Inner";
import { Job } from "../components/Job";
import SUSection from "../components/SU";
import AnimatedText from "../components/ui/animation/animatedText";

export default function Home() {
  // Mock job data - in a real app, this would come from an API or database
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

  return (
    <section>
      <Inner>
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
              {jobs.length === 0 ? (
                <p className="text-center text-gray-500">No jobs found</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link 
                      key={job.id} 
                      to={`/jobs/${job.id}`}
                      className="block hover:bg-gray-100 border border-gray-200 transition-colors duration-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {job.startDate} - {job.endDate || 'Present'}
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
      </Inner>
    </section>
  );
}