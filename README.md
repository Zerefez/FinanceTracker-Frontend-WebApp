# Finance Tracker Frontend Web App

A React-based frontend for tracking finances, including jobs, paychecks, and student grants.

## Project Structure

The project follows a clean architecture that separates UI components from business logic:

```
src/
  ├── components/         # UI components
  ├── pages/              # Page components
  ├── lib/
  │    ├── hooks/         # Custom React hooks
  │    └── utils.ts       # Utility functions
  ├── services/           # API and data services
  ├── data/               # Static data
  ├── assets/             # Static assets
  └── style/              # Global styles
```

## Hooks Architecture

We've separated component logic from UI rendering using custom hooks:

### Authentication and Navigation Hooks

- `useAuth`: Manages authentication state and auth-related actions
- `useNavigation`: Handles navigation logic and route transitions
- `useProtectedRoute`: Protects routes that require authentication
- `useLogout`: Manages the logout process

### Form and Data Hooks

- `useLoginForm`: Manages login form state and submission
- `useMenu`: Manages menu open/close state
- `useJobs`: Fetches and manages job data
- `useJobForm`: Manages job creation and editing
- `usePaycheck`: Handles paycheck data and job selection

### UI Hooks

- `useLocomotiveScroll`: Initializes and manages the Locomotive Scroll library

## Component Architecture

Components are split into:

1. **Pure UI Components**: Focus solely on rendering and delegating events to parent
2. **Container Components**: Use hooks to manage state and pass data to UI components
3. **Page Components**: Compose multiple components together and use hooks for page-level logic

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

The project includes comprehensive tests for components, hooks, services, and pages. Due to the extensive test suite, we've implemented optimized testing commands to prevent memory issues.

### Running Tests

For standard testing during development:

```bash
npm test
```

For a one-time test run with improved memory handling:

```bash
npm run test:run
```

For running tests with coverage:

```bash
npm run test:coverage
```

### Optimized Memory Testing

To avoid JavaScript heap memory issues during testing, use these specialized commands:

#### Sequential Testing (Recommended for CI)

```bash
npm run test:sequential
```

Or run tests by category:

```bash
npm run test:services    # Test services only
npm run test:components  # Test components only
npm run test:hooks       # Test hooks only
npm run test:pages       # Test pages only
npm run test:app         # Test App component only
```

#### Batch Testing Scripts

For Windows:
```bash
./run-tests.bat
```

For macOS/Linux:
```bash
chmod +x ./run-tests.sh
./run-tests.sh
```

These scripts run each test category sequentially to minimize memory usage. 
