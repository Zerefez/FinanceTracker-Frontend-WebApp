import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check if the main container is present
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    render(<App />);
    // Check for main layout elements
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toHaveClass('main', 'min-h-screen', 'bg-white', 'text-primary', 'font-sans');
  });
}); 