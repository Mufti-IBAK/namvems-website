import React, { ButtonHTMLAttributes } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base classes that will always be applied
  const baseClasses = [
    'font-semibold',
    'rounded-xl',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'interactive-button'
  ];

  // Variant classes
  const variantClasses = variant === 'outline' 
    ? [
        'bg-transparent',
        'border-2',
        'border-accent',
        'text-accent',
        'hover:bg-accent',
        'hover:text-white',
        'focus:ring-accent'
      ]
    : [
        'bg-accent',
        'text-white',
        'hover:bg-opacity-90',
        'focus:ring-accent',
        'shadow-lg',
        'hover:shadow-xl'
      ];

  // Size classes
  const sizeClasses = {
    sm: ['py-2', 'px-4', 'text-sm'],
    md: ['py-3', 'px-6', 'text-base'],
    lg: ['py-4', 'px-8', 'text-lg']
  };

  // Width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Combine all classes
  const combinedClasses = [
    ...baseClasses,
    ...variantClasses,
    ...sizeClasses[size],
    widthClass,
    className
  ].join(' ');

  return (
    <button 
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;