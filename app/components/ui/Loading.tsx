import React from 'react';

export function Loading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 mb-4"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
    </div>
  );
}
