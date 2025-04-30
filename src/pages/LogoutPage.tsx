import { useEffect, useRef } from 'react';
import Inner from '../components/Inner';
import { authUtils } from '../lib/utils';

export function LogoutPage() {
  const redirectTimer = useRef<number | null>(null);
  const hasInitiated = useRef(false);

  useEffect(() => {
    console.log('LogoutPage mounted - performing logout');
    
    if (!hasInitiated.current) {
      hasInitiated.current = true;
      
      // Explicitly log the user out when this page is visited
      authUtils.logout();
      
      // Set a timer to redirect to login
      redirectTimer.current = window.setTimeout(() => {
        console.log('Redirect timer expired, navigating to login');
        // Use window.location.href for a hard navigation
        // Add timestamp to force fresh page load
        window.location.href = '/login?t=' + Date.now();
      }, 2000);
    }

    return () => {
      console.log('LogoutPage unmounting');
      if (redirectTimer.current) {
        window.clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // Keep the JSX clean - Inner component handles the animations
  return (
    <Inner showHeader={false}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Logging out...</h2>
          <p className="text-gray-600">Thank you for using Finance Tracker</p>
        </div>
      </div>
    </Inner>
  );
} 