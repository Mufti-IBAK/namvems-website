import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-full transition-all duration-300 interactive-button focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-primary text-black hover:bg-opacity-90 focus:ring-primary',
    secondary: 'bg-accent text-white hover:bg-opacity-90 focus:ring-accent',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-300'
  };
  
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button 
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;