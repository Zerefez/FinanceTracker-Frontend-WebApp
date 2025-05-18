import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from '../../pages/Home';

// Mocking dependencies
vi.mock('../../components/SU', () => ({
  default: () => <div data-testid="su-section">SU Section Mock</div>
}));

vi.mock('../../components/ui/animation/animatedText', () => ({
  default: ({ phrases, accentWords, className, accentClassName }: any) => (
    <div 
      data-testid="animated-text" 
      data-phrases={JSON.stringify(phrases)}
      data-accent-words={JSON.stringify(accentWords)}
      className={className}
      data-accent-className={accentClassName}
    >
      {phrases.join(' ')}
    </div>
  )
}));

vi.mock('../../lib/hooks', () => ({
  useLocalization: () => ({
    t: (key: string) => key // Simply return the key for testing
  })
}));

vi.mock('../../pages/JobOverviewPage', () => ({
  default: () => <div data-testid="job-overview">Job Overview Mock</div>
}));

// Helper method to setup render with any providers needed
const renderWithProviders = () => {
  return render(<Home />);
};

describe('Home', () => {
  it('renders without crashing', () => {
    renderWithProviders();
    // Verify that the page renders
    expect(screen.getAllByTestId('animated-text')[0]).toBeInTheDocument();
  });

  it('renders welcome text with animation', () => {
    renderWithProviders();
    
    // Get all AnimatedText components
    const animatedTexts = screen.getAllByTestId('animated-text');
    
    // Verify welcome text (first component)
    expect(animatedTexts[0]).toHaveAttribute('data-phrases', JSON.stringify(['home.welcome']));
    expect(animatedTexts[0]).toHaveAttribute('data-accent-words', JSON.stringify(['finance', 'tracker']));
    expect(animatedTexts[0]).toHaveClass('mb-4');
    expect(animatedTexts[0]).toHaveAttribute('data-accent-className', 'text-accent');
  });

  it('renders subtitle text with animation', () => {
    renderWithProviders();
    
    // Get all AnimatedText components
    const animatedTexts = screen.getAllByTestId('animated-text');
    
    // Verify subtitle text (second component)
    expect(animatedTexts[1]).toHaveAttribute('data-phrases', JSON.stringify(['home.subtitle1', 'home.subtitle2']));
    expect(animatedTexts[1]).toHaveAttribute('data-accent-words', JSON.stringify(['economy']));
  });

  it('renders JobOverviewPage component', () => {
    renderWithProviders();
    
    // Verify JobOverviewPage is rendered
    expect(screen.getByTestId('job-overview')).toBeInTheDocument();
  });

  it('renders SUSection component', () => {
    renderWithProviders();
    
    // Verify SUSection is rendered
    expect(screen.getByTestId('su-section')).toBeInTheDocument();
  });

  it('renders with proper layout structure', () => {
    const { container } = renderWithProviders();
    
    // Check main section exists using container query
    const section = container.querySelector('section');
    expect(section).not.toBeNull();
    
    // Check grid layout for JobOverviewPage and SUSection
    const gridContainer = container.querySelector('.my-5.grid');
    expect(gridContainer).not.toBeNull();
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });

  it('passes localization function to components', () => {
    renderWithProviders();
    
    // Verify that animated texts have the translated content
    // Since our mock simply returns the keys, we can check those
    const animatedTexts = screen.getAllByTestId('animated-text');
    expect(animatedTexts[0].textContent).toContain('home.welcome');
    expect(animatedTexts[1].textContent).toContain('home.subtitle1 home.subtitle2');
  });
}); 