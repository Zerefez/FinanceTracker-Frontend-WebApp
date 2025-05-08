import { Link } from "react-router-dom";
import SUSection from "../components/SU";
import AnimatedText from "../components/ui/animation/animatedText";
import { useJobs, useLocalization } from "../lib/hooks";
import { Job } from "./JobOverviewPage";

// Weekday options for reference
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Helper function to format weekdays
const formatWeekdays = (job: Job): string => {
  if (job.weekdays && job.weekdays.length > 0) {
    if (job.weekdays.length === weekdays.length) {
      return "All weekdays";
    } else if (job.weekdays.length > 2) {
      return `${job.weekdays[0]}-${job.weekdays[job.weekdays.length - 1]}`;
    } else {
      return job.weekdays.join(", ");
    }
  } else if (job.weekday) {
    return job.weekday;
  }
  return "";
};

export default function Home() {
  const { jobs, loading } = useJobs();
  const { t } = useLocalization();

  return (
    <section>
      <div className="h-full md:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={[t('home.welcome')]}
              accentWords={["finance", "tracker"]}
              className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={[t('home.subtitle1'), t('home.subtitle2')]}
              accentWords={["economy"]}
              className="mb-4 text-2xl md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />
          </div>
        </div>
        <div className="my-5 grid grid-cols-1 items-center gap-[100px] md:my-10 md:grid-cols-2 md:items-start md:gap-20">
          <div className="w-full rounded-lg border-2 border-gray-200 p-5">
            <AnimatedText
              phrases={[t('home.jobsOverview')]}
              accentWords={["Jobs"]}
              className="mb-4 text-center text-2xl font-bold md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />
            <div className="mb-4 flex justify-end">
              <Link
                to="/jobs/new"
                className="rounded-lg bg-accent px-4 py-2 text-white transition-colors duration-200 hover:bg-accent/90"
              >
                {t('home.addNewJob')}
              </Link>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">{t('home.loading')}</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-500">{t('home.noJobs')}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full table-auto text-left text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                    <tr>
                      <th className="px-4 py-3">{t('home.table.companyName')}</th>
                      <th className="px-4 py-3">{t('home.table.title')}</th>
                      <th className="px-4 py-3">{t('home.table.hourlyRate')}</th>
                      <th className="px-4 py-3">{t('home.table.employmentType')}</th>
                      <th className="px-4 py-3">{t('home.table.taxCard')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.companyName} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-accent">
                          <Link to={`/jobs/${job.companyName}`} className="hover:underline">
                            {job.companyName}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{job.title}</td>
                        <td className="px-4 py-3">{job.hourlyRate} {t('home.table.currency')}</td>
                        <td className="px-4 py-3">{job.employmentType}</td>
                        <td className="px-4 py-3">{job.taxCard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <SUSection />
        </div>
      </div>
    </section>
  );
}
