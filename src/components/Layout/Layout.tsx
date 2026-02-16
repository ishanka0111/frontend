/**
 * Layout Component - Main page layout wrapper
 */

import React from 'react';
import Header from '../Header/Header';
import CustomerBottomNav from '../CustomerBottomNav/CustomerBottomNav';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
  showTableId?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title,
  showNavigation = true,
  showTableId = false 
}) => {
  return (
    <div className="layout">
      <Header 
        title={title} 
        showNavigation={showNavigation}
        showTableId={showTableId}
      />
      <main className="layout__main">
        {children}
      </main>
      <CustomerBottomNav />
    </div>
  );
};

export default Layout;
