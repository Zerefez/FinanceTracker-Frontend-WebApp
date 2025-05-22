import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { confirmationDialogService } from "../../components/ui/confirmation-dialog";
import { toastService } from "../../components/ui/toast";
import { workshiftService } from "../../services/workshiftService";
import { usePaycheck } from "./usePaycheck";

export interface WorkShift {
  startTime: Date;
  endTime: Date;
  userId?: string;
  jobId?: string; // Storing the company name as jobId
}

export function useWorkshiftForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedJobId } = usePaycheck();

  // Extract jobId from query parameters if present
  const query = new URLSearchParams(location.search);
  const jobIdFromUrl = query.get("jobId");

  // Use jobId from URL if available, otherwise try to use the one from context
  const effectiveJobId = jobIdFromUrl || selectedJobId || "";

  const [workshift, setWorkshift] = useState<WorkShift>({
    startTime: new Date(),
    endTime: new Date(),
    jobId: effectiveJobId,
  });

  const [isNewWorkshift, setIsNewWorkshift] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if a job is selected - check both the URL parameter and the context
  const hasSelectedJob = effectiveJobId !== "";

  // Update jobId when effectiveJobId changes
  useEffect(() => {
    if (effectiveJobId) {
      setWorkshift((prev) => ({
        ...prev,
        jobId: effectiveJobId,
      }));
    }
  }, [effectiveJobId]);

  useEffect(() => {
    const fetchWorkshift = async () => {
      setIsLoading(true);
      try {
        if (!id || id === "new") {
          // Initialize empty workshift for new workshift form
          setWorkshift({
            startTime: new Date(),
            endTime: new Date(),
            jobId: effectiveJobId,
          });
        } else {
          setIsNewWorkshift(false);
          try {
            const workshiftData = await workshiftService.getWorkshiftById(id);
            if (workshiftData) {
              // If we have jobId from URL and the workshift doesn't have one, add it
              if (effectiveJobId && !workshiftData.jobId) {
                workshiftData.jobId = effectiveJobId;
              }
              setWorkshift(workshiftData);
            } else {
              console.error(`Workshift with id ${id} not found`);
              navigate("/paycheck");
            }
          } catch (error) {
            console.error("Error fetching workshift:", error);
            navigate("/paycheck");
          }
        }
      } catch (error) {
        console.error("Error initializing workshift form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshift();
  }, [id, navigate, effectiveJobId]);

  const handleInputChange = (name: string, value: any) => {
    setWorkshift((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (name: string, value: Date | null) => {
    if (value) {
      setWorkshift((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = await confirmationDialogService.confirm({
      title: "Delete Workshift",
      message: `Are you sure you want to delete this workshift? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      await workshiftService.deleteWorkshift(id!);

      // Show success notification
      toastService.success("Workshift deleted successfully");
      navigate("/paycheck");
    } catch (error) {
      console.error("Delete error:", error);
      toastService.error("Failed to delete workshift. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that a job is selected
    if (!hasSelectedJob) {
      toastService.error("Please select a job before saving the workshift");
      // Redirect to paycheck page to select a job
      navigate("/paycheck");
      return;
    }

    setIsSaving(true);

    try {
      if (isNewWorkshift) {
        await workshiftService.createWorkshift(workshift);
        toastService.success("Workshift created successfully");
      } else {
        await workshiftService.updateWorkshift(id!, workshift);
        toastService.success("Workshift updated successfully");
      }

      // Navigate back to paycheck page
      navigate("/paycheck");
    } catch (error) {
      console.error("Error saving workshift:", error);
      toastService.error(
        isNewWorkshift
          ? "Failed to create workshift. Please try again."
          : "Failed to update workshift. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    workshift,
    isNewWorkshift,
    isSaving,
    isLoading,
    selectedJobId: effectiveJobId,
    hasSelectedJob,
    handleInputChange,
    handleDateTimeChange,
    handleSubmit,
    handleDelete,
  };
}
