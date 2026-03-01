import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-2xl 
      shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]
      dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_1px_2px_0_rgba(0,0,0,0.2)]
      p-5 sm:p-6 
      border border-gray-100 dark:border-gray-700/50
      hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
      dark:hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]
      transition-all duration-300 ease-out
      relative overflow-hidden
      ${className}
    `}>
      {/* 顶部渐变装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      {title && (
        <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 text-gray-900 dark:text-gray-100 relative pb-3 border-b border-gray-100 dark:border-gray-700/50">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
