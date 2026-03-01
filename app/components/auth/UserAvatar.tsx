'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { logout, getCurrentUser } from '@/lib/auth';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../ui/Dropdown';
import { ChevronDown, LogOut, User } from 'lucide-react';

interface UserAvatarProps {
  className?: string;
}

interface UserState {
  nickname?: string;
  headimgurl?: string;
}

export function UserAvatar({ className = '' }: UserAvatarProps) {
  const [userInfo, setUserInfo] = useState<UserState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 添加登录状态监听
    const handleLogin = () => loadUserInfo();
    const handleLogout = () => {
      setUserInfo({});
      setIsLoading(false);
    };

    // 初始加载
    loadUserInfo();

    // 监听登录和登出事件
    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const loadUserInfo = () => {
    try {
      const user = getCurrentUser();
      if (user) {
        setUserInfo({
          nickname: user.nickname,
          headimgurl: user.headimgurl
        });
      } else {
        // 确保当用户未登录时清空信息
        setUserInfo({});
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserInfo({});
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  if (!userInfo.nickname || !userInfo.headimgurl) {
    return (
      <Dropdown>
        <DropdownTrigger className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        </DropdownTrigger>
        <DropdownContent align="end" className="w-48">
          <DropdownItem onClick={loadUserInfo} className="text-sm">
            登录
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className={`relative ${className}`}>
          <Image
            src={userInfo.headimgurl}
            alt={userInfo.nickname}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
          {userInfo.nickname}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </DropdownTrigger>
      <DropdownContent align="end" className="w-48">
        <DropdownItem onClick={loadUserInfo} className="text-sm">
          <User className="w-4 h-4 mr-2" />
          个人信息
        </DropdownItem>
        <DropdownItem onClick={handleLogout} className="text-sm text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}