import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseStyles = 'animate-shimmer bg-gray-200 dark:bg-gray-700 rounded';
  
  const variantStyles = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, idx) => (
          <div
            key={idx}
            className={`${baseStyles} ${variantStyles.text}`}
            style={{
              width: idx === lines - 1 ? '80%' : width || '100%',
              height: height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'text' ? '16px' : '100px'),
      }}
    />
  );
}
