import { useEffect, useState } from "react";
import { WorkShift } from "../lib/hooks/useWorkshiftForm";
import { formatDateForInput } from "../lib/utils/dateTimeUtils";
import { workshiftService } from "../services/workshiftService";
import { Button } from "./ui/button";
import { confirmationDialogService } from "./ui/confirmation-dialog";
import { Dialog } from "./ui/dialog";
import { Input } from "./ui/input";
import { toastService } from "./ui/toast";

interface WorkshiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  workshiftId?: string;
  onWorkshiftSaved: () => void;
}

export default function WorkshiftModal({ isOpen, onClose, jobId, workshiftId, onWorkshiftSaved }: WorkshiftModalProps) {
  const [workshift, setWorkshift] = useState<WorkShift>({
    startTime: new Date(),
    endTime: new Date(),
    jobId: jobId,
  });
  const [isNewWorkshift, setIsNewWorkshift] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load workshift data if editing
  useEffect(() => {
    const fetchWorkshift = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        if (!workshiftId) {
          // Initialize empty workshift for new
          const now = new Date();
          // Set default end time to 1 hour after start time
          const endTime = new Date(now);
          endTime.setHours(now.getHours() + 1);
          
          setWorkshift({
            startTime: now,
            endTime: endTime,
            jobId: jobId,
          });
          setIsNewWorkshift(true);
        } else {
          setIsNewWorkshift(false);
          try {
            const workshiftData = await workshiftService.getWorkshiftById(workshiftId);
            if (workshiftData) {
              // Ensure the jobId is set
              if (jobId && !workshiftData.jobId) {
                workshiftData.jobId = jobId;
              }
              
              // Ensure dates are properly parsed
              workshiftData.startTime = new Date(workshiftData.startTime);
              workshiftData.endTime = new Date(workshiftData.endTime);
              
              setWorkshift(workshiftData);
            } else {
              console.error(`Workshift with id ${workshiftId} not found`);
              onClose();
            }
          } catch (error) {
            console.error("Error fetching workshift:", error);
            onClose();
          }
        }
      } catch (error) {
        console.error("Error initializing workshift form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshift();
  }, [isOpen, workshiftId, jobId, onClose]);

  const handleDateTimeChange = (name: string, valueStr: string) => {
    try {
      // The valueStr format is YYYY-MM-DDThh:mm from datetime-local input
      // Parse each component and create a local date
      const [datePart, timePart] = valueStr.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Create the date using local components (no timezone conversion)
      const date = new Date();
      date.setFullYear(year);
      date.setMonth(month - 1); // Month is 0-indexed in JavaScript
      date.setDate(day);
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      date.setMilliseconds(0);
      
      // Update the workshift with the correct local time
      setWorkshift((prev) => ({
        ...prev,
        [name]: date,
      }));
    } catch (error) {
      console.error(`Error parsing date ${name}:`, error);
    }
  };

  const handleDelete = async () => {
    if (!workshiftId) return;

    const confirmed = await confirmationDialogService.confirm({
      title: "Delete Workshift",
      message: `Are you sure you want to delete this workshift? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      await workshiftService.deleteWorkshift(workshiftId);
      toastService.success("Workshift deleted successfully");
      onWorkshiftSaved();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      toastService.error("Failed to delete workshift. Please try again.");
    }
  };

  const validateWorkshiftTimes = (): boolean => {
    if (workshift.endTime <= workshift.startTime) {
      toastService.error("End time must be after start time");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate times
    if (!validateWorkshiftTimes()) {
      return;
    }
    
    setIsSaving(true);

    try {
      if (isNewWorkshift) {
        await workshiftService.createWorkshift(workshift);
        toastService.success("Workshift created successfully");
      } else {
        await workshiftService.updateWorkshift(workshiftId!, workshift);
        toastService.success("Workshift updated successfully");
      }

      onWorkshiftSaved();
      onClose();
    } catch (error) {
      console.error("Error saving workshift:", error);
      toastService.error(isNewWorkshift 
        ? "Failed to create workshift. Please try again."
        : "Failed to update workshift. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const title = isNewWorkshift 
    ? `Add New Workshift for ${jobId}` 
    : `Edit Workshift for ${jobId}`;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      {isLoading ? (
        <div className="py-4 text-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Id - Hidden */}
          <input type="hidden" name="jobId" value={workshift.jobId} />

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <Input
              type="datetime-local"
              value={formatDateForInput(workshift.startTime)}
              onChange={(e) => handleDateTimeChange("startTime", e.target.value)}
              className="mt-1"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <Input
              type="datetime-local"
              value={formatDateForInput(workshift.endTime)}
              onChange={(e) => handleDateTimeChange("endTime", e.target.value)}
              className="mt-1"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isNewWorkshift ? "Create Workshift" : "Update Workshift"}
            </Button>
            {!isNewWorkshift && (
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      )}
    </Dialog>
  );
} 