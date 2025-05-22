import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from '../../components/Header';

// Mock the providers
vi.mock('../../lib/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../lib/providers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../lib/providers/MenuProvider', () => ({
  MenuProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the hooks
const mockUseAuth = vi.fn();
vi.mock('../../lib/hooks', () => ({
  useAuth: () => mockUseAuth(),
  useLocalization: () => ({
    t: (key: string) => key,
  }),
  useMenu: () => ({
    isMenuActive: false,
    toggleMenu: vi.fn(),
  }),
  useNavigation: () => ({
    handleLogout: vi.fn(),
  }),
}));

// Mock the Clock component
vi.mock('../../components/ui/clock', () => ({
  default: () => <div data-testid="mock-clock">12:00</div>,
}));

// Mock the LanguageSwitcher component
vi.mock('../../components/ui/LanguageSwitcher', () => ({
  default: () => <div data-testid="mock-language-switcher">Language Switcher</div>,
}));

// Mock the Menu component
vi.mock('../../components/ui/Menu', () => ({
  default: () => <div data-testid="mock-menu">Menu</div>,
}));

// Mock the AnimatedLink component
vi.mock('../../components/ui/animation/animatedLink', () => ({
  default: ({ children, href, onClick }: { children: React.ReactNode; href?: string; onClick?: () => void }) => (
    <a href={href} onClick={onClick} data-testid="mock-animated-link">
      {children}
    </a>
  ),
}));

// Mock navigation links
vi.mock('../../data/navigationLinks', () => ({
  mainLinks: [
    { href: '/main1', title: 'Main Link 1' },
    { href: '/main2', title: 'Main Link 2' },
  ],
  userLinks: [
    { href: '/user1', title: 'User Link 1' },
    { href: '/user2', title: 'User Link 2' },
  ],
  loginLink: { href: '/login', title: 'Login' },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(component);
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('renders without crashing', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders app title and clock', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('app.title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-clock')).toBeInTheDocument();
  });

  it('renders status section', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('status.title')).toBeInTheDocument();
    expect(screen.getByText('status.paycheck')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('navigation.sitemap')).toBeInTheDocument();
  });

  it('renders user section with login link when not authenticated', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('navigation.user')).toBeInTheDocument();
    expect(screen.getByText('auth.login')).toBeInTheDocument();
    expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument();
  });

  it('renders user section with logout link when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithProviders(<Header />);
    expect(screen.getByText('navigation.user')).toBeInTheDocument();
    expect(screen.getByText('auth.logout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument();
  });
}); 