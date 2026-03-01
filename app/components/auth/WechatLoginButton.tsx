'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { getWechatLoginUrl } from '@/lib/auth';

interface WechatLoginButtonProps {
  className?: string;
}

export function WechatLoginButton({ className = '' }: WechatLoginButtonProps) {
  const handleLogin = () => {
    window.location.href = getWechatLoginUrl();
  };

  return (
    <Button
      onClick={handleLogin}
      className={`w-full ${className}`}
      icon="微信"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 3.045.357.864.864 0 0 1 .664-.295c.48 0 .871.39.871.871a.874.874 0 0 1-.871.87c-.242 0-.465-.099-.628-.258a11.16 11.16 0 0 1-3.265-.438l-1.903 1.114A1.324 1.324 0 0 1 3 19.53c0-.415.168-.791.438-1.067l.357-.357-.743-.357C1.453 16.543 0 13.632 0 10.53 0 4.715 3.891 0 8.691 0c4.8 0 8.691 4.715 8.691 10.53s-3.891 10.53-8.691 10.53c-1.589 0-3.062-.357-4.381-.977l.39-.39A1.32 1.32 0 0 1 5.09 19.53c.734 0 1.337-.602 1.337-1.336v-.099l.295-.099c1.66 0 3.196-.39 4.544-1.067.415-.197.87.099 1.067.39.197.415-.099 87-.39 1.067-.197.415-.686.39-1.067.39-.295 0-.59-.099-.787-.295a10.184 10.184 0 0 1-4.246.977z" fill="#07C160"/>
      </svg>
      微信登录
    </Button>
  );
}