import type { NextConfig } from "next";

const repo = "ai-trade"

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,

  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,

  // 图片配置
  images: {
    unoptimized: true,
  },

  // Webpack 配置，用于排除某些文件
  webpack: (config, { dev, isServer }) => {
    // 不打包 Node.js 模块到客户端
    if (!dev && !isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

};

export default nextConfig;
