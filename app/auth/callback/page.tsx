'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleWechatCallback, WechatUserInfo } from '@/lib/auth';
import { Card } from '../../components/ui/Card';

export default function WechatCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 从URL参数中获取code和state
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
          // 如果没有code，显示模拟登录选项（用于测试）
          const mockUserInfo: WechatUserInfo = {
            openid: 'mock_openid_123',
            nickname: '测试用户',
            headimgurl: 'https://mmbiz.qpic.cn/mmbiz/icTdbibNViaicncMfLBQRQD3TGdbH3DW42Y2v74jJRQcuGkCPAkaUWDx4ibLRLtHTGFxM4F3IZrC7f6faA3vY1JhGw/132',
            unionid: 'mock_unionid_456'
          };

          // 存储用户信息
          localStorage.setItem('wechat_user', JSON.stringify(mockUserInfo));
          localStorage.setItem('wechat_token', 'mock_token_123');

          // 发送登录事件
          window.dispatchEvent(new Event('login'));

          // 跳转到首页
          router.push('/');
          return;
        }

        // 调用登录处理函数
        const result = await handleWechatCallback(code, state!);

        if (result.code === 200 && result.data) {
          // 存储token
          localStorage.setItem('wechat_token', result.data.token);

          // 存储用户信息
          localStorage.setItem('wechat_user', JSON.stringify(result.data.userInfo));

          // 发送登录事件
          window.dispatchEvent(new Event('login'));

          // 跳转到首页
          router.push('/');
        } else {
          throw new Error(result.message || '登录失败');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '登录失败');
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card title="登录失败" className="max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card title="登录中..." className="max-w-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          正在处理您的登录请求，请稍候...
        </p>
      </Card>
    </div>
  );
}