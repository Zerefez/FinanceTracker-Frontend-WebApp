import { Clock, CreditCard, DollarSign, Percent, PiggyBank, Umbrella } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { usePaycheckData } from "../lib/hooks/usePaycheckData";
import { Skeleton } from "./ui/skeleton";

interface PaycheckOverviewProps {
  companyName?: string;
  month?: number;
}

export interface PaycheckOverviewRef {
  refresh: () => void;
}

const PaycheckOverview = forwardRef<PaycheckOverviewRef, PaycheckOverviewProps>(
  ({ companyName, month }, ref) => {
    const { 
      paycheckData, 
      loading, 
      error, 
      formatCurrency, 
      formatPercentage, 
      parseWorkedHours,
      refreshPaycheckData
    } = usePaycheckData(companyName, month);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: refreshPaycheckData
    }));

    // Force refresh when company or month changes
    useEffect(() => {
      refreshPaycheckData();
    }, [companyName, month, refreshPaycheckData]);

    const StatItem = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string, className?: string }) => (
      <div className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className={`rounded-full p-2 ${className}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    );

    return (
      <div className="w-full rounded-lg border-2 border-gray-200 p-3 sm:p-4 md:p-5">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl md:text-2xl lg:text-3xl text-accent">
          Paycheck Overview
        </h2>

        {!companyName ? (
          <div className="text-center p-6 text-gray-500">
            Please select a job to view paycheck details
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : !paycheckData ? (
          <div className="text-center p-6 text-gray-500">
            No paycheck information available for this job
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatItem 
              icon={DollarSign} 
              label="Salary (before tax)" 
              value={formatCurrency(paycheckData.salaryBeforeTax)} 
              className="bg-emerald-500"
            />
            <StatItem 
              icon={DollarSign} 
              label="Salary (after tax)" 
              value={formatCurrency(paycheckData.salaryAfterTax)} 
              className="bg-blue-500"
            />
            <StatItem 
              icon={Percent} 
              label="Tax Rate" 
              value={formatPercentage(paycheckData.tax)} 
              className="bg-red-500"
            />
            <StatItem 
              icon={Clock} 
              label="Hours Worked" 
              value={parseWorkedHours(paycheckData.workedHours)} 
              className="bg-yellow-500"
            />
            <StatItem 
              icon={PiggyBank} 
              label="AM Contribution" 
              value={formatCurrency(paycheckData.amContribution)} 
              className="bg-purple-500"
            />
            <StatItem 
              icon={Umbrella} 
              label="Vacation Pay" 
              value={formatCurrency(paycheckData.vacationPay)} 
              className="bg-indigo-500"
            />
            {paycheckData.pension > 0 && (
              <StatItem 
                icon={CreditCard} 
                label="Pension" 
                value={formatCurrency(paycheckData.pension)} 
                className="bg-cyan-500"
              />
            )}
            {paycheckData.holidaySupplement > 0 && (
              <StatItem 
                icon={CreditCard} 
                label="Holiday Supplement" 
                value={formatCurrency(paycheckData.holidaySupplement)} 
                className="bg-amber-500"
              />
            )}
            {paycheckData.taxDeduction > 0 && (
              <StatItem 
                icon={CreditCard} 
                label="Tax Deduction" 
                value={formatCurrency(paycheckData.taxDeduction)} 
                className="bg-rose-500"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

PaycheckOverview.displayName = "PaycheckOverview";

export default PaycheckOverview; 