import { CalendarIcon, Clock, Edit, Trash } from "lucide-react";
import { WorkShift } from "../lib/hooks/useWorkshiftForm";
import { formatDate, formatTime, getHoursWorked } from "../lib/utils/dateTimeUtils";

interface WorkshiftTableProps {
  workshifts: WorkShift[];
  loadingWorkshifts: boolean;
  error: string | null;
  hasSelectedJob: boolean;
  selectedJobId?: string;
  onEditWorkshift: (index: number) => void;
  onDeleteWorkshift: (index: number) => void;
}

export default function WorkshiftTable({
  workshifts,
  loadingWorkshifts,
  error,
  hasSelectedJob,
  selectedJobId,
  onEditWorkshift,
  onDeleteWorkshift,
}: WorkshiftTableProps) {
  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-0">
      <div className="inline-block min-w-full py-2 align-middle sm:px-0 lg:px-0">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                  Start Time
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                  End Time
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                  Hours
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {!hasSelectedJob ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500 sm:px-6">
                    Please select a job to view workshifts
                  </td>
                </tr>
              ) : loadingWorkshifts ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500 sm:px-6">
                    Loading workshifts...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-red-500 sm:px-6">
                    {error}
                  </td>
                </tr>
              ) : workshifts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500 sm:px-6">
                    No workshifts found for {selectedJobId}. Create your first workshift by clicking "Add New Workshift".
                  </td>
                </tr>
              ) : (
                workshifts.map((workshift, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-4 text-sm text-gray-500 sm:px-6">
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{formatDate(workshift.startTime)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 sm:px-6">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{formatTime(workshift.startTime)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 sm:px-6">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{formatTime(workshift.endTime)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 sm:px-6">
                      {getHoursWorked(workshift.startTime, workshift.endTime)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 sm:px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEditWorkshift(index)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-100"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => onDeleteWorkshift(index)}
                          className="rounded p-1 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 