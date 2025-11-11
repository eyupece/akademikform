import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'empty' | 'draft' | 'ai-suggested' | 'completed';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1.5 rounded-full text-caption font-bold';
  
  const variantStyles = {
    primary: 'bg-gradient-to-br from-brand-secondary to-brand-primary text-white',
    secondary: 'bg-brand-secondary text-white',
    success: 'bg-brand-success text-white',
    warning: 'bg-brand-warning text-white',
    danger: 'bg-brand-danger text-white',
    info: 'bg-brand-info text-white',
    // Section status variants
    empty: 'bg-gray-100 text-gray-600 border border-gray-300',
    draft: 'bg-blue-50 text-blue-700 border border-blue-200',
    'ai-suggested': 'bg-gradient-to-br from-purple-400/20 to-brand-primary/20 text-brand-primary border border-brand-primary/30',
    completed: 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm',
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

