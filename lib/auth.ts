// 微信登录相关类型定义
export interface WechatUserInfo {
  openid: string;
  nickname: string;
  headimgurl: string;
  unionid?: string;
}

export interface WechatLoginResponse {
  code: number;
  message: string;
  data?: {
    token: string;
    userInfo: WechatUserInfo;
  };
}

// 微信登录配置
const WECHAT_CONFIG = {
  appId: process.env.NEXT_PUBLIC_WECHAT_APP_ID || 'wx1234567890', // 从环境变量获取AppID
  redirectUri: process.env.NEXT_PUBLIC_WECHAT_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
  scope: 'snsapi_userinfo',
  state: 'STATE'
};

// 获取微信登录URL
export function getWechatLoginUrl(): string {
  const { appId, redirectUri, scope, state } = WECHAT_CONFIG;
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
}

// 处理微信登录回调
export async function handleWechatCallback(code: string, state: string): Promise<WechatLoginResponse> {
  try {
    // 这里应该调用后端API来交换code获取用户信息和token
    const response = await fetch('/api/auth/wechat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      throw new Error('微信登录失败');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '微信登录失败');
  }
}

// 获取当前登录用户信息
export function getCurrentUser(): WechatUserInfo | null {
  try {
    const userInfoStr = localStorage.getItem('wechat_user');
    if (!userInfoStr) return null;

    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 退出登录
export function logout(): void {
  localStorage.removeItem('wechat_token');
  window.dispatchEvent(new Event('logout'));
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('wechat_token');
}