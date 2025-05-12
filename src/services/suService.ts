import {
  DEFAULT_GRANT_AMOUNTS,
  GRANT_STATUS,
  HOUSING_STATUS,
  MONTH_NAMES,
  PERSON_STATUS,
  TAX_RATES
} from '../data/studentGrantData';
import { SUMonthData } from '../lib/hooks/useStudentGrant';

interface TaxRates {
  main: number;
  secondary: number;
}

const taxRates: TaxRates = {
  main: TAX_RATES.MAIN_CARD,
  secondary: TAX_RATES.SECONDARY_CARD
};

/**
 * Calculate tax amount based on brutto amount and tax card type
 */
export const calculateTax = (brutto: number, taxCard: string): number => {
  const rate = taxCard === 'main' ? taxRates.main : taxRates.secondary;
  return Math.round(brutto * rate);
};

/**
 * Calculate netto amount based on brutto and tax
 */
export const calculateNetto = (brutto: number, tax: number): number => {
  return brutto - tax;
};

/**
 * Generate default SU data for all months in a year
 */
export const generateDefaultSUData = (): SUMonthData[] => {
  // Generate local dummy data directly
  const defaultBrutto = DEFAULT_GRANT_AMOUNTS.LIVING_AWAY;
  const defaultTax = calculateTax(defaultBrutto, 'main');
  const defaultNetto = calculateNetto(defaultBrutto, defaultTax);
  
  return MONTH_NAMES.map((month, index) => {
    // Apply different tax rates for January-March (just as an example)
    let tax = defaultTax;
    let netto = defaultNetto;
    
    if (index === 0) { // January
      tax = 948;
      netto = 6138;
    } else if (index === 1 || index === 2) { // February and March
      tax = 859;
      netto = 6227;
    }
    
    return {
      month,
      status: GRANT_STATUS.NORMAL,
      housing: HOUSING_STATUS.AWAY.label,
      personStatus: PERSON_STATUS.NOT_PARENT_DEPENDENT,
      brutto: defaultBrutto,
      supplement: 0,
      tax,
      netto
    };
  });
};

/**
 * Update all months with new brutto and tax values
 */
export const updateAllMonths = (
  months: SUMonthData[],
  brutto: number,
  taxCard: string
): SUMonthData[] => {
  const tax = calculateTax(brutto, taxCard);
  const netto = calculateNetto(brutto, tax);
  
  return months.map(month => ({
    ...month,
    brutto,
    tax,
    netto
  }));
};

/**
 * Calculate yearly totals
 */
export const calculateYearlyTotals = (months: SUMonthData[]) => {
  const totalBrutto = months.reduce((sum, month) => sum + month.brutto, 0);
  const totalNetto = months.reduce((sum, month) => sum + month.netto, 0);
  return { totalBrutto, totalNetto };
};

export default {
  calculateTax,
  calculateNetto,
  generateDefaultSUData,
  updateAllMonths,
  calculateYearlyTotals,
}; 