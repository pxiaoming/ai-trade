'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className={`flex items-center space-x-6 ${className}`}>
      <Link
        href="/"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/')
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        首页
      </Link>

      <Link
        href="/market"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/market')
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        市场概览
      </Link>

      <Link
        href="/favorites"
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive('/favorites')
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        我的收藏
      </Link>
    </nav>
  );
}