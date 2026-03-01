# Vercel 部署指南

## 准备工作

### 1. 准备环境变量

创建 `.env.production` 文件，添加以下内容：

```env
# 微信开放平台配置
NEXT_PUBLIC_WECHAT_APP_ID=你的实际AppID
NEXT_PUBLIC_WECHAT_REDIRECT_URI=https://你的域名/auth/callback

# 基础配置
NEXT_PUBLIC_BASE_URL=https://你的域名

# AI API Keys
ZHIPU_API_KEY=生产环境的智谱AI API Key
USE_REAL_API=true
```

### 2. 准备 GitHub 仓库

1. 确保项目已推送到 GitHub
2. 创建 `.env.production` 文件到 `.gitignore` 中（避免提交敏感信息）

### 3. 修改代码

1. 更新 `next.config.ts` 支持静态导出
2. 确保所有前端资源路径正确
3. 检查所有 API 调用是否使用环境变量

## 部署步骤

### 步骤 1: 注册 Vercel 账号

1. 访问 [Vercel](https://vercel.com)
2. 注册并登录账号
3. 创建项目

### 步骤 2: 连接 GitHub 仓库

1. 在 Vercel 控制台选择"New Project"
2. 选择"Import from Git"
3. 选择你的 GitHub 仓库
4. 选择分支（通常使用 main）

### 步骤 3: 配置环境变量

1. 在 Vercel 项目设置中添加环境变量
2. 添加 `NEXT_PUBLIC_WECHAT_APP_ID`
3. 添加 `NEXT_PUBLIC_WECHAT_REDIRECT_URI`
4. 添加 `NEXT_PUBLIC_BASE_URL`
5. 添加 `ZHIPU_API_KEY`

### 步骤 4: 部署

1. 点击"Deploy"按钮
2. 等待构建完成
3. 部署完成后会显示 URL

### 步骤 5: 测试

1. 访问部署的 URL
2. 测试微信登录功能
3. 测试所有页面和功能

## 注意事项

### 1. 环境变量管理

- 敏感信息不要提交到代码仓库
- 使用 Vercel 提供的环境变量管理功能
- 定期轮换 API Keys

### 2. 微信开放平台配置

- 应用审核通过
- 更新回调域名为生产域名
- 配置移动应用信息

### 3. 部署后验证

- 微信登录功能正常
- AI 功能调用正常
- 收藏功能正常
- 移动端适配正常

## 常见问题

### 1. 部署失败

- 检查环境变量是否配置正确
- 确认 GitHub 仓库权限
- 检查代码是否有语法错误

### 2. 微信登录失败

- 确认 AppID 和回调域名是否正确
- 检查微信开放平台应用状态
- 确认服务器是否允许跨域请求

### 3. API 调用失败

- 检查 API Keys 是否正确
- 确认服务器网络是否正常
- 检查 API 限制是否达到

## 性能优化

### 1. CDN 配置

- 启用 Vercel CDN
- 配置缓存策略
- 优化静态资源加载

### 2. 静态资源优化

- 图片压缩
- 使用 WebP 格式
- 懒加载实现

### 3. 缓存策略

- 设置适当的缓存时间
- 使用 API 缓存
- 优化页面加载速度

## 监控和维护

### 1. 部署监控

- Vercel Analytics
- 错误日志收集
- 性能监控

### 2. 安全配置

- HTTPS 配置
- 访问控制
- 数据加密

### 3. 定期维护

- 代码更新
- 环境变量检查
- 性能优化