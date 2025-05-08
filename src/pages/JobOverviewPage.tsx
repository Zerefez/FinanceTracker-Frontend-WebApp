// src/pages/JobOverviewPage.tsx
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedText from "../components/ui/animation/animatedText";
import { useJobs, useLocalization } from "../lib/hooks";

export interface SupplementDetail {
  weekday: number;
  amount: number;
  startTime: string;
  endTime: string;
}

export interface Job {
  companyName: string;
  hourlyRate: number;
  employmentType: string;
  taxCard: string;
  // Keep Title for backward compatibility with existing components
  title?: string;
  // Optional fields for UI that don't exist in backend
  weekdays?: string[];
  weekday?: string;
  startTime?: string;
  endTime?: string;
  // Additional optional fields for display
  startDate?: string;
  endDate?: string;
  // Supplement details
  supplementDetails?: SupplementDetail[];
}

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

export default function JobOverviewPage() {
  const { jobs, loading } = useJobs();
  const { t } = useLocalization();

  return (
    <section>
      <div className="h-full md:px-6">
        <div className="w-full p-5 border-2 border-gray-200 rounded-lg">
          <div className="flex items-baseline justify-between mb-4">
            <AnimatedText
              phrases={[t("home.jobsOverview")]}
              accentWords={["Jobs"]}
              className="mb-4 text-2xl font-bold text-center md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />

            <Link
              to="/jobs/new"
              className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-accent hover:bg-accent/90"
            >
              <Plus className="inline w-5 h-5 mr-1" /> {t("home.addNewJob")}
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">{t("home.loading")}</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500">{t("home.noJobs")}</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">{t("home.table.companyName")}</th>
                    <th className="px-4 py-3">{t("home.table.title")}</th>
                    <th className="px-4 py-3">{t("home.table.hourlyRate")}</th>
                    <th className="px-4 py-3">{t("home.table.employmentType")}</th>
                    <th className="px-4 py-3">{t("home.table.taxCard")}</th>
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
                      <td className="px-4 py-3">
                        {job.hourlyRate} {t("home.table.currency")}
                      </td>
                      <td className="px-4 py-3">{job.employmentType}</td>
                      <td className="px-4 py-3">{job.taxCard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
