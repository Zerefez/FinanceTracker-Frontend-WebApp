import { useEffect, useState } from 'react';
import suService from '../../services/suService';

export interface SUMonthData {
  month: string;
  status: string;
  housing: string;
  personStatus: string;
  brutto: number;
  supplement: number;
  tax: number;
  netto: number;
}

export const useStudentGrant = () => {
  const [year, setYear] = useState<string>('2025');
  const [messageNumber, setMessageNumber] = useState<string>('3');
  const [totalMessages, setTotalMessages] = useState<string>('3');
  const [suBrutto, setSuBrutto] = useState<number>(7086);
  const [suNetto, setSuNetto] = useState<number>(6037);
  const [taxAmount, setTaxAmount] = useState<number>(1049);
  const [taxCard, setTaxCard] = useState<string>('main');
  const [housingStatus, setHousingStatus] = useState<string>('away');
  const [monthsData, setMonthsData] = useState<SUMonthData[]>([]);
  const [totalBrutto, setTotalBrutto] = useState<number>(0);
  const [totalNetto, setTotalNetto] = useState<number>(0);
  
  // Initialize data on component mount
  useEffect(() => {
    // Get the dummy data from the service
    const initialMonths = suService.generateDefaultSUData();
    setMonthsData(initialMonths);
    
    const { totalBrutto, totalNetto } = suService.calculateYearlyTotals(initialMonths);
    setTotalBrutto(totalBrutto);
    setTotalNetto(totalNetto);
  }, []);
  
  const handleSuBruttoChange = (value: number) => {
    const newBrutto = value;
    const newTax = suService.calculateTax(newBrutto, taxCard);
    const newNetto = suService.calculateNetto(newBrutto, newTax);
    
    setSuBrutto(newBrutto);
    setTaxAmount(newTax);
    setSuNetto(newNetto);
    
    // Update all months with new values
    const updatedMonths = suService.updateAllMonths(monthsData, newBrutto, taxCard);
    setMonthsData(updatedMonths);
    
    // Update totals
    const { totalBrutto, totalNetto } = suService.calculateYearlyTotals(updatedMonths);
    setTotalBrutto(totalBrutto);
    setTotalNetto(totalNetto);
  };
  
  const handleTaxCardChange = (card: string) => {
    setTaxCard(card);
    
    // Recalculate tax based on new tax card
    const newTax = suService.calculateTax(suBrutto, card);
    const newNetto = suService.calculateNetto(suBrutto, newTax);
    
    setTaxAmount(newTax);
    setSuNetto(newNetto);
    
    // Update all months with new tax values
    const updatedMonths = suService.updateAllMonths(monthsData, suBrutto, card);
    setMonthsData(updatedMonths);
    
    // Update totals
    const { totalBrutto, totalNetto } = suService.calculateYearlyTotals(updatedMonths);
    setTotalBrutto(totalBrutto);
    setTotalNetto(totalNetto);
  };
  
  const handleHousingChange = (status: string) => {
    setHousingStatus(status);
    
    // Adjust grant amount based on housing status
    let newBrutto;
    if (status === 'away') {
      newBrutto = 7086; // Higher amount for living away from parents
    } else {
      newBrutto = 3029; // Lower amount for living with parents
    }
    
    // Update brutto and recalculate everything
    const newTax = suService.calculateTax(newBrutto, taxCard);
    const newNetto = suService.calculateNetto(newBrutto, newTax);
    
    setSuBrutto(newBrutto);
    setTaxAmount(newTax);
    setSuNetto(newNetto);
    
    // Update all months with new values and housing status
    const updatedMonths = monthsData.map(month => ({
      ...month,
      brutto: newBrutto,
      tax: newTax,
      netto: newNetto,
      housing: status === 'away' ? 'Living Away' : 'Living With Parents'
    }));
    
    setMonthsData(updatedMonths);
    
    // Update totals
    const { totalBrutto, totalNetto } = suService.calculateYearlyTotals(updatedMonths);
    setTotalBrutto(totalBrutto);
    setTotalNetto(totalNetto);
  };
  
  const handleYearChange = (selectedYear: string) => {
    setYear(selectedYear);
    // Here you could add additional logic to load data specific to the selected year
  };
  
  const handleMessageNumberChange = (msgNumber: string) => {
    setMessageNumber(msgNumber);
    // Here you could add logic to load a specific grant notification
  };

  return {
    // State
    year,
    messageNumber,
    totalMessages,
    suBrutto,
    suNetto,
    taxAmount,
    taxCard,
    housingStatus,
    monthsData,
    totalBrutto,
    totalNetto,
    
    // Actions
    handleSuBruttoChange,
    handleTaxCardChange,
    handleHousingChange,
    handleYearChange,
    handleMessageNumberChange,
    setYear,
    setMessageNumber
  };
}; 