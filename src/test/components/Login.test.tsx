import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Login } from '../../components/Login';

describe('Login Component', () => {
  const defaultProps = {
    username: '',
    password: '',
    isLoading: false,
    errorMessage: null,
    onUsernameChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onSubmit: vi.fn(),
    onReset: vi.fn(),
    onForgotPassword: vi.fn(),
    onRegister: vi.fn(),
  };

  it('renders login form with all elements', () => {
    render(<Login {...defaultProps} />);
    
    const loginElements = screen.getAllByText('Login');
    expect(loginElements).toHaveLength(2);
    
    expect(screen.getByText('Enter your credentials to access your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username\/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  it('handles username input change', async () => {
    render(<Login {...defaultProps} />);
    const usernameInput = screen.getByLabelText(/username\/email/i);
    
    await userEvent.type(usernameInput, 'testuser');
    expect(defaultProps.onUsernameChange).toHaveBeenCalled();
  });

  it('handles password input change', async () => {
    render(<Login {...defaultProps} />);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await userEvent.type(passwordInput, 'testpass');
    expect(defaultProps.onPasswordChange).toHaveBeenCalled();
  });

  it('handles form submission', async () => {
    render(<Login {...defaultProps} />);
    const form = screen.getByRole('form');
    
    await userEvent.type(screen.getByLabelText(/username\/email/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
    
    fireEvent.submit(form);
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Invalid credentials';
    render(<Login {...defaultProps} errorMessage={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables inputs and buttons when loading', () => {
    render(<Login {...defaultProps} isLoading={true} />);
    
    expect(screen.getByLabelText(/username\/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
    expect(screen.getByText(/forgot your password/i)).toBeDisabled();
  });

  it('handles forgot password click', async () => {
    render(<Login {...defaultProps} />);
    const forgotPasswordButton = screen.getByText(/forgot your password/i);
    
    await userEvent.click(forgotPasswordButton);
    expect(defaultProps.onForgotPassword).toHaveBeenCalled();
  });

  it('handles register click', async () => {
    render(<Login {...defaultProps} />);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    await userEvent.click(registerButton);
    expect(defaultProps.onRegister).toHaveBeenCalled();
  });
}); 