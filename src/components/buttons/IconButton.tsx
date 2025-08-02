import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string; // Required for accessibility
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  ...props
}) => {
  // Base classes that will always be applied
  const baseClasses = [
    'rounded-full',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'interactive-button'
  ];

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-primary',
      'text-black',
      'hover:bg-opacity-90',
      'focus:ring-primary'
    ],
    secondary: [
      'bg-accent',
      'text-white',
      'hover:bg-opacity-90',
      'focus:ring-accent'
    ],
    ghost: [
      'bg-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-300'
    ]
  };

  // Size classes
  const sizeClasses = {
    sm: ['p-2'],
    md: ['p-3'],
    lg: ['p-4']
  };

  // Combine all classes
  const combinedClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    className
  ].join(' ');

  return (
    <button 
      className={combinedClasses}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;