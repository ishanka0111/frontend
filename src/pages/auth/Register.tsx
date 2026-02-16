/**
 * Register Page Component
 */

import React, { useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';
import { Button, Card } from '../../components';
import type { RegisterRequest } from '../../types';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');



  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <Card className="register-card">
          <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>
            <IoCheckmarkCircle />
          </div>
          <h2 className="register-title" style={{ marginBottom: '0.5rem' }}>Registration Successful!</h2>
          <p className="register-subtitle">Redirecting to login page...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="register-page">
      <Card className="register-card">
        <div>
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join us for amazing food experience!</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}

          <div className="register-input-group">
            <label htmlFor="fullName" className="register-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="register-input"
              placeholder="John Doe"
            />
          </div>

          <div className="register-input-group">
            <label htmlFor="email" className="register-label">Email</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="register-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="register-input-group">
            <label htmlFor="phone" className="register-label">Phone Number</label>
            <input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="register-input"
              placeholder="+1234567890"
            />
          </div>

          <div className="register-input-group">
            <label htmlFor="password" className="register-label">Password</label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="register-input"
              placeholder="••••••••"
            />
          </div>

          <div className="register-input-group">
            <label htmlFor="role" className="register-label">Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: Number.parseInt(e.target.value) as 1 | 2 | 3 })}
              className="register-select"
            >
              <option value={1}>Customer</option>
              <option value={2}>Admin</option>
              <option value={3}>Kitchen Staff</option>
            </select>
          </div>

          <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%' }}>
            Create Account
          </Button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="register-link">Sign in here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
