'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface SimulateLoginButtonProps {
  onLogin: (userInfo: { nickname: string; headimgurl: string }) => void;
}

export function SimulateLoginButton({ onLogin }: SimulateLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulateLogin = () => {
    setIsLoading(true);

    // 模拟网络延迟
    setTimeout(() => {
      const mockUserInfo = {
        openid: 'mock_openid_123',
        nickname: '测试用户',
        headimgurl: 'https://mmbiz.qpic.cn/mmbiz/icTdbibNViaicncMfLBQRQD3TGdbH3DW42Y2v74jJRQcuGkCPAkaUWDx4ibLRLtHTGFxM4F3IZrC7f6faA3vY1JhGw/132',
        unionid: 'mock_unionid_456'
      };

      // 存储用户信息
      localStorage.setItem('wechat_user', JSON.stringify(mockUserInfo));
      localStorage.setItem('wechat_token', 'mock_token_123');

      // 触发登录事件
      window.dispatchEvent(new Event('login'));
      onLogin(mockUserInfo);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Button
      onClick={handleSimulateLogin}
      disabled={isLoading}
      variant="primary"
      className="w-full"
    >
      {isLoading ? '登录中...' : '模拟登录（测试用）'}
    </Button>
  );
}