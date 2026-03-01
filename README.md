# 中国股市AI助手

一个现代化的中国股市AI助手看板，提供实时股票涨跌幅排行榜、AI问答对话和股票分析功能。

## ✨ 功能特性

- 📊 **实时涨跌幅排行榜**：显示当日涨幅和跌幅TOP 10股票，自动刷新
- 🤖 **AI问答助手**：基于Vercel AI SDK的智能对话，支持股票查询、市场分析等
- 📈 **股票分析**：基于AI的个股分析报告和技术指标分析
- 🎨 **现代化UI**：响应式设计，支持深色模式，流畅的交互体验

## 🛠 技术栈

- **框架**：Next.js 15 (App Router)
- **UI库**：React 19 + Tailwind CSS
- **AI集成**：Vercel AI SDK (@ai-sdk/openai)
- **数据可视化**：Recharts
- **实时通信**：Socket.io (待实现)
- **类型安全**：TypeScript

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 环境配置

创建 `.env.local` 文件（可选）：

```env
# OpenAI API Key (可选，用于AI问答功能)
# 如果不配置，AI功能将返回模拟响应
OPENAI_API_KEY=your_openai_api_key_here

# 股票数据API配置（可选）
# 设置为 true 使用真实的新浪财经API，false 或未设置则使用模拟数据
USE_REAL_API=true
```

**快速启用新浪财经API**：查看 [快速设置指南](./docs/QUICK_START_SINA_API.md)

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
ai-trading/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 主看板页面
│   ├── api/                    # API路由
│   │   ├── stocks/            # 股票数据API
│   │   │   ├── top-gainers/   # 涨幅TOP 10
│   │   │   ├── top-losers/    # 跌幅TOP 10
│   │   │   └── ranking/       # 排行榜数据
│   │   └── ai/                # AI服务API
│   │       └── chat/          # AI问答接口
│   ├── components/
│   │   ├── dashboard/         # 看板组件
│   │   │   ├── StockRanking.tsx
│   │   │   ├── StockCard.tsx
│   │   │   └── MarketOverview.tsx
│   │   ├── ai/                # AI相关组件
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── NewsSummary.tsx
│   │   │   └── StockAnalysis.tsx
│   │   └── ui/                # 通用UI组件
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       └── Loading.tsx
│   └── lib/
│       ├── api/
│       │   └── eastmoney.ts   # 东方财富API客户端
│       ├── ai/
│       │   └── chat.ts        # AI服务集成
│       └── utils/
│           └── format.ts      # 格式化工具函数
├── types/                      # TypeScript类型定义
│   ├── stock.ts
│   └── news.ts
└── public/                     # 静态资源
```

## 🎯 功能模块

### 1. 实时涨跌幅排行榜
- 显示涨幅TOP 10和跌幅TOP 10股票
- 实时数据更新（每30秒自动刷新）
- 显示关键指标：价格、涨跌幅、成交量等

### 2. AI问答助手
- 基于Vercel AI SDK的对话界面
- 支持股票查询、市场分析、投资建议等
- 流式响应，实时显示AI回答

### 3. 股票分析
- 输入股票代码进行AI分析
- 技术指标分析（MACD、RSI、KDJ等）
- 投资建议和风险评估

## 📝 开发说明

### 数据源

#### 股票数据API

项目支持两种模式：

1. **模拟数据模式（默认）**：无需配置，直接使用
2. **真实API模式**：使用新浪财经API（免费，无需申请）

**启用真实API**：
- 在 `.env.local` 中设置 `USE_REAL_API=true`
- 详细说明请查看 [API集成指南](./docs/API_INTEGRATION.md)

**其他数据源选项**：
- 新浪财经API（已实现，推荐）
- 腾讯财经API
- Tushare（专业数据平台）
- 东方财富官方API（需申请）

#### 其他数据源

1. **新闻数据源**：当前使用模拟数据，可集成真实的新闻API
2. **股票分析**：当前使用模拟分析，可连接真实的股票数据API

### WebSocket实时推送

WebSocket功能已规划但尚未实现，后续可以：
- 使用Next.js API Routes + WebSocket服务器
- 实现实时数据推送，减少轮询请求
- 支持多客户端连接

## 🔧 配置说明

### AI功能配置

AI问答功能需要配置 `OPENAI_API_KEY` 环境变量。如果不配置，系统会返回模拟响应。

获取OpenAI API Key：
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建账户并获取API Key
3. 在 `.env.local` 文件中配置

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交Issue和Pull Request！
