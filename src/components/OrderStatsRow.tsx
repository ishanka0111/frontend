/**
 * OrderStatsRow - Reusable stats display component
 * Shows order statistics in a horizontal row of cards
 */

import React from 'react';
import './OrderStatsRow.css';

export interface StatItem {
  value: string | number;
  label: string;
  highlight?: boolean;
  className?: string;
}

interface OrderStatsRowProps {
  stats: StatItem[];
  className?: string;
}

export const OrderStatsRow: React.FC<OrderStatsRowProps> = ({ stats, className = '' }) => {
  return (
    <div className={`stats-row ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`stat-card ${stat.highlight ? 'highlight' : ''} ${stat.className || ''}`}
        >
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
