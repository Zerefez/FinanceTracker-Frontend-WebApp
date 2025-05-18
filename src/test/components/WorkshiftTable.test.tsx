import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WorkshiftTable from '../../components/WorkshiftTable';
import { formatDate, formatTime, getHoursWorked } from '../../lib/utils/dateTimeUtils';

// Mock the dateTimeUtils
vi.mock('../../lib/utils/dateTimeUtils', () => ({
  formatDate: vi.fn((date) => '2024-01-01'),
  formatTime: vi.fn((date) => '09:00'),
  getHoursWorked: vi.fn(() => '8.00'),
}));

describe('WorkshiftTable Component', () => {
  const mockWorkshifts = [
    {
      startTime: new Date('2024-01-01T09:00:00'),
      endTime: new Date('2024-01-01T17:00:00'),
    },
    {
      startTime: new Date('2024-01-02T10:00:00'),
      endTime: new Date('2024-01-02T18:00:00'),
    },
  ];

  const mockOnEditWorkshift = vi.fn();
  const mockOnDeleteWorkshift = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no job is selected', () => {
    render(
      <WorkshiftTable
        workshifts={[]}
        loadingWorkshifts={false}
        error={null}
        hasSelectedJob={false}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );
    expect(screen.getByText('Please select a job to view workshifts')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <WorkshiftTable
        workshifts={[]}
        loadingWorkshifts={true}
        error={null}
        hasSelectedJob={true}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );
    expect(screen.getByText('Loading workshifts...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to load workshifts';
    render(
      <WorkshiftTable
        workshifts={[]}
        loadingWorkshifts={false}
        error={errorMessage}
        hasSelectedJob={true}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty workshifts message', () => {
    render(
      <WorkshiftTable
        workshifts={[]}
        loadingWorkshifts={false}
        error={null}
        hasSelectedJob={true}
        selectedJobId="job123"
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );
    expect(screen.getByText(/No workshifts found for job123/)).toBeInTheDocument();
  });

  it('renders workshifts correctly', () => {
    render(
      <WorkshiftTable
        workshifts={mockWorkshifts}
        loadingWorkshifts={false}
        error={null}
        hasSelectedJob={true}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );

    // Check table headers
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Start Time')).toBeInTheDocument();
    expect(screen.getByText('End Time')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check workshift data
    const dateCells = screen.getAllByText('2024-01-01');
    expect(dateCells).toHaveLength(2);

    // Check start and end times separately
    const timeCells = screen.getAllByText('09:00');
    expect(timeCells).toHaveLength(4); // 2 start times + 2 end times

    const hoursCells = screen.getAllByText('8.00');
    expect(hoursCells).toHaveLength(2);

    // Check action buttons
    const editButtons = screen.getAllByTitle('Edit');
    expect(editButtons).toHaveLength(2);

    const deleteButtons = screen.getAllByTitle('Delete');
    expect(deleteButtons).toHaveLength(2);
  });

  it('handles edit workshift', () => {
    render(
      <WorkshiftTable
        workshifts={mockWorkshifts}
        loadingWorkshifts={false}
        error={null}
        hasSelectedJob={true}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );

    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEditWorkshift).toHaveBeenCalledWith(0);
  });

  it('handles delete workshift', () => {
    render(
      <WorkshiftTable
        workshifts={mockWorkshifts}
        loadingWorkshifts={false}
        error={null}
        hasSelectedJob={true}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteWorkshift).toHaveBeenCalledWith(0);
  });

  it('formats dates and times correctly', () => {
    render(
      <WorkshiftTable
        workshifts={mockWorkshifts}
        loadingWorkshifts={false}
        error={null}
        hasSelectedJob={true}
        onEditWorkshift={mockOnEditWorkshift}
        onDeleteWorkshift={mockOnDeleteWorkshift}
      />
    );

    expect(formatDate).toHaveBeenCalledWith(mockWorkshifts[0].startTime);
    expect(formatTime).toHaveBeenCalledWith(mockWorkshifts[0].startTime);
    expect(formatTime).toHaveBeenCalledWith(mockWorkshifts[0].endTime);
    expect(getHoursWorked).toHaveBeenCalledWith(mockWorkshifts[0].startTime, mockWorkshifts[0].endTime);
  });
}); 