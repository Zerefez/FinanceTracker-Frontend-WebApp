import Inner from '../components/Inner';
import { useLogout } from '../lib/hooks';

export function LogoutPage() {
  // Use the useLogout hook to manage the logout process
  useLogout();

  return (
    <Inner showHeader={false}>
      <section>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Logging out...</h2>
            <p className="text-gray-600">Thank you for using Finance Tracker</p>
          </div>
        </div>
      </section>
    </Inner>
  );
} 