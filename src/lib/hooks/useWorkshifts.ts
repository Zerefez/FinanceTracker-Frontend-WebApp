import { useEffect, useState } from "react";
import { confirmationDialogService } from "../../components/ui/confirmation-dialog";
import { toastService } from "../../components/ui/toast";
import { workshiftService } from "../../services/workshiftService";
import { WorkShift } from "./useWorkshiftForm";

export const useWorkshifts = (
  selectedJobId: string | undefined,
  onWorkshiftUpdated?: () => void
) => {
  const [workshifts, setWorkshifts] = useState<WorkShift[]>([]);
  const [loadingWorkshifts, setLoadingWorkshifts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshiftId, setEditingWorkshiftId] = useState<string | undefined>(undefined);

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
      
      // Notify that workshifts have been updated
      if (onWorkshiftUpdated) {
        onWorkshiftUpdated();
      }
    } catch (error) {
      console.error("Error deleting workshift:", error);
      toastService.error("Failed to delete workshift");
    }
  };

  // Open the modal to add a new workshift
  const handleAddNewWorkshift = () => {
    if (!selectedJobId) {
      toastService.error("Please select a job before adding a workshift");
      return;
    }
    
    setEditingWorkshiftId(undefined); // No ID means new workshift
    setIsModalOpen(true);
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
        .then(data => {
          setWorkshifts(data);
          // Notify that workshifts have been updated
          if (onWorkshiftUpdated) {
            onWorkshiftUpdated();
          }
        })
        .catch(error => {
          console.error("Error reloading workshifts:", error);
          toastService.error("Failed to refresh workshifts.");
        });
    }
  };

  return {
    workshifts,
    loadingWorkshifts,
    error,
    isModalOpen,
    setIsModalOpen,
    editingWorkshiftId,
    handleDeleteWorkshift,
    handleAddNewWorkshift,
    handleEditWorkshift,
    handleWorkshiftSaved
  };
}; 