import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Inner from '../../components/Inner';

// Mock the Header component
vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('Inner Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Inner>Test Content</Inner>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders header when showHeader is true', () => {
    renderWithRouter(<Inner showHeader={true}>Test Content</Inner>);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('does not render header when showHeader is false', () => {
    renderWithRouter(<Inner showHeader={false}>Test Content</Inner>);
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithRouter(
      <Inner>
        <div data-testid="test-child">Child Content</div>
      </Inner>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    renderWithRouter(<Inner>Test Content</Inner>);
    const container = screen.getByText('Test Content').closest('.bg-black');
    expect(container).toHaveClass('bg-black', 'min-h-screen', 'relative', 'overflow-hidden');
  });
}); 