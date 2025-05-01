import { useNavigate, useParams } from "react-router-dom";
import { confirmationDialogService } from "../../components/ui/confirmation-dialog";
import { apiService } from "../../services/apiService";
import { toastService } from "../../components/ui/toast";

import { useState } from "react";
export function useWorkshiftForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [workshift, setWorkshift] = useState<any>({
    startTime: new Date(),
    endTime: new Date(),
  });

  const [isNewWorkshift, setIsNewJob] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (companyName: string, e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = await confirmationDialogService.confirm({
      title: "Delete Workshift",
      message: `Are you sure you want to delete the workshift at ${companyName}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      await apiService.delete("/");

      // Remove workdays from local storage

      // Show success notification
      toastService.success("Job deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      toastService.error("Failed to delete job. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {};
}
