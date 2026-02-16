/**
 * Login Page Component
 */

import React, { useState, useEffect } from 'react';
import { IoRestaurantOutline } from 'react-icons/io5';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { Button, Card } from '../../components';
import type { LoginRequest } from '../../types';
import { STORAGE_KEYS, storage } from '../../constants/storage';
import { UserRole } from '../../constants/roles';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, tableId, setTableId } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Capture tableId from URL if present (for QR code scans)
  useEffect(() => {
    const urlTableId = searchParams.get('tableId');
    if (urlTableId && urlTableId !== tableId?.toString()) {
      console.log('Login: Capturing tableId from URL:', urlTableId);
      setTableId(urlTableId);
    }
  }, [searchParams, tableId, setTableId]);



  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      const userData = await refreshUser();
      
      // Check for tableId from URL, cookie, or localStorage
      const urlTableId = searchParams.get('tableId');
      const cookieTableId = storage.get<string>(STORAGE_KEYS.TABLE_NUMBER);
      const effectiveTableId = urlTableId || tableId || cookieTableId;
      
      console.log('Login success - tableId check:', { urlTableId, contextTableId: tableId, cookieTableId, effectiveTableId });
      console.log('Login success - user role:', userData.role);
      
      // Role-based navigation
      const role = userData.role;
      let redirectPath: string;
      
      if (role === UserRole.CUSTOMER) {
        // Customer: Check if tableId exists
        redirectPath = effectiveTableId ? '/menu' : '/qr-scan';
      } else if (role === UserRole.ADMIN) {
        redirectPath = '/admin';
      } else if (role === UserRole.KITCHEN) {
        redirectPath = '/kitchen';
      } else if (role === UserRole.WAITER) {
        redirectPath = '/waiter';
      } else {
        redirectPath = '/login';
      }
      
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <div>
          <h2 className="login-title">
            <IoRestaurantOutline className="title-icon" />
            Restaurant Login
          </h2>
          <p className="login-subtitle">Sign in to order delicious food!</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">{error}</div>
          )}

          <div className="login-input-group">
            <label htmlFor="email" className="login-label">Email</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="login-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="login-input"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="login-link">Register here</Link>
          </p>
        </div>

        <div className="login-test-credentials">
          <p className="login-test-title">Test Credentials:</p>
          <ul className="login-test-list">
            <li>Customer: customer@test.com / password123</li>
            <li>Admin: admin@test.com / admin123</li>
            <li>Kitchen: kitchen@test.com / kitchen123</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Login;
