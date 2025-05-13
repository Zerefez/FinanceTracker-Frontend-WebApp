import { useEffect, useState } from "react";
import { PaycheckData } from "../../services/paycheckService";

export interface ManualPaycheckData {
  salaryBeforeTax: number;
  salaryAfterTax: number;
  tax: number;
  workedHours: number;
  amContribution: number;
  vacationPay: number;
  pension: number;
  holidaySupplement: number;
  taxDeduction: number;
}

export function usePaycheckCompare(generatedPaycheck: PaycheckData | null) {
  // State for manual paycheck data
  const [manualData, setManualData] = useState<ManualPaycheckData>({
    salaryBeforeTax: 0,
    salaryAfterTax: 0,
    tax: 0,
    workedHours: 0,
    amContribution: 0,
    vacationPay: 0,
    pension: 0,
    holidaySupplement: 0,
    taxDeduction: 0,
  });

  // Reset manual data when generated paycheck changes
  useEffect(() => {
    if (generatedPaycheck) {
      // Pre-populate with generated data to make it easier for comparison
      setManualData({
        salaryBeforeTax: Number(generatedPaycheck.salaryBeforeTax.toFixed(2)),
        salaryAfterTax: Number(generatedPaycheck.salaryAfterTax.toFixed(2)),
        tax: Number(generatedPaycheck.tax.toFixed(4)),
        workedHours: Number(generatedPaycheck.workedHours.toFixed(2)),
        amContribution: Number(generatedPaycheck.amContribution.toFixed(2)),
        vacationPay: Number(generatedPaycheck.vacationPay.toFixed(2)),
        pension: Number((generatedPaycheck.pension || 0).toFixed(2)),
        holidaySupplement: Number((generatedPaycheck.holidaySupplement || 0).toFixed(2)),
        taxDeduction: Number((generatedPaycheck.taxDeduction || 0).toFixed(2)),
      });
    }
  }, [generatedPaycheck]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualData((prev) => ({
      ...prev,
      [name]: name === "tax" ? Number((Number(value) / 100).toFixed(4)) : Number(Number(value).toFixed(2)),
    }));
  };

  // Load generated values - used by the "Load Generated Values" button
  const loadGeneratedValues = () => {
    if (generatedPaycheck) {
      setManualData({
        salaryBeforeTax: Number(generatedPaycheck.salaryBeforeTax.toFixed(2)),
        salaryAfterTax: Number(generatedPaycheck.salaryAfterTax.toFixed(2)),
        tax: Number(generatedPaycheck.tax.toFixed(4)),
        workedHours: Number(generatedPaycheck.workedHours.toFixed(2)),
        amContribution: Number(generatedPaycheck.amContribution.toFixed(2)),
        vacationPay: Number(generatedPaycheck.vacationPay.toFixed(2)),
        pension: Number((generatedPaycheck.pension || 0).toFixed(2)),
        holidaySupplement: Number((generatedPaycheck.holidaySupplement || 0).toFixed(2)),
        taxDeduction: Number((generatedPaycheck.taxDeduction || 0).toFixed(2)),
      });
    }
  };

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value.toFixed(2)));
  };

  // Calculate difference
  const calculateDifference = (generatedValue: number, manualValue: number): number => {
    return Number((manualValue - generatedValue).toFixed(2));
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat("da-DK", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value.toFixed(4)));
  };

  // Format worked hours
  const formatWorkedHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes.toString().padStart(2, '0')}m`;
  };

  return {
    manualData,
    handleInputChange,
    formatCurrency,
    calculateDifference,
    formatPercentage,
    formatWorkedHours,
    loadGeneratedValues
  };
} 