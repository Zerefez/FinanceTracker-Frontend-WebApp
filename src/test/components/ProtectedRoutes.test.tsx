import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoutes from '../../components/ProtectedRoutes';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

// Mock the useProtectedRoute hook
vi.mock('../../lib/hooks/useProtectedRoute', () => ({
  useProtectedRoute: vi.fn(),
}));

// Mock the Inner component
vi.mock('../../components/Inner', () => ({
  default: ({ children, showHeader }: { children: React.ReactNode; showHeader: boolean }) => (
    <div data-testid="inner" data-show-header={showHeader}>
      {children}
    </div>
  ),
}));

// Mock react-router-dom components
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Component</div>,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return null;
    },
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/test' }),
  };
});

const mockNavigate = vi.fn();

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('ProtectedRoutes Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login when not authenticated', () => {
    (useProtectedRoute as any).mockReturnValue({
      isAuthenticated: false,
      isVerifying: false,
      location: '/test',
    });

    renderWithRouter(<ProtectedRoutes />);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows loading state while verifying', () => {
    (useProtectedRoute as any).mockReturnValue({
      isAuthenticated: false,
      isVerifying: true,
      location: '/test',
    });

    renderWithRouter(<ProtectedRoutes />);
    expect(screen.getByTestId('inner')).toBeInTheDocument();
    expect(screen.getByText('Verifying your session...')).toBeInTheDocument();
  });

  it('renders protected content when authenticated', () => {
    (useProtectedRoute as any).mockReturnValue({
      isAuthenticated: true,
      isVerifying: false,
      location: '/test',
    });

    renderWithRouter(<ProtectedRoutes />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
}); 