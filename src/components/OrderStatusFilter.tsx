/**
 * OrderStatusFilter - Reusable status filter buttons component
 * Allows filtering orders by status with count badges
 */

import React from 'react';
import './OrderStatusFilter.css';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface OrderStatusFilterProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  className?: string;
}

export const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
  options,
  activeFilter,
  onFilterChange,
  className = '',
}) => {
  return (
    <div className={`filters-section ${className}`}>
      <div className="status-filters">
        {options.map((option) => (
          <button
            key={option.value}
            className={`filter-btn ${activeFilter === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </button>
        ))}
      </div>
    </div>
  );
};
