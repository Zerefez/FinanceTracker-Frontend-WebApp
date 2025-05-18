import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { confirmationDialogService } from '../../components/ui/confirmation-dialog';
import { toastService } from '../../components/ui/toast';
import { useJobForm } from '../../lib/hooks/useJobForm';
import { jobService } from '../../services/jobService';
import { localStorageService } from '../../services/localStorageService';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: () => ({ companyName: 'test-company' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('../../services/jobService', () => ({
  jobService: {
    getJobByCompanyName: vi.fn(),
    registerJob: vi.fn(),
    updateJob: vi.fn(),
    deleteJob: vi.fn(),
    addSupplementDetails: vi.fn(),
  },
}));

vi.mock('../../services/localStorageService', () => ({
  localStorageService: {
    getWorkdaysForJob: vi.fn(),
    saveWorkdaysForJob: vi.fn(),
    removeWorkdaysForJob: vi.fn(),
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

vi.mock('../../lib/hooks/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

// Get the mock implementations
const mockedUseParams = vi.fn();
const mockedUseNavigate = vi.fn();

// Override the actual react-router-dom functions
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockedUseParams(),
    useNavigate: () => mockedUseNavigate(),
  };
});

describe('useJobForm', () => {
  const mockJob = {
    companyName: 'test-company',
    title: 'Test Job',
    hourlyRate: 20,
    employmentType: 'fullTime',
    taxCard: 'main',
  };

  const mockSupplementDetail = {
    weekday: 0,
    amount: 50,
    startTime: '2023-01-01T09:00:00.000Z',
    endTime: '2023-01-01T17:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default behavior
    mockedUseParams.mockReturnValue({ companyName: 'test-company' });
    mockedUseNavigate.mockReturnValue(vi.fn());
  });

  describe('initialization', () => {
    it('should initialize with default state for new job', async () => {
      mockedUseParams.mockReturnValue({ companyName: 'new' });
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      expect(hook.result.current.isNewJob).toBe(true);
      expect(hook.result.current.isLoading).toBe(false);
      expect(hook.result.current.job).toEqual({
        title: '',
        companyName: '',
        hourlyRate: 0,
        employmentType: '',
        taxCard: '',
      });
      expect(hook.result.current.selectedWeekdays).toEqual([]);
    });

    it('should fetch existing job data', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(localStorageService.getWorkdaysForJob).mockReturnValue(['Monday', 'Wednesday']);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      expect(hook.result.current.isNewJob).toBe(false);
      expect(hook.result.current.isLoading).toBe(false);
      expect(hook.result.current.job).toEqual(mockJob);
      expect(hook.result.current.selectedWeekdays).toEqual(['Monday', 'Wednesday']);
      expect(jobService.getJobByCompanyName).toHaveBeenCalledWith('test-company');
    });

    it('should handle error when fetching job', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockRejectedValue(new Error('Failed to fetch job'));
      
      const navigateMock = vi.fn();
      mockedUseNavigate.mockReturnValue(navigateMock);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      expect(hook.result.current.isLoading).toBe(false);
      expect(hook.result.current.error).toBe('jobPage.fetchError');
    });

    it('should handle case when job is not found', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(null);
      
      const navigateMock = vi.fn();
      mockedUseNavigate.mockReturnValue(navigateMock);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      expect(hook.result.current.error).toBe('jobPage.jobNotFound');
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

  describe('input handling', () => {
    it('should handle text input changes', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.handleInputChange({
          target: { name: 'title', value: 'New Title', type: 'text' }
        });
      });
      
      expect(hook.result.current.job.title).toBe('New Title');
    });

    it('should handle number input changes', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.handleInputChange({
          target: { name: 'hourlyRate', value: '25', type: 'number' }
        });
      });
      
      expect(hook.result.current.job.hourlyRate).toBe(25);
    });

    it('should handle select changes', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.handleSelectChange('taxCardType', 'secondary');
      });
      
      expect(hook.result.current.job.taxCard).toBe('secondary');
    });

    it('should handle weekday changes - add weekday', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(localStorageService.getWorkdaysForJob).mockReturnValue(['Monday']);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.handleWeekdayChange('Wednesday');
      });
      
      expect(hook.result.current.selectedWeekdays).toContain('Wednesday');
      expect(localStorageService.saveWorkdaysForJob).toHaveBeenCalledWith(
        'test-company', 
        ['Monday', 'Wednesday']
      );
    });

    it('should handle weekday changes - remove weekday', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(localStorageService.getWorkdaysForJob).mockReturnValue(['Monday', 'Wednesday']);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.handleWeekdayChange('Monday');
      });
      
      expect(hook.result.current.selectedWeekdays).not.toContain('Monday');
      expect(hook.result.current.selectedWeekdays).toContain('Wednesday');
      expect(localStorageService.saveWorkdaysForJob).toHaveBeenCalledWith(
        'test-company', 
        ['Wednesday']
      );
    });
  });

  describe('supplement details', () => {
    it('should add a supplement detail', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.addSupplementDetail();
      });
      
      expect(hook.result.current.supplementDetails.length).toBe(1);
      expect(hook.result.current.supplementDetails[0]).toHaveProperty('weekday');
      expect(hook.result.current.supplementDetails[0]).toHaveProperty('amount');
      expect(hook.result.current.supplementDetails[0]).toHaveProperty('startTime');
      expect(hook.result.current.supplementDetails[0]).toHaveProperty('endTime');
    });

    it('should remove a supplement detail', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.addSupplementDetail();
        hook.result.current.addSupplementDetail();
      });
      
      expect(hook.result.current.supplementDetails.length).toBe(2);
      
      act(() => {
        hook.result.current.removeSupplementDetail(0);
      });
      
      expect(hook.result.current.supplementDetails.length).toBe(1);
    });

    it('should update a supplement detail', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      act(() => {
        hook.result.current.addSupplementDetail();
      });
      
      const newAmount = 75;
      
      act(() => {
        hook.result.current.updateSupplementDetail(0, 'amount', newAmount);
      });
      
      expect(hook.result.current.supplementDetails[0].amount).toBe(newAmount);
    });
  });

  describe('form submission', () => {
    it('should handle creating a new job successfully', async () => {
      mockedUseParams.mockReturnValue({ companyName: 'new' });
      vi.mocked(jobService.registerJob).mockResolvedValue({ ...mockJob, companyName: 'new-company' });
      
      const navigateMock = vi.fn();
      mockedUseNavigate.mockReturnValue(navigateMock);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      // Simulate form submission
      const preventDefaultMock = vi.fn();
      await act(async () => {
        await hook.result.current.handleSubmit({ preventDefault: preventDefaultMock });
      });
      
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(jobService.registerJob).toHaveBeenCalled();
      expect(toastService.success).toHaveBeenCalledWith('jobPage.createSuccess');
      expect(navigateMock).toHaveBeenCalledWith('/');
      expect(hook.result.current.isSaving).toBe(false);
    });

    it('should handle updating an existing job successfully', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(jobService.updateJob).mockResolvedValue(mockJob);
      
      const navigateMock = vi.fn();
      mockedUseNavigate.mockReturnValue(navigateMock);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      // Add supplement details
      act(() => {
        hook.result.current.addSupplementDetail();
      });
      
      // Simulate form submission
      const preventDefaultMock = vi.fn();
      await act(async () => {
        await hook.result.current.handleSubmit({ preventDefault: preventDefaultMock });
      });
      
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(jobService.updateJob).toHaveBeenCalled();
      expect(jobService.addSupplementDetails).toHaveBeenCalled();
      expect(toastService.success).toHaveBeenCalledWith('jobPage.updateSuccess');
      expect(navigateMock).toHaveBeenCalledWith('/');
      expect(hook.result.current.isSaving).toBe(false);
    });

    it('should handle errors during form submission', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(jobService.updateJob).mockRejectedValue(new Error('Failed to update job'));
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      // Simulate form submission
      const preventDefaultMock = vi.fn();
      await act(async () => {
        await hook.result.current.handleSubmit({ preventDefault: preventDefaultMock });
      });
      
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(hook.result.current.error).toBe('jobPage.updateError');
      expect(toastService.error).toHaveBeenCalledWith('jobPage.updateError');
      expect(hook.result.current.isSaving).toBe(false);
    });
  });

  describe('job deletion', () => {
    it('should delete a job when confirmed', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(confirmationDialogService.confirm).mockResolvedValue(true);
      vi.mocked(jobService.deleteJob).mockResolvedValue(undefined);
      
      const navigateMock = vi.fn();
      mockedUseNavigate.mockReturnValue(navigateMock);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      // Simulate delete action
      const preventDefaultMock = vi.fn();
      await act(async () => {
        await hook.result.current.handleDelete('test-company', { preventDefault: preventDefaultMock });
      });
      
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(confirmationDialogService.confirm).toHaveBeenCalled();
      expect(jobService.deleteJob).toHaveBeenCalledWith('test-company');
      expect(localStorageService.removeWorkdaysForJob).toHaveBeenCalledWith('test-company');
      expect(toastService.success).toHaveBeenCalledWith('jobPage.deleteSuccess');
      expect(navigateMock).toHaveBeenCalledWith('/');
    });

    it('should not delete a job when confirmation is canceled', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(confirmationDialogService.confirm).mockResolvedValue(false);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      // Simulate delete action with canceled confirmation
      const preventDefaultMock = vi.fn();
      await act(async () => {
        await hook.result.current.handleDelete('test-company', { preventDefault: preventDefaultMock });
      });
      
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(confirmationDialogService.confirm).toHaveBeenCalled();
      expect(jobService.deleteJob).not.toHaveBeenCalled();
    });

    it('should handle errors during job deletion', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      vi.mocked(confirmationDialogService.confirm).mockResolvedValue(true);
      vi.mocked(jobService.deleteJob).mockRejectedValue(new Error('Failed to delete job'));
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      // Simulate delete action with error
      const preventDefaultMock = vi.fn();
      await act(async () => {
        await hook.result.current.handleDelete('test-company', { preventDefault: preventDefaultMock });
      });
      
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(jobService.deleteJob).toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalledWith('jobPage.deleteError');
    });
  });

  describe('utility functions', () => {
    it('should return correct job display name', async () => {
      vi.mocked(jobService.getJobByCompanyName).mockResolvedValue(mockJob);
      
      let hook: any;
      await act(async () => {
        hook = renderHook(() => useJobForm());
      });
      
      expect(hook.result.current.getJobDisplayName()).toBe('test-company');
    });
  });
}); 