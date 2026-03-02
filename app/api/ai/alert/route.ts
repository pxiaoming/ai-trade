import { NextRequest } from 'next/server';

const ALERT_PROMPT = `你是一个专业的股市智能提醒AI助手，擅长分析股票并给出各种提醒。

请分析用户指定的股票，返回JSON格式的智能提醒结果：

{
  "stockCode": "股票代码",
  "stockName": "股票名称",
  "alerts": [
    {
      "type": "价格提醒",
      "icon": "💰",
      "color": "blue",
      "content": "具体提醒内容（突破/跌破目标价位等）",
      "level": "高/中/低",
      "action": "建议操作"
    }
  ],
  "technicalSignals": [
    {
      "type": "技术指标提醒",
      "icon": "📊",
      "color": "green/red",
      "indicator": "指标名称（MACD/RSI/KDJ等）",
      "signal": "金叉/死叉/超买/超卖等",
      "content": "具体说明",
      "level": "高/中/低",
      "action": "建议操作"
    }
  ],
  "events": [
    {
      "type": "事件提醒",
      "icon": "📅",
      "color": "orange",
      "event": "事件类型（财报/分红/解禁等）",
      "date": "预计时间",
      "content": "具体说明",
      "impact": "影响评估",
      "action": "建议操作"
    }
  ],
  "capital": [
    {
      "type": "资金提醒",
      "icon": "💧",
      "color": "purple",
      "content": "资金动向说明",
      "trend": "流入/流出",
      "level": "高/中/低",
      "action": "建议操作"
    }
  ],
  "summary": "整体风险评价和操作建议"
}

请根据股票代码分析，给出全面的智能提醒。`;

export async function POST(req: NextRequest) {
  try {
    const { stockCode } = await req.json();

    if (!stockCode || !stockCode.trim()) {
      return new Response(
        JSON.stringify({ error: '请输入股票代码' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 调用deepseek生成智能提醒
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',  // deepseek-chat-v3
        messages: [
          {
            role: 'user',
            content: `请为股票代码 ${stockCode.trim()} 生成智能提醒，返回JSON格式的详细结果。`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'deepseek API 请求失败');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI返回内容为空');
    }

    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const result = JSON.parse(jsonStr);

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.warn('JSON解析失败:', parseError);
      return new Response(
        JSON.stringify({ error: '提醒结果格式异常', rawContent: content }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('智能提醒请求失败:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI服务暂时不可用';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
