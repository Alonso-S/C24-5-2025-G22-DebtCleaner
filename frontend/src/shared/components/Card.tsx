import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  noShadow?: boolean;
  onClick?: () => void;
  isHoverable?: boolean;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  noShadow = false,
  onClick,
  isHoverable = false,
  isSelected = false,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg transition-all',
        !noPadding && 'p-4',
        !noShadow && 'shadow-sm',
        isHoverable && 'hover:shadow-md hover:translate-y-[-2px]',
        isSelected && 'ring-2 ring-primary-500 bg-primary-50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};