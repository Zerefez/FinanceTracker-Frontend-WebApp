import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaycheckOverview from '../../components/PaycheckOverview';
import { usePaycheckData } from '../../lib/hooks/usePaycheckData';

// Mock the usePaycheckData hook
vi.mock('../../lib/hooks/usePaycheckData', () => ({
  usePaycheckData: vi.fn(),
}));

// Mock the Skeleton component
vi.mock('../../components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="mock-skeleton" className={className} />
  ),
}));

describe('PaycheckOverview Component', () => {
  const mockPaycheckData = {
    salaryBeforeTax: 30000,
    salaryAfterTax: 20000,
    tax: 0.33,
    workedHours: 160,
    amContribution: 1000,
    vacationPay: 2000,
    pension: 1500,
    holidaySupplement: 500,
    taxDeduction: 1000,
  };

  const mockFormatCurrency = (value: number) => `DKK ${value.toFixed(2)}`;
  const mockFormatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const mockParseWorkedHours = (value: number) => `${value.toFixed(2)} hours`;
  const mockRefreshPaycheckData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePaycheckData as any).mockReturnValue({
      paycheckData: mockPaycheckData,
      loading: false,
      error: null,
      formatCurrency: mockFormatCurrency,
      formatPercentage: mockFormatPercentage,
      parseWorkedHours: mockParseWorkedHours,
      refreshPaycheckData: mockRefreshPaycheckData,
    });
  });

  it('renders empty state when no company is selected', () => {
    render(<PaycheckOverview />);
    expect(screen.getByText('Please select a job to view paycheck details')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    (usePaycheckData as any).mockReturnValue({
      paycheckData: null,
      loading: true,
      error: null,
      formatCurrency: mockFormatCurrency,
      formatPercentage: mockFormatPercentage,
      parseWorkedHours: mockParseWorkedHours,
      refreshPaycheckData: mockRefreshPaycheckData,
    });

    render(<PaycheckOverview companyName="Test Company" />);
    const skeletons = screen.getAllByTestId('mock-skeleton');
    expect(skeletons).toHaveLength(3);
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to load paycheck data';
    (usePaycheckData as any).mockReturnValue({
      paycheckData: null,
      loading: false,
      error: errorMessage,
      formatCurrency: mockFormatCurrency,
      formatPercentage: mockFormatPercentage,
      parseWorkedHours: mockParseWorkedHours,
      refreshPaycheckData: mockRefreshPaycheckData,
    });

    render(<PaycheckOverview companyName="Test Company" />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders paycheck data correctly', () => {
    render(<PaycheckOverview companyName="Test Company" />);

    // Check main stats
    expect(screen.getByText('Salary (before tax)')).toBeInTheDocument();
    const salaryBeforeTaxElements = screen.getAllByText('DKK 30000.00');
    expect(salaryBeforeTaxElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Salary (after tax)')).toBeInTheDocument();
    const salaryAfterTaxElements = screen.getAllByText('DKK 20000.00');
    expect(salaryAfterTaxElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Tax Rate')).toBeInTheDocument();
    const taxRateElements = screen.getAllByText('33.0%');
    expect(taxRateElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Hours Worked')).toBeInTheDocument();
    const hoursWorkedElements = screen.getAllByText('160.00 hours');
    expect(hoursWorkedElements.length).toBeGreaterThan(0);

    expect(screen.getByText('AM Contribution')).toBeInTheDocument();
    const amContributionElements = screen.getAllByText('DKK 1000.00');
    expect(amContributionElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Vacation Pay')).toBeInTheDocument();
    const vacationPayElements = screen.getAllByText('DKK 2000.00');
    expect(vacationPayElements.length).toBeGreaterThan(0);

    // Check optional stats
    expect(screen.getByText('Pension')).toBeInTheDocument();
    const pensionElements = screen.getAllByText('DKK 1500.00');
    expect(pensionElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Holiday Supplement')).toBeInTheDocument();
    const holidaySupplementElements = screen.getAllByText('DKK 500.00');
    expect(holidaySupplementElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Tax Deduction')).toBeInTheDocument();
    const taxDeductionElements = screen.getAllByText('DKK 1000.00');
    expect(taxDeductionElements.length).toBeGreaterThan(0);
  });

  it('refreshes data when company or month changes', () => {
    const { rerender } = render(<PaycheckOverview companyName="Test Company" month={1} />);
    expect(mockRefreshPaycheckData).toHaveBeenCalledTimes(1);

    // Change company
    rerender(<PaycheckOverview companyName="New Company" month={1} />);
    expect(mockRefreshPaycheckData).toHaveBeenCalledTimes(2);

    // Change month
    rerender(<PaycheckOverview companyName="New Company" month={2} />);
    expect(mockRefreshPaycheckData).toHaveBeenCalledTimes(3);
  });

  it('exposes refresh method through ref', () => {
    const ref = { current: null as any };
    render(<PaycheckOverview companyName="Test Company" ref={ref} />);
    
    expect(ref.current).toBeDefined();
    expect(ref.current.refresh).toBeDefined();
    
    ref.current.refresh();
    expect(mockRefreshPaycheckData).toHaveBeenCalled();
  });
}); 