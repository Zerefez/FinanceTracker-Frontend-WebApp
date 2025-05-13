import { Check, X } from "lucide-react";
import { usePaycheckCompare } from "../lib/hooks/usePaycheckCompare";
import { PaycheckData } from "../services/paycheckService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PaycheckCompareProps {
  generatedPaycheck: PaycheckData | null;
  onReset: () => void;
  loading?: boolean;
}

export default function PaycheckCompare({ generatedPaycheck, onReset, loading = false }: PaycheckCompareProps) {
  const {
    manualData,
    handleInputChange,
    formatCurrency,
    calculateDifference,
    formatPercentage,
    formatWorkedHours,
    loadGeneratedValues
  } = usePaycheckCompare(generatedPaycheck);

  return (
    <div className="w-full rounded-lg border-2 border-gray-200 p-4 md:p-5">
      <h2 className="mb-4 text-xl font-bold md:text-2xl lg:text-3xl text-accent">
        Compare Your Paycheck
      </h2>

      {loading ? (
        <div className="text-center p-6">Loading paycheck data...</div>
      ) : !generatedPaycheck ? (
        <div className="text-center p-6 text-gray-500">
          Please select a job to compare paycheck details
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-gray-200">
            {/* Headers */}
            <div className="py-3 px-6 border-b-2 border-gray-200">
              <h3 className="font-semibold text-lg">Your Actual Paycheck</h3>
            </div>
            <div className="py-3 px-6 border-b-2 border-gray-200">
              <h3 className="font-semibold text-lg">Generated Paycheck</h3>
            </div>
            <div className="py-3 pl-6 border-b-2 border-gray-200">
              <h3 className="font-semibold text-lg">Difference</h3>
            </div>

            {/* Salary Before Tax */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="salaryBeforeTax">
                Salary Before Tax (DKK)
              </label>
              <Input
                id="salaryBeforeTax"
                name="salaryBeforeTax"
                type="number"
                value={manualData.salaryBeforeTax}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Salary Before Tax</span>
              <span className="block font-medium">{formatCurrency(generatedPaycheck.salaryBeforeTax)}</span>
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Salary Before Tax</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.salaryBeforeTax, manualData.salaryBeforeTax) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.salaryBeforeTax, manualData.salaryBeforeTax) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.salaryBeforeTax, manualData.salaryBeforeTax))}
                </span>
              </div>
            </div>
            
            {/* Salary After Tax */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="salaryAfterTax">
                Salary After Tax (DKK)
              </label>
              <Input
                id="salaryAfterTax"
                name="salaryAfterTax"
                type="number"
                value={manualData.salaryAfterTax}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Salary After Tax</span>
              <span className="block font-medium">{formatCurrency(generatedPaycheck.salaryAfterTax)}</span>
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Salary After Tax</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.salaryAfterTax, manualData.salaryAfterTax) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.salaryAfterTax, manualData.salaryAfterTax) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.salaryAfterTax, manualData.salaryAfterTax))}
                </span>
              </div>
            </div>
            
            {/* Tax Rate */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="tax">
                Tax Rate (%)
              </label>
              <Input
                id="tax"
                name="tax"
                type="number"
                value={manualData.tax * 100}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Tax Rate</span>
              <span className="block font-medium">{formatPercentage(generatedPaycheck.tax)}</span>
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Tax Rate</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.tax, manualData.tax) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.tax, manualData.tax) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatPercentage(calculateDifference(generatedPaycheck.tax, manualData.tax))}
                </span>
              </div>
            </div>
            
            {/* Hours Worked */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="workedHours">
                Hours Worked
              </label>
              <Input
                id="workedHours"
                name="workedHours"
                type="number"
                value={manualData.workedHours}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
                min="0"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Hours Worked</span>
              <span className="block font-medium">{formatWorkedHours(generatedPaycheck.workedHours)}</span>
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Hours Worked</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.workedHours, manualData.workedHours) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.workedHours, manualData.workedHours) === 0 ? "text-green-500" : "text-red-500"}>
                  {calculateDifference(generatedPaycheck.workedHours, manualData.workedHours).toFixed(2)} hours
                </span>
              </div>
            </div>
            
            {/* AM Contribution */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="amContribution">
                AM Contribution (DKK)
              </label>
              <Input
                id="amContribution"
                name="amContribution"
                type="number"
                value={manualData.amContribution}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">AM Contribution</span>
              <span className="block font-medium">{formatCurrency(generatedPaycheck.amContribution)}</span>
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">AM Contribution</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.amContribution, manualData.amContribution) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.amContribution, manualData.amContribution) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.amContribution, manualData.amContribution))}
                </span>
              </div>
            </div>
            
            {/* Vacation Pay */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="vacationPay">
                Vacation Pay (DKK)
              </label>
              <Input
                id="vacationPay"
                name="vacationPay"
                type="number"
                value={manualData.vacationPay}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Vacation Pay</span>
              <span className="block font-medium">{formatCurrency(generatedPaycheck.vacationPay)}</span>
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Vacation Pay</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.vacationPay, manualData.vacationPay) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.vacationPay, manualData.vacationPay) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.vacationPay, manualData.vacationPay))}
                </span>
              </div>
            </div>
            
            {/* Pension */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="pension">
                Pension (DKK)
              </label>
              <Input
                id="pension"
                name="pension"
                type="number"
                value={manualData.pension}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              {generatedPaycheck.pension > 0 && (
                <>
                  <span className="block text-sm text-gray-500">Pension</span>
                  <span className="block font-medium">{formatCurrency(generatedPaycheck.pension)}</span>
                </>
              )}
              {generatedPaycheck.pension <= 0 && (
                <>
                  <span className="block text-sm text-gray-500">Pension</span>
                  <span className="block font-medium">0,00 kr.</span>
                </>
              )}
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Pension</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.pension || 0, manualData.pension) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.pension || 0, manualData.pension) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.pension || 0, manualData.pension))}
                </span>
              </div>
            </div>
            
            {/* Holiday Supplement */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="holidaySupplement">
                Holiday Supplement (DKK)
              </label>
              <Input
                id="holidaySupplement"
                name="holidaySupplement"
                type="number"
                value={manualData.holidaySupplement}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              {generatedPaycheck.holidaySupplement > 0 && (
                <>
                  <span className="block text-sm text-gray-500">Holiday Supplement</span>
                  <span className="block font-medium">{formatCurrency(generatedPaycheck.holidaySupplement)}</span>
                </>
              )}
              {generatedPaycheck.holidaySupplement <= 0 && (
                <>
                  <span className="block text-sm text-gray-500">Holiday Supplement</span>
                  <span className="block font-medium">0,00 kr.</span>
                </>
              )}
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Holiday Supplement</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.holidaySupplement || 0, manualData.holidaySupplement) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.holidaySupplement || 0, manualData.holidaySupplement) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.holidaySupplement || 0, manualData.holidaySupplement))}
                </span>
              </div>
            </div>
            
            {/* Tax Deduction */}
            <div className="py-4 px-6 border-b border-gray-200">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="taxDeduction">
                Tax Deduction (DKK)
              </label>
              <Input
                id="taxDeduction"
                name="taxDeduction"
                type="number"
                value={manualData.taxDeduction}
                onChange={handleInputChange}
                className="w-[50%]"
                step="0.01"
              />
            </div>
            <div className="py-4 px-6 border-b border-gray-200">
              {generatedPaycheck.taxDeduction > 0 && (
                <>
                  <span className="block text-sm text-gray-500">Tax Deduction</span>
                  <span className="block font-medium">{formatCurrency(generatedPaycheck.taxDeduction)}</span>
                </>
              )}
              {generatedPaycheck.taxDeduction <= 0 && (
                <>
                  <span className="block text-sm text-gray-500">Tax Deduction</span>
                  <span className="block font-medium">0,00 kr.</span>
                </>
              )}
            </div>
            <div className="py-4 pl-6 border-b border-gray-200">
              <span className="block text-sm text-gray-500">Tax Deduction</span>
              <div className="flex items-center font-medium">
                {calculateDifference(generatedPaycheck.taxDeduction || 0, manualData.taxDeduction) === 0 ? (
                  <Check size={16} className="text-green-500 mr-1" />
                ) : (
                  <X size={16} className="text-red-500 mr-1" />
                )}
                <span className={calculateDifference(generatedPaycheck.taxDeduction || 0, manualData.taxDeduction) === 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(calculateDifference(generatedPaycheck.taxDeduction || 0, manualData.taxDeduction))}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onReset} variant="outline" className="mr-2">
              Reset
            </Button>
            <Button 
              onClick={loadGeneratedValues}
              variant="submit"
            >
              Load Generated Values
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 