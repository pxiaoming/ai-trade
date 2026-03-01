# 故障排查指南

## 常见问题及解决方案

### 1. 模块导入错误

如果遇到 `Cannot find module` 或 `Module not found` 错误：

**解决方案：**
- 确保已安装所有依赖：`npm install`
- 检查 `tsconfig.json` 中的路径别名配置是否正确
- 确保 `@/` 路径别名指向项目根目录

### 2. AI 聊天功能错误

如果 AI 聊天功能无法正常工作：

**可能原因：**
- 未配置 `OPENAI_API_KEY` 环境变量（会使用模拟响应）
- `@ai-sdk/openai` 包未正确安装

**解决方案：**
```bash
# 安装依赖
npm install @ai-sdk/openai

# 创建 .env.local 文件（可选）
echo "OPENAI_API_KEY=your_key_here" > .env.local
```

### 3. 类型错误

如果遇到 TypeScript 类型错误：

**解决方案：**
- 检查 `types/` 目录下的类型定义是否完整
- 确保所有导入的类型都已正确定义
- 运行 `npm run build` 查看详细错误信息

### 4. 运行时错误

如果页面加载时出现运行时错误：

**检查项：**
- 浏览器控制台的完整错误信息
- 网络请求是否成功（检查 Network 标签）
- API 路由是否正常工作

### 5. 样式问题

如果 Tailwind CSS 样式未生效：

**解决方案：**
- 确保 `tailwind.config.ts` 配置正确
- 检查 `app/globals.css` 中是否导入了 Tailwind
- 重启开发服务器

## 调试步骤

1. **查看浏览器控制台**
   - 打开开发者工具（F12）
   - 查看 Console 标签中的错误信息
   - 查看 Network 标签中的请求状态

2. **检查服务器日志**
   - 查看终端中的 Next.js 开发服务器输出
   - 查找编译错误或运行时错误

3. **验证依赖安装**
   ```bash
   npm install
   npm run build
   ```

4. **检查环境变量**
   - 确保 `.env.local` 文件存在（如果需要）
   - 验证环境变量名称是否正确

## 获取帮助

如果问题仍然存在，请提供：
1. 完整的错误消息
2. 浏览器控制台截图
3. 终端中的错误日志
4. 重现错误的步骤
