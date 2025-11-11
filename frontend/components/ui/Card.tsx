import React from 'react';

interface CardProps {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, selected = false, className = '', onClick }: CardProps) {
  const baseStyles = 'bg-white rounded-card transition-all duration-200';
  const stateStyles = selected
    ? 'border border-brand-primary shadow-card'
    : 'border border-transparent shadow-card-lite hover:shadow-card';
  
  return (
    <div
      className={`${baseStyles} ${stateStyles} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

