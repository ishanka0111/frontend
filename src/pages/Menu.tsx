/**
 * Placeholder Menu Page Component
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Menu: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">🍽️ Menu</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.fullName}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Menu Page</h2>
          <p className="text-gray-600 mb-6">
            This is a placeholder for the menu page. Menu items will be displayed here.
          </p>
          <div className="text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2">User Info:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Name: {user?.fullName}</li>
              <li>Email: {user?.email}</li>
              <li>
                Role: {(() => {
                  if (user?.role === 1) return 'Customer';
                  if (user?.role === 2) return 'Admin';
                  return 'Kitchen';
                })()}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
