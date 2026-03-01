import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md focus:ring-gray-500',
    outline: 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md focus:ring-gray-500',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && (
        <span className="mr-2">
          {icon === '微信' ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 3.045.357.864.864 0 0 1 .664-.295c.48 0 .871.39.871.871a.874.874 0 0 1-.871.87c-.242 0-.465-.099-.628-.258a11.16 11.16 0 0 1-3.265-.438l-1.903 1.114A1.324 1.324 0 0 1 3 19.53c0-.415.168-.791.438-1.067l.357-.357-.743-.357C1.453 16.543 0 13.632 0 10.53 0 4.715 3.891 0 8.691 0c4.8 0 8.691 4.715 8.691 10.53s-3.891 10.53-8.691 10.53c-1.589 0-3.062-.357-4.381-.977l.39-.39A1.32 1.32 0 0 1 5.09 19.53c.734 0 1.337-.602 1.337-1.336v-.099l.295-.099c1.66 0 3.196-.39 4.544-1.067.415-.197.87.099 1.067.39.197.415-.099.87-.39 1.067-.197.415-.686.39-1.067.39-.295 0-.59-.099-.787-.295a10.184 10.184 0 0 1-4.246.977z" fill="#07C160"/>
            </svg>
          ) : icon ? (
            <span className="text-lg">{icon}</span>
          ) : null}
        </span>
      )}
      {children}
    </button>
  );
}
