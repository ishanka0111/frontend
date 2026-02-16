/**
 * Customer Dashboard - Main hub for customer features
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/menu', { replace: true });
  }, [navigate]);

  return null;
};

export default CustomerDashboard;
