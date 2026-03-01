'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, BarChart3 } from 'lucide-react';
import { UserAvatar } from '../auth/UserAvatar';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = '' }: NavbarProps) {
  const pathname = usePathname();
  const [favoritesCount, setFavoritesCount] = useState(0);

  // 获取收藏数量
  useEffect(() => {
    const updateFavoritesCount = () => {
      try {
        const { getFavorites } = require('@/lib/utils/favorites');
        const favorites = getFavorites();
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    updateFavoritesCount();

    // 监听收藏变化（如果有全局事件的话）
    window.addEventListener('favoritesUpdated', updateFavoritesCount);
    return () => window.removeEventListener('favoritesUpdated', updateFavoritesCount);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
             股包
            </span>
          </Link>

          {/* 右侧导航和用户信息 */}
          <div className="flex items-center space-x-2">
            {/* 导航链接 */}
            <Link
              href="/favorites"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/favorites')
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>我的收藏</span>
              {/* 收藏数量标记 */}
              {favoritesCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full font-medium">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* 用户头像和登录状态 */}
            <div className="flex items-center space-x-4">
              <UserAvatar />

              {/* 移动端菜单按钮 */}
              <div className="md:hidden">
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}