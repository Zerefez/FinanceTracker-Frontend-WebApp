import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaycheckCompare from '../../components/PaycheckCompare';
import { usePaycheckCompare } from '../../lib/hooks/usePaycheckCompare';

// Mock the usePaycheckCompare hook
vi.mock('../../lib/hooks/usePaycheckCompare', () => ({
  usePaycheckCompare: vi.fn(),
}));

// Mock the @react-pdf/renderer package
vi.mock('@react-pdf/renderer', () => ({
  PDFDownloadLink: ({ children }: any) => <div>{children}</div>,
}));

// Mock the PaycheckPDF component
vi.mock('../../components/PaycheckPDF', () => ({
  default: () => <div data-testid="paycheck-pdf" />,
}));

// Mock the Input component
vi.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, ...props }: any) => (
    <input
      data-testid={props.id}
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
}));

// Mock the Button component
vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('PaycheckCompare Component', () => {
  const mockGeneratedPaycheck = {
    paycheckId: 1,
    salaryBeforeTax: 30000,
    salaryAfterTax: 20000,
    tax: 0.33,
    workedHours: 160,
    amContribution: 1000,
    vacationPay: 2000,
    holidaySupplement: 0,
    pension: 0,
    taxDeduction: 0
  };

  const mockManualData = {
    salaryBeforeTax: 30000,
    salaryAfterTax: 20000,
    tax: 0.33,
    workedHours: 160,
    amContribution: 1000,
    vacationPay: 2000,
    holidaySupplement: 0,
    pension: 0,
    taxDeduction: 0
  };

  const mockHandleInputChange = vi.fn();
  const mockFormatCurrency = (value: number) => `DKK ${value.toFixed(2)}`;
  const mockFormatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const mockFormatWorkedHours = (value: number) => `${value.toFixed(2)} hours`;
  const mockCalculateDifference = (generated: number, manual: number) => generated - manual;
  const mockLoadGeneratedValues = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePaycheckCompare as any).mockReturnValue({
      manualData: mockManualData,
      handleInputChange: mockHandleInputChange,
      formatCurrency: mockFormatCurrency,
      calculateDifference: mockCalculateDifference,
      formatPercentage: mockFormatPercentage,
      formatWorkedHours: mockFormatWorkedHours,
      loadGeneratedValues: mockLoadGeneratedValues,
    });
  });

  it('renders loading state', () => {
    render(<PaycheckCompare generatedPaycheck={null} onReset={() => {}} loading={true} hasSelectedJob={false} />);
    expect(screen.getByText('Loading paycheck data...')).toBeInTheDocument();
  });

  it('renders empty state when no paycheck is provided', () => {
    render(<PaycheckCompare generatedPaycheck={null} onReset={() => {}} loading={false} hasSelectedJob={false} />);
    expect(screen.getByText('Please select a job to compare paycheck details')).toBeInTheDocument();
  });

  it('renders comparison table with correct data', () => {
    render(<PaycheckCompare generatedPaycheck={mockGeneratedPaycheck} onReset={() => {}} hasSelectedJob={true} />);
    
    // Check headers
    expect(screen.getByText('Your Actual Paycheck')).toBeInTheDocument();
    expect(screen.getByText('Generated Paycheck')).toBeInTheDocument();
    expect(screen.getByText('Difference')).toBeInTheDocument();

    // Check input fields
    expect(screen.getByTestId('salaryBeforeTax')).toBeInTheDocument();
    expect(screen.getByTestId('salaryAfterTax')).toBeInTheDocument();
    expect(screen.getByTestId('tax')).toBeInTheDocument();
    expect(screen.getByTestId('workedHours')).toBeInTheDocument();
    expect(screen.getByTestId('amContribution')).toBeInTheDocument();
    expect(screen.getByTestId('vacationPay')).toBeInTheDocument();

    // Check generated values
    expect(screen.getByText('DKK 30000.00')).toBeInTheDocument();
    expect(screen.getByText('DKK 20000.00')).toBeInTheDocument();
    expect(screen.getByText('33.0%')).toBeInTheDocument();
    expect(screen.getByText('160.00 hours')).toBeInTheDocument();
    expect(screen.getByText('DKK 1000.00')).toBeInTheDocument();
    expect(screen.getByText('DKK 2000.00')).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(<PaycheckCompare generatedPaycheck={mockGeneratedPaycheck} onReset={() => {}} hasSelectedJob={true} />);
    
    const salaryInput = screen.getByTestId('salaryBeforeTax');
    fireEvent.change(salaryInput, { target: { value: '35000' } });
    
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('shows correct difference indicators', () => {
    const differentPaycheck = {
      ...mockGeneratedPaycheck,
      salaryBeforeTax: 35000, // Different from manual data
    };

    render(<PaycheckCompare generatedPaycheck={differentPaycheck} onReset={() => {}} hasSelectedJob={true} />);
    
    // Check for red X icon and difference amount
    const differenceElement = screen.getByText('DKK 5000.00');
    expect(differenceElement).toHaveClass('text-red-500');
  });

  it('shows correct difference and match indicators', () => {
    render(
      <PaycheckCompare 
        generatedPaycheck={mockGeneratedPaycheck} 
        onReset={() => {}} 
        loading={false}
        hasSelectedJob={true}
      />
    );

    // Check for matching elements
    const differenceElements = screen.getAllByText('DKK 0.00');
    expect(differenceElements.length).toBeGreaterThan(0);
    
    // Check for green check icons
    const checkIcons = screen.getAllByTestId('check-icon');
    expect(checkIcons.length).toBeGreaterThan(0);
    
    // Check that at least one element has the green color class
    const greenTextElements = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && 
             element?.classList.contains('text-green-500');
    });
    expect(greenTextElements.length).toBeGreaterThan(0);
  });
}); 