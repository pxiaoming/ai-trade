# 股票数据API设置指南

## 快速开始

### 方式1：使用模拟数据（默认）

无需任何配置，直接运行项目即可使用模拟数据。

### 方式2：使用真实API（新浪财经）

1. **创建环境变量文件**

在项目根目录创建 `.env.local` 文件：

```env
# 启用真实API（使用新浪财经）
USE_REAL_API=true
```

2. **重启开发服务器**

```bash
npm run dev
```

## 详细说明

### 新浪财经API（推荐）

**优点**：
- ✅ 完全免费
- ✅ 无需申请
- ✅ 数据实时
- ✅ 接口相对稳定

**注意事项**：
- ⚠️ 仅供学习使用
- ⚠️ 不保证长期稳定性
- ⚠️ 可能有调用频率限制
- ⚠️ 需要在服务器端调用（避免CORS问题）

**数据来源**：
- 实时行情：`https://hq.sinajs.cn/list=股票代码`
- 排行榜：`https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData`

### 其他API选项

如需使用其他API，请参考 [API集成指南](./API_INTEGRATION.md)

## 故障排查

### 问题1：真实API返回空数据

**可能原因**：
- 网络连接问题
- API接口变更
- 请求频率过高被限制

**解决方案**：
1. 检查网络连接
2. 查看控制台错误信息
3. 暂时切换回模拟数据模式（设置 `USE_REAL_API=false`）

### 问题2：CORS错误

**说明**：新浪财经API在浏览器端可能遇到CORS限制

**解决方案**：
- 所有API调用都在Next.js服务器端进行，不会出现CORS问题
- 如果仍有问题，检查是否在客户端组件中直接调用了API

## 切换回模拟数据

如果真实API出现问题，可以随时切换回模拟数据：

```env
# .env.local
USE_REAL_API=false
```

或者直接删除 `USE_REAL_API` 配置项。
