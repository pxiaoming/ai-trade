/**
 * AI聊天服务集成
 * 使用Vercel AI SDK
 */

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// 如果没有配置OpenAI，可以使用其他模型
// import { anthropic } from '@ai-sdk/anthropic';

/**
 * AI助手系统提示词
 */
const SYSTEM_PROMPT = `你是一个专业的中国股市AI助手，擅长：
1. 股票查询和分析
2. 市场趋势解读
3. 投资建议（仅供参考，不构成投资建议）
4. 技术指标解释
5. 股市新闻解读

请用中文回答用户的问题，回答要专业、准确、易懂。`;

/**
 * 处理AI聊天请求
 */
export async function handleChatRequest(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
  try {
    // 检查是否配置了OpenAI API Key
    if (!process.env.OPENAI_API_KEY) {
      // 如果没有配置，返回模拟响应
      return {
        text: 'AI功能需要配置OPENAI_API_KEY环境变量。当前返回模拟响应：\n\n感谢您的提问！作为股市AI助手，我可以帮助您：\n1. 查询股票信息\n2. 分析市场趋势\n3. 解读技术指标\n4. 提供投资建议（仅供参考）\n\n请配置OPENAI_API_KEY后使用完整功能。',
      };
    }

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result;
  } catch (error) {
    console.error('AI聊天请求失败:', error);
    throw error;
  }
}
