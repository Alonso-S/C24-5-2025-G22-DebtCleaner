import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export const Card = ({ 
  title, 
  children, 
  footer, 
  variant = 'default', 
  className = '' 
}: CardProps) => {
  const variantClasses = {
    default: 'bg-white',
    primary: 'bg-blue-50 border-blue-100',
    secondary: 'bg-gray-50 border-gray-100'
  };
  
  return (
    <div className={`rounded-xl shadow-sm border ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;