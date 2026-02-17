import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdRestaurant, MdLogin, MdQrCode2 } from 'react-icons/md';
import { FaUsers, FaGears, FaChalkboardUser, FaUserTie } from 'react-icons/fa6';

export default function LoginPage() {
  const [email, setEmail] = useState('customer@restaurant.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');
  const staffParam = searchParams.get('staff');
  const isStaffLogin = !tableId || staffParam === 'true'; // Staff if no tableId or staff param is true

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Redirect based on role, preserving tableId for customers
      if (email === 'admin@restaurant.com') {
        navigate('/admin');
      } else if (email === 'kitchen@restaurant.com') {
        navigate('/kitchen');
      } else if (email === 'waiter@restaurant.com') {
        navigate('/waiter');
      } else {
        // Customer redirect - preserve tableId if present
        navigate(tableId ? `/customer?tableId=${tableId}` : '/customer');
      }
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (role: 'customer' | 'admin' | 'kitchen' | 'waiter') => {
    const creds = {
      customer: { email: 'customer@restaurant.com', password: 'password123' },
      admin: { email: 'admin@restaurant.com', password: 'admin123' },
      kitchen: { email: 'kitchen@restaurant.com', password: 'kitchen123' },
      waiter: { email: 'waiter@restaurant.com', password: 'waiter123' },
    };
    const { email: e, password: p } = creds[role];
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-darker flex items-center justify-center p-6">
      {/* STAFF LOGIN - DESKTOP FIRST */}
      {isStaffLogin ? (
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-primary rounded-lg mb-6">
              <MdRestaurant className="text-5xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-2">Restaurant Pro</h1>
            <p className="text-gray-400 text-lg">Staff Portal</p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Login Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleLogin} className="card space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Staff Login</h2>
                  
                  {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300 text-sm mb-6">
                      {error}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-300">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
                        placeholder="staff@restaurant.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-300">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-brand-primary hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-lg mt-2"
                    >
                      <MdLogin className="text-xl" />
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Staff Roles & Credentials */}
            <div className="space-y-6">
              {/* Select Role Section */}
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-4">Select Your Role</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => quickFill('admin')}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-purple-900/20 hover:bg-purple-900/40 disabled:opacity-50 border border-purple-700 text-purple-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FaGears className="text-xl" /> Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFill('kitchen')}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-green-900/20 hover:bg-green-900/40 disabled:opacity-50 border border-green-700 text-green-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FaChalkboardUser className="text-xl" /> Kitchen Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFill('waiter')}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-orange-900/20 hover:bg-orange-900/40 disabled:opacity-50 border border-orange-700 text-orange-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUserTie className="text-xl" /> Waiter
                  </button>
                </div>
              </div>

              {/* Credentials Info */}
              <div className="card">
                <h3 className="text-lg font-bold text-white mb-4">Demo Credentials</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-purple-300 font-semibold flex items-center gap-2">
                      <FaGears /> Admin
                    </p>
                    <p className="text-gray-400 ml-6">admin@restaurant.com</p>
                    <p className="text-gray-500 ml-6 text-xs">admin123</p>
                  </div>
                  <div className="border-t border-brand-border pt-3">
                    <p className="text-green-300 font-semibold flex items-center gap-2">
                      <FaChalkboardUser /> Kitchen
                    </p>
                    <p className="text-gray-400 ml-6">kitchen@restaurant.com</p>
                    <p className="text-gray-500 ml-6 text-xs">kitchen123</p>
                  </div>
                  <div className="border-t border-brand-border pt-3">
                    <p className="text-orange-300 font-semibold flex items-center gap-2">
                      <FaUserTie /> Waiter
                    </p>
                    <p className="text-gray-400 ml-6">waiter@restaurant.com</p>
                    <p className="text-gray-500 ml-6 text-xs">waiter123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CUSTOMER LOGIN - MOBILE FIRST */
        <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary rounded-lg mb-4">
            <MdRestaurant className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold">Restaurant Pro</h1>
          <p className="text-gray-400 mt-2">Customer Service</p>
        </div>

        {/* QR Code Access Info */}
        {tableId && (
          <div className="bg-brand-primary/20 border border-brand-primary rounded-lg p-4 mb-6 flex items-start gap-3">
            <MdQrCode2 className="text-2xl text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-brand-primary mb-1">QR Code Access</p>
              <p className="text-xs text-gray-300">Table {tableId} - Sign in or create a new account to get started</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="card space-y-6 mb-6">
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-3 text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-3 text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <MdLogin />
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link - Only for Customer QR Access */}
        {!isStaffLogin && (
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 mb-3">Don't have an account?</p>
            <button
              onClick={() => navigate(`/register?tableId=${tableId}`)}
              className="text-brand-primary hover:text-brand-primary/80 font-semibold transition-colors"
            >
              Create Account
            </button>
          </div>
        )}

        {/* Demo Credentials */}
        <div className={`grid ${isStaffLogin ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mb-8`}>
          {/* Customer Button - Only for Customer QR Access */}
          {!isStaffLogin && (
            <button
              type="button"
              onClick={() => quickFill('customer')}
              disabled={loading}
              className="bg-blue-900/20 hover:bg-blue-900/40 disabled:opacity-50 border border-blue-700 text-blue-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaUsers /> Customer
            </button>
          )}

          {/* Staff Buttons - Only for Staff Login */}
          {isStaffLogin ? (
            <>
              <button
                type="button"
                onClick={() => quickFill('admin')}
                disabled={loading}
                className="bg-purple-900/20 hover:bg-purple-900/40 disabled:opacity-50 border border-purple-700 text-purple-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaGears /> Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill('kitchen')}
                disabled={loading}
                className="bg-green-900/20 hover:bg-green-900/40 disabled:opacity-50 border border-green-700 text-green-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaChalkboardUser /> Kitchen
              </button>
              <button
                type="button"
                onClick={() => quickFill('waiter')}
                disabled={loading}
                className="bg-orange-900/20 hover:bg-orange-900/40 disabled:opacity-50 border border-orange-700 text-orange-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaUserTie /> Waiter
              </button>
            </>
          ) : (
            <>
              {/* Customer QR Access flow - show staff buttons in grid */}
              <button
                type="button"
                onClick={() => quickFill('admin')}
                disabled={loading}
                className="bg-purple-900/20 hover:bg-purple-900/40 disabled:opacity-50 border border-purple-700 text-purple-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaGears /> Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill('kitchen')}
                disabled={loading}
                className="bg-green-900/20 hover:bg-green-900/40 disabled:opacity-50 border border-green-700 text-green-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaChalkboardUser /> Kitchen
              </button>
              <button
                type="button"
                onClick={() => quickFill('waiter')}
                disabled={loading}
                className="bg-orange-900/20 hover:bg-orange-900/40 disabled:opacity-50 border border-orange-700 text-orange-300 py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaUserTie /> Waiter
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-brand-darker border border-brand-border rounded-lg">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">Demo Credentials</p>
          <div className="space-y-2 text-xs text-gray-500">
            <p><FaUsers className="inline mr-2" /> customer@restaurant.com / password123</p>
            <p><FaGears className="inline mr-2" /> admin@restaurant.com / admin123</p>
            <p><FaChalkboardUser className="inline mr-2" /> kitchen@restaurant.com / kitchen123</p>
            <p><FaUserTie className="inline mr-2" /> waiter@restaurant.com / waiter123</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
