import { NextRequest } from 'next/server';

const STRATEGY_PROMPTS = {
  short: `你是一个专业的短线选股AI助手，擅长挖掘短线机会。

请根据以下短线策略筛选A股股票，返回JSON格式结果：

{
  "strategy": "短线量价配合策略",
  "description": "策略描述",
  "stockList": [
    {
      "code": "股票代码",
      "name": "股票名称",
      "price": "当前价格（估算）",
      "reason": "选入理由（简短，50字内）",
      "targetGain": "预期涨幅",
      "risk": "风险提示"
    }
  ],
  "marketCondition": "当前市场环境判断",
  "attention": "注意事项和风险提示"
}

短线策略关注点：
- 放量突破关键阻力位
- 缩量回调后的反弹机会
- 连续涨停后的机会
- 强势股回调买点

请推荐5-8只最具潜力的股票。`,

  mid: `你是一个专业的中线选股AI助手，擅长趋势跟踪和基本面筛选。

请根据以下中线策略筛选A股股票，返回JSON格式结果：

{
  "strategy": "中线趋势跟踪策略",
  "description": "策略描述",
  "stockList": [
    {
      "code": "股票代码",
      "name": "股票名称",
      "price": "当前价格（估算）",
      "reason": "选入理由（简短，50字内）",
      "targetGain": "预期涨幅",
      "risk": "风险提示"
    }
  ],
  "marketCondition": "当前市场环境判断",
  "attention": "注意事项和风险提示"
}

中线策略关注点：
- 上升趋势中的优质标的
- 业绩增长+估值合理的公司
- 行业龙头或细分领域龙头
- 具有持续成长性的公司

请推荐5-8只最具潜力的股票。`,

  long: `你是一个专业的长线价值投资AI助手，擅长挖掘价值股。

请根据以下长线价值投资策略筛选A股股票，返回JSON格式结果：

{
  "strategy": "长线价值投资策略",
  "description": "策略描述",
  "stockList": [
    {
      "code": "股票代码",
      "name": "股票名称",
      "price": "当前价格（估算）",
      "reason": "选入理由（简短，50字内）",
      "targetGain": "预期涨幅",
      "risk": "风险提示"
    }
  ],
  "marketCondition": "当前市场环境判断",
  "attention": "注意事项和风险提示"
}

长线策略关注点：
- 低估值高分红的优质公司
- 行业地位稳固的龙头企业
- 具有长期护城河的公司
- 处于热门赛道的成长股

请推荐5-8只最具潜力的股票。`,
};

export async function POST(req: NextRequest) {
  try {
    const { strategy = 'short' } = await req.json();

    if (!['short', 'mid', 'long'].includes(strategy)) {
      return new Response(
        JSON.stringify({ error: '策略类型无效' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = STRATEGY_PROMPTS[strategy as keyof typeof STRATEGY_PROMPTS];

    // 调用智谱AI进行选股
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '智谱AI API 请求失败');
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
        JSON.stringify({ error: '选股结果格式异常', rawContent: content }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('选股策略请求失败:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI服务暂时不可用';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
