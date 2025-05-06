import { CalendarIcon, Clock, Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PDFUploadComponent from "../components/PDFUpload";
import WorkshiftModal from "../components/WorkshiftModal";
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from "../components/ui/button";
import { confirmationDialogService } from "../components/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toastService } from "../components/ui/toast";
import { usePaycheck } from "../lib/hooks";
import { WorkShift } from "../lib/hooks/useWorkshiftForm";
import { workshiftService } from "../services/workshiftService";

export default function Paycheck() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { jobs, selectedJobId, setSelectedJobId, loading } = usePaycheck();
  const [workshifts, setWorkshifts] = useState<WorkShift[]>([]);
  const [loadingWorkshifts, setLoadingWorkshifts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshiftId, setEditingWorkshiftId] = useState<string | undefined>(undefined);

  // Set the selected job when URL param exists
  useEffect(() => {
    if (companyName && jobs.some((job) => job.companyName === companyName)) {
      setSelectedJobId(companyName);
    }
  }, [companyName, jobs, setSelectedJobId]);

  // Load workshifts when a job is selected
  useEffect(() => {
    const fetchWorkshifts = async () => {
      if (!selectedJobId) {
        setWorkshifts([]);
        return;
      }

      setLoadingWorkshifts(true);
      setError(null);
      try {
        // Pass the selectedJobId to filter workshifts by job
        const data = await workshiftService.getUserWorkshifts(selectedJobId);
        setWorkshifts(data);
      } catch (error) {
        console.error("Error fetching workshifts:", error);
        setError("Failed to load workshifts. Please try again.");
      } finally {
        setLoadingWorkshifts(false);
      }
    };

    fetchWorkshifts();
  }, [selectedJobId]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate hours worked
  const getHoursWorked = (startTime: Date, endTime: Date): string => {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs.toFixed(2);
  };

  // Handle delete workshift
  const handleDeleteWorkshift = async (index: number) => {
    const confirmed = await confirmationDialogService.confirm({
      title: "Delete Workshift",
      message: `Are you sure you want to delete this workshift? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      await workshiftService.deleteWorkshift(index.toString());
      
      // Update the local state to reflect the deletion
      setWorkshifts(prev => prev.filter((_, i) => i !== index));
      
      toastService.success("Workshift deleted successfully");
    } catch (error) {
      console.error("Error deleting workshift:", error);
      toastService.error("Failed to delete workshift");
    }
  };

  // Check if a job is selected
  const hasSelectedJob = selectedJobId !== undefined && selectedJobId !== null && selectedJobId !== "";

  // Open the modal to add a new workshift
  const handleAddNewWorkshift = () => {
    if (hasSelectedJob) {
      setEditingWorkshiftId(undefined); // No ID means new workshift
      setIsModalOpen(true);
    } else {
      toastService.error("Please select a job before adding a workshift");
    }
  };

  // Open the modal to edit an existing workshift
  const handleEditWorkshift = (index: number) => {
    setEditingWorkshiftId(index.toString());
    setIsModalOpen(true);
  };

  // Refresh workshifts after saving in modal
  const handleWorkshiftSaved = () => {
    if (selectedJobId) {
      // Reload workshifts to show the latest data
      workshiftService.getUserWorkshifts(selectedJobId)
        .then(data => setWorkshifts(data))
        .catch(error => {
          console.error("Error reloading workshifts:", error);
          toastService.error("Failed to refresh workshifts.");
        });
    }
  };

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
                {hasSelectedJob ? (
                  <Button
                    onClick={handleAddNewWorkshift}
                    className="rounded-lg bg-accent px-4 py-2 text-white transition-colors duration-200 hover:bg-accent/90 flex items-center gap-2"
                  >
                    <Plus size={16} />
                  Add New Workshift
                  </Button>
                ) : (
                  <Button disabled className="flex items-center gap-2 opacity-70">
                    <Plus size={16} />
                    Select a job to add workshift
                  </Button>
                )}
              </div>

              {/* Workshift list */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Start Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        End Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Hours
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {!hasSelectedJob ? (
                      <tr>
                        <td colSpan={5} className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                          Please select a job to view workshifts
                        </td>
                      </tr>
                    ) : loadingWorkshifts ? (
                      <tr>
                        <td colSpan={5} className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                          Loading workshifts...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="whitespace-nowrap px-6 py-4 text-center text-sm text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : workshifts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                          No workshifts found for {selectedJobId}. Create your first workshift by clicking "Add New Workshift".
                        </td>
                      </tr>
                    ) : (
                      workshifts.map((workshift, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="mr-2 text-gray-400" />
                              {formatDate(workshift.startTime)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-gray-400" />
                              {formatTime(workshift.startTime)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-gray-400" />
                              {formatTime(workshift.endTime)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {getHoursWorked(workshift.startTime, workshift.endTime)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditWorkshift(index)}
                                className="rounded p-1 text-blue-600 hover:bg-blue-100"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteWorkshift(index)}
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

          {hasSelectedJob && (
            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={() => navigate(`/jobs/${selectedJobId}`)}>
                Edit Job Details
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Workshift Modal */}
      {hasSelectedJob && (
        <WorkshiftModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobId={selectedJobId}
          workshiftId={editingWorkshiftId}
          onWorkshiftSaved={handleWorkshiftSaved}
        />
      )}
    </section>
  );
}
