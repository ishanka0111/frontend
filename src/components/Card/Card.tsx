/**
 * Reusable Card Component
 */

import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  style 
}) => {
  const paddingClass = `card--${padding}`;
  
  return (
    <div className={`card ${paddingClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
