import { AlertCircle, Umbrella } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useVacationPayData } from "../lib/hooks";
import { Skeleton } from "./ui/skeleton";

interface VacationPayOverviewProps {
  companyName?: string;
  initialYear?: number;
}

export interface VacationPayOverviewRef {
  refresh: () => void;
}

const VacationPayOverview = forwardRef<VacationPayOverviewRef, VacationPayOverviewProps>(
  ({ companyName, initialYear }, ref) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(initialYear || currentYear);
    
    const { 
      vacationPayData, 
      loading, 
      error, 
      formatCurrency,
      refreshVacationPayData
    } = useVacationPayData(companyName, selectedYear);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: refreshVacationPayData
    }));

    // Force refresh when company or year changes
    useEffect(() => {
      refreshVacationPayData();
    }, [companyName, selectedYear, refreshVacationPayData]);

    // Generate array of years for dropdown (current year and 4 previous years)
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
      <div className="w-full rounded-lg border-2 border-gray-200 p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-bold sm:text-2xl md:text-2xl lg:text-3xl text-accent">
            Total Vacation Pay
          </h2>
          
          <div className="mt-2 sm:mt-0">
            <select 
              className="p-2 border rounded-md text-sm" 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              disabled={loading || !companyName}
              aria-label="Select year"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {!companyName ? (
          <div className="text-center p-6 text-gray-500">
            Please select a job to view vacation pay details
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 rounded-md border border-red-200 bg-red-50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle size={18} />
              <span className="font-semibold">Error</span>
            </div>
            <p>{error}</p>
            <button 
              onClick={refreshVacationPayData} 
              className="mt-3 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !vacationPayData ? (
          <div className="text-center p-6 text-gray-500">
            No vacation pay information available for this job
          </div>
        ) : (
          <div className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="rounded-full p-3 bg-indigo-500">
              <Umbrella size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vacation Pay for {selectedYear}</p>
              <p className="text-2xl font-semibold">{formatCurrency(vacationPayData.vacationPay)}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VacationPayOverview.displayName = "VacationPayOverview";

export default VacationPayOverview; 