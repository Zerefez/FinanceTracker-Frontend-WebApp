import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiService } from '../../services/apiService';
import { authService } from '../../services/authService';
import { workshiftService } from '../../services/workshiftService';

// Mock the dependencies
vi.mock('../../services/apiService', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(),
  },
}));

describe('workshiftService', () => {
  // Sample data for testing
  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockDate = new Date('2023-05-15T10:00:00');
  const mockEndDate = new Date('2023-05-15T18:00:00');
  
  // Explicitly type as 'any' to avoid TypeScript errors about 'id'
  const mockWorkshift: any = {
    id: 'ws1',
    startTime: mockDate,
    endTime: mockEndDate,
    jobId: 'job123',
    userId: 'user123',
  };

  // API response includes id but our WorkShift type doesn't
  const mockApiWorkshift: any = {
    id: 'ws1',
    startTime: mockDate.toISOString(),
    endTime: mockEndDate.toISOString(),
    jobId: 'job123',
    userId: 'user123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the getCurrentUser method to return the test user
    vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser);
  });

  describe('getUserWorkshifts', () => {
    it('should return workshifts for the current user', async () => {
      // Setup the mock response
      vi.mocked(apiService.get).mockResolvedValue([mockApiWorkshift]);

      // Call the method
      const result = await workshiftService.getUserWorkshifts();

      // Verify the API was called correctly
      expect(apiService.get).toHaveBeenCalledWith('/Workshifts');

      // Verify the result matches expectations
      expect(result).toHaveLength(1);
      // Use any type for accessing id property
      expect((result[0] as any).id).toBe('ws1');
      expect(result[0].startTime).toBeInstanceOf(Date);
      expect(result[0].endTime).toBeInstanceOf(Date);
    });

    it('should filter workshifts by jobId if provided', async () => {
      // Setup the mock response
      vi.mocked(apiService.get).mockResolvedValue([mockApiWorkshift]);

      // Call the method with a jobId
      await workshiftService.getUserWorkshifts('job123');

      // Verify the API was called correctly
      expect(apiService.get).toHaveBeenCalledWith('/Workshifts');
    });

    it('should handle empty response', async () => {
      // Setup the mock to return empty array
      vi.mocked(apiService.get).mockResolvedValue([]);

      // Call the method
      const result = await workshiftService.getUserWorkshifts();

      // Verify result is an empty array
      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      // Setup the mock to throw an error
      vi.mocked(apiService.get).mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(workshiftService.getUserWorkshifts())
        .rejects
        .toThrow('API error');
    });
  });

  describe('getWorkshiftById', () => {
    it('should return a workshift by ID', async () => {
      // Setup the mock response
      vi.mocked(apiService.get).mockResolvedValue(mockApiWorkshift);

      // Call the method
      const result = await workshiftService.getWorkshiftById('ws1');

      // Verify the API was called correctly
      expect(apiService.get).toHaveBeenCalledWith('/Workshifts/ws1');

      // Verify the result matches expectations
      expect(result).not.toBeNull();
      // Use any type for accessing id property
      expect((result as any)?.id).toBe('ws1');
      expect(result?.startTime).toBeInstanceOf(Date);
      expect(result?.endTime).toBeInstanceOf(Date);
    });

    it('should return null when workshift not found', async () => {
      // Setup the mock to return null
      vi.mocked(apiService.get).mockResolvedValue(null);

      // Call the method
      const result = await workshiftService.getWorkshiftById('non-existent');

      // Verify the result is null
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      // Setup the mock to throw an error
      vi.mocked(apiService.get).mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(workshiftService.getWorkshiftById('ws1'))
        .rejects
        .toThrow('API error');
    });
  });

  describe('createWorkshift', () => {
    it('should create a new workshift', async () => {
      // Setup the mock response
      vi.mocked(apiService.post).mockResolvedValue(mockApiWorkshift);

      // Call the method
      const result = await workshiftService.createWorkshift(mockWorkshift);

      // Verify the API was called correctly with the right formatted data
      expect(apiService.post).toHaveBeenCalledWith(
        '/Workshifts',
        expect.objectContaining({
          startTime: expect.any(String),
          endTime: expect.any(String),
          userId: 'user123',
          jobId: 'job123',
        })
      );

      // Verify the result matches expectations
      expect(result).not.toBeNull();
      // Use any type for accessing id property
      expect((result as any).id).toBe('ws1');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
    });

    it('should format dates correctly when creating a workshift', async () => {
      // Setup the mock response
      vi.mocked(apiService.post).mockImplementation((_, data) => {
        // Return the data that was passed to post, with id added
        return Promise.resolve({
          id: 'new-ws',
          ...(data as any),
        });
      });

      const testDate = new Date(2023, 5, 15, 10, 30, 0); // June 15, 2023, 10:30:00
      const testEndDate = new Date(2023, 5, 15, 18, 45, 0); // June 15, 2023, 18:45:00

      // Call the method with specific dates
      await workshiftService.createWorkshift({
        startTime: testDate,
        endTime: testEndDate,
        jobId: 'job123',
      });

      // Verify the dates are formatted correctly
      expect(apiService.post).toHaveBeenCalledWith(
        '/Workshifts',
        expect.objectContaining({
          startTime: expect.stringMatching(/2023-06-15T10:30:00/),
          endTime: expect.stringMatching(/2023-06-15T18:45:00/),
        })
      );
    });

    it('should use empty userId if no current user', async () => {
      // Setup the getCurrentUser mock to return null
      vi.mocked(authService.getCurrentUser).mockReturnValue(null);
      vi.mocked(apiService.post).mockResolvedValue(mockApiWorkshift);

      // Call the method
      await workshiftService.createWorkshift(mockWorkshift);

      // Verify the API was called with empty userId
      expect(apiService.post).toHaveBeenCalledWith(
        '/Workshifts',
        expect.objectContaining({
          userId: '',
        })
      );
    });

    it('should handle errors', async () => {
      // Setup the mock to throw an error
      vi.mocked(apiService.post).mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(workshiftService.createWorkshift(mockWorkshift))
        .rejects
        .toThrow('API error');
    });
  });

  describe('updateWorkshift', () => {
    it('should update an existing workshift', async () => {
      // Setup the mock response
      vi.mocked(apiService.put).mockResolvedValue(mockApiWorkshift);

      // Call the method
      const result = await workshiftService.updateWorkshift('ws1', mockWorkshift);

      // Verify the API was called correctly
      expect(apiService.put).toHaveBeenCalledWith(
        '/Paycheck/updateWorkshift/ws1',
        expect.objectContaining({
          startTime: expect.any(String),
          endTime: expect.any(String),
          userId: 'user123',
          jobId: 'job123',
        })
      );

      // Verify the result matches expectations
      expect(result).not.toBeNull();
      // Use any type for accessing id property
      expect((result as any).id).toBe('ws1');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
    });

    it('should format dates correctly when updating a workshift', async () => {
      // Setup the mock response
      vi.mocked(apiService.put).mockImplementation((_, data) => {
        // Return the data that was passed to put, with id added
        return Promise.resolve({
          id: 'ws1',
          ...(data as any),
        });
      });

      const testDate = new Date(2023, 5, 15, 10, 30, 0); // June 15, 2023, 10:30:00
      const testEndDate = new Date(2023, 5, 15, 18, 45, 0); // June 15, 2023, 18:45:00

      // Call the method with specific dates
      await workshiftService.updateWorkshift('ws1', {
        startTime: testDate,
        endTime: testEndDate,
        jobId: 'job123',
      });

      // Verify the dates are formatted correctly
      expect(apiService.put).toHaveBeenCalledWith(
        '/Paycheck/updateWorkshift/ws1',
        expect.objectContaining({
          startTime: expect.stringMatching(/2023-06-15T10:30:00/),
          endTime: expect.stringMatching(/2023-06-15T18:45:00/),
        })
      );
    });

    it('should use empty userId if no current user', async () => {
      // Setup the getCurrentUser mock to return null
      vi.mocked(authService.getCurrentUser).mockReturnValue(null);
      vi.mocked(apiService.put).mockResolvedValue(mockApiWorkshift);

      // Call the method
      await workshiftService.updateWorkshift('ws1', mockWorkshift);

      // Verify the API was called with empty userId
      expect(apiService.put).toHaveBeenCalledWith(
        '/Paycheck/updateWorkshift/ws1',
        expect.objectContaining({
          userId: '',
        })
      );
    });

    it('should handle errors', async () => {
      // Setup the mock to throw an error
      vi.mocked(apiService.put).mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(workshiftService.updateWorkshift('ws1', mockWorkshift))
        .rejects
        .toThrow('API error');
    });
  });

  describe('deleteWorkshift', () => {
    it('should delete a workshift', async () => {
      // Setup the mock response
      vi.mocked(apiService.delete).mockResolvedValue(undefined);

      // Call the method
      await workshiftService.deleteWorkshift('ws1');

      // Verify the API was called correctly
      expect(apiService.delete).toHaveBeenCalledWith('/Paycheck/deleteWorkshift/ws1');
    });

    it('should handle errors', async () => {
      // Setup the mock to throw an error
      vi.mocked(apiService.delete).mockRejectedValue(new Error('API error'));

      // Call the method and expect it to throw
      await expect(workshiftService.deleteWorkshift('ws1'))
        .rejects
        .toThrow('API error');
    });
  });

  describe('dateToISOWithLocalTime helper', () => {
    it('should correctly format dates with local time', async () => {
      // We'll test this indirectly through the createWorkshift method
      vi.mocked(apiService.post).mockResolvedValue(mockApiWorkshift);

      // January 1, 2023, 15:30:45
      const testDate = new Date(2023, 0, 1, 15, 30, 45);
      
      await workshiftService.createWorkshift({
        startTime: testDate,
        endTime: testDate, // Using the same date for simplicity
        jobId: 'job123',
      });

      // Verify the formatted date in the API call
      expect(apiService.post).toHaveBeenCalledWith(
        '/Workshifts',
        expect.objectContaining({
          startTime: '2023-01-01T15:30:45',
          endTime: '2023-01-01T15:30:45',
        })
      );
    });

    it('should pad single-digit values correctly', async () => {
      // We'll test this indirectly through the createWorkshift method
      vi.mocked(apiService.post).mockResolvedValue(mockApiWorkshift);

      // May 5, 2023, 9:5:7 (using single digits to test padding)
      const testDate = new Date(2023, 4, 5, 9, 5, 7);
      
      await workshiftService.createWorkshift({
        startTime: testDate,
        endTime: testDate, // Using the same date for simplicity
        jobId: 'job123',
      });

      // Verify the formatted date in the API call
      expect(apiService.post).toHaveBeenCalledWith(
        '/Workshifts',
        expect.objectContaining({
          startTime: '2023-05-05T09:05:07',
          endTime: '2023-05-05T09:05:07',
        })
      );
    });
  });
}); 