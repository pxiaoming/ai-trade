# 部署上线指南

## 推荐方案

### 1. Vercel 部署（推荐）

**优点**：
- Next.js 官方推荐平台
- 免费额度（100GB 流量，10个项目）
- 自动 HTTPS、CDN 加速
- Git 部署，简单快捷
- 支持环境变量

**步骤**：
1. 注册 [Vercel](https://vercel.com) 账号
2. 导入 GitHub 仓库
3. 配置环境变量
4. 自动部署

### 2. 阿里云/腾讯云部署

**优点**：
- 国内访问速度快
- 服务器资源可控
- 成本相对较低

**推荐平台**：
- 阿里云：ECS + OSS
- 腾讯云：CVM + COS
- 宝塔面板（简化管理）

### 3. Docker 容器化部署

**优点**：
- 环境一致性
- 易于扩展和迁移
- 适合云服务器

## 部署前准备

### 1. 环境变量配置

创建 `.env.production` 文件：

```env
# 微信开放平台配置
NEXT_PUBLIC_WECHAT_APP_ID=你的实际AppID
NEXT_PUBLIC_WECHAT_REDIRECT_URI=https://你的域名/auth/callback

# AI API Keys
ZHIPU_API_KEY=生产环境的API Key

# 基础配置
NEXT_PUBLIC_BASE_URL=https://你的域名
```

### 2. 修改微信回调地址

在微信开放平台后台更新回调域名为你的生产域名。

### 3. 构建优化

```json
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态导出
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 其他配置...
};
```

## 安全配置

### 1. 环境变量安全
- 敏感信息不要提交到代码仓库
- 使用平台提供的环境变量管理
- 定期轮换 API Keys

### 2. HTTPS 配置
- 必须启用 HTTPS
- 使用 Let's Encrypt 免费证书

### 3. 防火墙设置
- 只开放必要端口（80, 443）
- 限制访问频率，防止 API 滥用

## 性能优化

### 1. CDN 加速
- 静态资源使用 CDN
- 图片压缩和懒加载

### 2. 缓存策略
- Redis 缓存热点数据
- API 响应缓存

### 3. 监控和分析
- 使用 Vercel Analytics
- 错误日志收集
- 性能监控

## 成本估算

### Vercel
- 免费版：足够个人/小型项目
- Pro 版：$20/月，更多资源

### 阿里云/腾讯云
- 2核4G服务器：约 200-300元/月
- 对象存储：约 10-20元/月
- CDN：流量费

## 域名和备案

1. 购买域名（阿里云/腾讯云）
2. 提交备案（国内服务器必需）
3. 配置 DNS 解析
4. 安装 SSL 证书

## 推荐部署顺序

1. **先上 Vercel** - 快速验证功能
2. **准备备案** - 如果需要国内访问
3. **迁移到国内服务器** - 保证访问速度
4. **配置监控** - 确保稳定运行

## 维护建议

1. 定期更新依赖包
2. 备份数据和配置
3. 监控服务器状态
4. 定期检查 API 使用情况