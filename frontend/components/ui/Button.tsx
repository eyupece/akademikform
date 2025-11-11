import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'base' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'base',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-gradient-to-br hover:from-brand-secondary hover:to-brand-primary shadow-btn',
    secondary: 'bg-brand-secondary text-white hover:bg-gradient-to-br hover:from-brand-secondary hover:to-brand-primary shadow-btn',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    ghost: 'text-brand-primary hover:bg-shade-primary',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-[10px] leading-none',
    base: 'px-5 py-3 text-[12px] leading-none',
    lg: 'px-6 py-3.5 text-[14px] leading-none',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

