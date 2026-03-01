import { NextRequest } from 'next/server';
import { streamText } from 'ai';

const SYSTEM_PROMPT = `你是一个专业的中国股市AI助手，擅长：
1. 股票查询和分析
2. 市场趋势解读
3. 投资建议（仅供参考，不构成投资建议）
4. 技术指标解释
5. 股市新闻解读

请用中文回答用户的问题，回答要专业、准确、易懂。`;

/**
 * 创建模拟流式响应（当没有配置任何 API Key 时使用）
 */
function createMockStreamResponse(text: string) {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      // 按照 Vercel AI SDK 的数据流格式
      // 格式: 0:"text"\n 用于文本块，d:{"finishReason":"stop"}\n 用于结束
      const chunks = text.split('');
      
      for (let i = 0; i < chunks.length; i++) {
        const char = chunks[i];
        // 转义特殊字符
        let escaped = char;
        if (char === '"') escaped = '\\"';
        else if (char === '\n') escaped = '\\n';
        else if (char === '\r') escaped = '\\r';
        else if (char === '\\') escaped = '\\\\';
        
        const data = `0:"${escaped}"\n`;
        controller.enqueue(encoder.encode(data));
        // 模拟打字效果
        await new Promise(resolve => setTimeout(resolve, 15));
      }
      
      // 发送结束标记
      controller.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'));
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // 验证消息格式
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: '消息格式错误' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    // 优先使用智谱AI GLM-4（支持中文，性能强大）
    if (process.env.ZHIPU_API_KEY) {
      try {
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'glm-4-flash',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...formattedMessages,
            ],
            temperature: 0.7,
            max_tokens: 2000,
            stream: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || '智谱AI API 请求失败');
        }

        // 智谱AI返回流式响应，转换为Vercel AI SDK格式
        const stream = response.body;
        const encoder = new TextEncoder();

        const transformedStream = new ReadableStream({
          async start(controller) {
            if (!stream) {
              controller.close();
              return;
            }

            const reader = stream.getReader();
            const decoder = new TextDecoder();

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                      controller.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'));
                      continue;
                    }

                    try {
                      const parsed = JSON.parse(data);
                      const content = parsed.choices?.[0]?.delta?.content;
                      if (content) {
                        // 转义特殊字符
                        const escaped = content
                          .replace(/\\/g, '\\\\')
                          .replace(/"/g, '\\"')
                          .replace(/\n/g, '\\n')
                          .replace(/\r/g, '\\r');
                        controller.enqueue(encoder.encode(`0:"${escaped}"\n`));
                      }
                    } catch (e) {
                      // 忽略解析错误
                    }
                  }
                }
              }
              controller.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'));
            } catch (error) {
              controller.error(error);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(transformedStream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Vercel-AI-Data-Stream': 'v1',
            'Cache-Control': 'no-cache',
          },
        });
      } catch (error) {
        console.error('智谱AI API 错误:', error);
        // 如果智谱AI失败，继续尝试其他服务
      }
    }

    // 备选：使用 DeepSeek（性价比高，支持中文）
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const { deepseek } = await import('@ai-sdk/deepseek');
        
        const result = await streamText({
          model: deepseek('deepseek-chat'),
          system: SYSTEM_PROMPT,
          messages: formattedMessages,
          temperature: 0.7,
          maxTokens: 2000,
        });

        return result.toDataStreamResponse();
      } catch (error) {
        console.error('DeepSeek API 错误:', error);
        // 如果 DeepSeek 失败，继续尝试 OpenAI
      }
    }

    // 备选：使用 OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const { openai } = await import('@ai-sdk/openai');
        
        const result = await streamText({
          model: openai('gpt-4o-mini'),
          system: SYSTEM_PROMPT,
          messages: formattedMessages,
          temperature: 0.7,
          maxTokens: 2000,
        });

        return result.toDataStreamResponse();
      } catch (error) {
        console.error('OpenAI API 错误:', error);
        // 如果 OpenAI 也失败，使用模拟响应
      }
    }

    // 如果都没有配置，使用模拟响应
    const mockText = 'AI功能需要配置API Key。推荐使用DeepSeek（性价比高，支持中文）或OpenAI。\n\n当前返回模拟响应：\n\n感谢您的提问！作为股市AI助手，我可以帮助您：\n1. 查询股票信息\n2. 分析市场趋势\n3. 解读技术指标\n4. 提供投资建议（仅供参考）\n\n请在 .env.local 中配置 DEEPSEEK_API_KEY 或 OPENAI_API_KEY 后使用完整功能。';
    
    const stream = createMockStreamResponse(mockText);
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    });
  } catch (error) {
    console.error('AI聊天请求失败:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI服务暂时不可用';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
