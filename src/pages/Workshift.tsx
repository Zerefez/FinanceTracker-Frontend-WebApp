import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedText from "../components/ui/animation/animatedText";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toastService } from "../components/ui/toast";
import { useWorkshiftForm } from "../lib/hooks";

export default function WorkshiftPage() {
  const navigate = useNavigate();

  const {
    workshift,
    isNewWorkshift,
    isSaving,
    isLoading,
    selectedJobId,
    hasSelectedJob,
    handleInputChange,
    handleDateTimeChange,
    handleSubmit,
    handleDelete,
  } = useWorkshiftForm();

  // Redirect to paycheck page if no job is selected for new workshifts
  useEffect(() => {
    if (isNewWorkshift && !hasSelectedJob) {
      toastService.error("Please select a job before adding a workshift");
      navigate("/paycheck");
    }
  }, [isNewWorkshift, hasSelectedJob, navigate]);

  // Format date for datetime-local input
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show message if no job is selected
  if (!hasSelectedJob) {
    return (
      <section className="pb-12">
        <div className="min-h-screen md:px-6">
          <div className="mx-auto max-w-2xl">
            <AnimatedText
              phrases={["Job Selection Required"]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
            <div className="mt-6 rounded-lg bg-white p-6 shadow-md text-center">
              <p className="mb-6 text-lg">Please select a job before adding a workshift.</p>
              <Button onClick={() => navigate("/paycheck")}>
                Go to Paycheck Page
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-12">
      <div className="min-h-screen md:px-6">
        <div className="mx-auto max-w-2xl">
          {isNewWorkshift ? (
            <AnimatedText
              phrases={[`Add New Workshift for ${selectedJobId}`]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          ) : (
            <AnimatedText
              phrases={[`Edit Workshift for ${selectedJobId}`]}
              className="mb-4 text-center text-4xl font-bold"
              accentClassName="text-accent"
            />
          )}

          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Id - Hidden */}
              <input type="hidden" name="jobId" value={workshift.jobId} />

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <Input
                  type="datetime-local"
                  value={formatDateForInput(workshift.startTime)}
                  onChange={(e) => handleDateTimeChange("startTime", new Date(e.target.value))}
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
                  onChange={(e) => handleDateTimeChange("endTime", new Date(e.target.value))}
                  className="mt-1"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : isNewWorkshift ? "Create Workshift" : "Update Workshift"}
                  </Button>

                  {!isNewWorkshift && (
                    <button
                      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={handleDelete}
                      type="button"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
