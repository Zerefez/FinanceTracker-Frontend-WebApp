import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Register } from '../../components/Register';
import { authService } from '../../services/authService';

// Mock the authService
vi.mock('../../services/authService', () => ({
  authService: {
    register: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    renderWithRouter(<Register />);
    
    // Use getAllByText for multiple "Register" elements
    const registerElements = screen.getAllByText('Register');
    expect(registerElements).toHaveLength(2); // One in heading, one in button
    
    expect(screen.getByText('Enter your information to create an account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithRouter(<Register />);
    
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    // Wait for validation messages to appear
    await waitFor(() => {
      const fullNameInput = screen.getByLabelText('Full Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      expect(fullNameInput).toBeInvalid();
      expect(emailInput).toBeInvalid();
      expect(passwordInput).toBeInvalid();
    });
  });

  it('handles successful registration', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ success: true });
    (authService.register as any) = mockRegister;

    renderWithRouter(<Register />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Registration successful! You can now log in.')).toBeInTheDocument();
    });

    expect(mockRegister).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe');
  });

  it('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    const mockRegister = vi.fn().mockRejectedValue(new Error(errorMessage));
    (authService.register as any) = mockRegister;

    renderWithRouter(<Register />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('navigates to login page after successful registration', async () => {
    (authService.register as any).mockResolvedValueOnce({ success: true });
    
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    await waitFor(() => {
      expect(screen.getByText('Registration successful! You can now log in.')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('allows registering another account after successful registration', async () => {
    (authService.register as any).mockResolvedValueOnce({ success: true });
    
    renderWithRouter(<Register />);
    
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    await waitFor(() => {
      expect(screen.getByText('Registration successful! You can now log in.')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Register Another Account' }));
    
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
}); 