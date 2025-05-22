import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { confirmationDialogService } from '../../components/ui/confirmation-dialog';
import { toastService } from '../../components/ui/toast';
import { useWorkshifts } from '../../lib/hooks/useWorkshifts';
import { workshiftService } from '../../services/workshiftService';

// Mock dependencies
vi.mock('../../services/workshiftService', () => ({
  workshiftService: {
    getUserWorkshifts: vi.fn(),
    deleteWorkshift: vi.fn(),
  },
}));

vi.mock('../../components/ui/toast', () => ({
  toastService: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../components/ui/confirmation-dialog', () => ({
  confirmationDialogService: {
    confirm: vi.fn(),
  },
}));

describe('useWorkshifts', () => {
  // Sample data for testing
  const mockDate = new Date('2023-05-15T10:00:00');
  const mockEndDate = new Date('2023-05-15T18:00:00');
  
  const mockWorkshifts = [
    {
      id: 'ws1',
      startTime: mockDate,
      endTime: mockEndDate,
      jobId: 'job123',
      userId: 'user123',
    },
    {
      id: 'ws2',
      startTime: new Date('2023-05-16T09:00:00'),
      endTime: new Date('2023-05-16T17:00:00'),
      jobId: 'job123',
      userId: 'user123',
    },
  ];

  const onWorkshiftUpdatedMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up a default mock response
    vi.mocked(workshiftService.getUserWorkshifts).mockResolvedValue(mockWorkshifts);
    vi.mocked(confirmationDialogService.confirm).mockResolvedValue(true);
  });

  describe('initialization and fetching', () => {
    it('should initialize with empty workshifts and no error', () => {
      const { result } = renderHook(() => useWorkshifts(undefined));
      
      expect(result.current.workshifts).toEqual([]);
      expect(result.current.loadingWorkshifts).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingWorkshiftId).toBeUndefined();
    });

    it('should not fetch workshifts when no jobId is provided', async () => {
      renderHook(() => useWorkshifts(undefined));
      
      expect(workshiftService.getUserWorkshifts).not.toHaveBeenCalled();
    });

    it('should fetch workshifts when jobId is provided', async () => {
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // Wait for the fetch to complete
      await waitFor(() => {
        expect(workshiftService.getUserWorkshifts).toHaveBeenCalledWith('job123');
      });
      
      // Verify state updates
      expect(result.current.workshifts).toEqual(mockWorkshifts);
      expect(result.current.loadingWorkshifts).toBe(false);
    });

    it('should handle loading state during fetch', async () => {
      // Delay the response to ensure we can check the loading state
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      vi.mocked(workshiftService.getUserWorkshifts).mockReturnValue(promise as any);
      
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // Initially it should be loading
      expect(result.current.loadingWorkshifts).toBe(true);
      
      // Resolve the promise
      await act(async () => {
        resolvePromise!(mockWorkshifts);
      });
      
      // After resolution, it should not be loading
      expect(result.current.loadingWorkshifts).toBe(false);
      expect(result.current.workshifts).toEqual(mockWorkshifts);
    });

    it('should handle error during fetch', async () => {
      // Mock an error response
      vi.mocked(workshiftService.getUserWorkshifts).mockRejectedValue(new Error('Failed to fetch'));
      
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // Wait for the error
      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });
      
      expect(result.current.error).toBe('Failed to load workshifts. Please try again.');
      expect(result.current.loadingWorkshifts).toBe(false);
    });
  });

  describe('modal operations', () => {
    it('should open modal for new workshift', () => {
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      act(() => {
        result.current.handleAddNewWorkshift();
      });
      
      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingWorkshiftId).toBeUndefined();
    });

    it('should show error when trying to add workshift without jobId', () => {
      const { result } = renderHook(() => useWorkshifts(undefined));
      
      act(() => {
        result.current.handleAddNewWorkshift();
      });
      
      expect(result.current.isModalOpen).toBe(false);
      expect(toastService.error).toHaveBeenCalledWith('Please select a job before adding a workshift');
    });

    it('should open modal for editing workshift', () => {
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      act(() => {
        result.current.handleEditWorkshift(1);
      });
      
      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingWorkshiftId).toBe('1');
    });

    it('should close modal', () => {
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // First open the modal
      act(() => {
        result.current.handleAddNewWorkshift();
      });
      
      expect(result.current.isModalOpen).toBe(true);
      
      // Then close it
      act(() => {
        result.current.setIsModalOpen(false);
      });
      
      expect(result.current.isModalOpen).toBe(false);
    });
  });

  describe('delete workshift', () => {
    it('should delete workshift when confirmed', async () => {
      const { result } = renderHook(() => useWorkshifts('job123', onWorkshiftUpdatedMock));
      
      // Wait for initial fetch to complete
      await waitFor(() => {
        expect(result.current.workshifts.length).toBe(2);
      });
      
      // Delete the first workshift
      await act(async () => {
        await result.current.handleDeleteWorkshift(0);
      });
      
      expect(confirmationDialogService.confirm).toHaveBeenCalled();
      expect(workshiftService.deleteWorkshift).toHaveBeenCalledWith('0');
      expect(toastService.success).toHaveBeenCalledWith('Workshift deleted successfully');
      expect(onWorkshiftUpdatedMock).toHaveBeenCalled();
    });

    it('should not delete workshift when confirmation is canceled', async () => {
      vi.mocked(confirmationDialogService.confirm).mockResolvedValue(false);
      
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // Wait for initial fetch to complete
      await waitFor(() => {
        expect(result.current.workshifts.length).toBe(2);
      });
      
      // Try to delete the first workshift
      await act(async () => {
        await result.current.handleDeleteWorkshift(0);
      });
      
      expect(confirmationDialogService.confirm).toHaveBeenCalled();
      expect(workshiftService.deleteWorkshift).not.toHaveBeenCalled();
    });

    it('should handle error during delete', async () => {
      vi.mocked(workshiftService.deleteWorkshift).mockRejectedValue(new Error('Failed to delete'));
      
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // Wait for initial fetch to complete
      await waitFor(() => {
        expect(result.current.workshifts.length).toBe(2);
      });
      
      // Try to delete with error
      await act(async () => {
        await result.current.handleDeleteWorkshift(0);
      });
      
      expect(workshiftService.deleteWorkshift).toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalledWith('Failed to delete workshift');
    });
  });

  describe('workshift saved', () => {
    it('should refresh workshifts after saving', async () => {
      const updatedWorkshifts = [...mockWorkshifts, {
        id: 'ws3',
        startTime: new Date(),
        endTime: new Date(),
        jobId: 'job123',
        userId: 'user123',
      }];
      
      const { result } = renderHook(() => useWorkshifts('job123', onWorkshiftUpdatedMock));
      
      // Mock an updated response for the refresh
      vi.mocked(workshiftService.getUserWorkshifts).mockResolvedValue(updatedWorkshifts);
      
      // Trigger the refresh
      await act(async () => {
        result.current.handleWorkshiftSaved();
      });
      
      // Should have called getUserWorkshifts again
      expect(workshiftService.getUserWorkshifts).toHaveBeenCalledTimes(2);
      
      // Should have updated the workshifts
      expect(result.current.workshifts).toEqual(updatedWorkshifts);
      
      // Should have called the callback
      expect(onWorkshiftUpdatedMock).toHaveBeenCalled();
    });

    it('should not try to refresh without jobId', async () => {
      const { result } = renderHook(() => useWorkshifts(undefined));
      
      // Reset the mock to track new calls
      vi.mocked(workshiftService.getUserWorkshifts).mockClear();
      
      // Trigger the save handler without a job ID
      await act(async () => {
        result.current.handleWorkshiftSaved();
      });
      
      // Should not have tried to fetch workshifts
      expect(workshiftService.getUserWorkshifts).not.toHaveBeenCalled();
    });

    it('should handle error during refresh', async () => {
      // Create a spy on toastService.error
      const errorSpy = vi.spyOn(toastService, 'error');
      
      // Setup mock for initial load
      vi.mocked(workshiftService.getUserWorkshifts).mockResolvedValueOnce(mockWorkshifts);
      
      const { result } = renderHook(() => useWorkshifts('job123'));
      
      // Wait for initial load
      await waitFor(() => {
        expect(result.current.workshifts).toEqual(mockWorkshifts);
      });
      
      // Clear previous calls
      errorSpy.mockClear();
      
      // Setup mock to reject on second call
      vi.mocked(workshiftService.getUserWorkshifts).mockRejectedValueOnce(new Error('Failed to refresh'));
      
      // Trigger refresh that will fail
      await act(async () => {
        try {
          await result.current.handleWorkshiftSaved();
        } catch (error) {
          // Expect error to be caught by the hook, not here
          console.log('Error caught in test:', error);
        }
      });
      
      // Verify error was handled by showing toast
      expect(errorSpy).toHaveBeenCalledWith('Failed to refresh workshifts.');
    });
  });
}); 