import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `你是一个专业的中国股市AI分析师，擅长从多个维度对股票进行综合分析。

请分析用户指定的股票，返回JSON格式的多维度分析结果，包含以下字段：

{
  "stockCode": "股票代码",
  "stockName": "股票名称",
  "overallScore": 综合评分 (0-100的数字),
  "analysis": {
    "technical": {
      "score": 技术面评分 (0-100),
      "trend": "趋势方向 (上涨/下跌/震荡)",
      "indicators": {
        "MACD": "指标状态 + 信号 (多头/空头/中性 + 金叉/死叉/中性)",
        "RSI": "当前值 + 状态 (超买/超卖/中性)",
        "KDJ": "当前状态 (金叉/死叉/中性)",
        "MA": "均线排列 (多头/空头/中性)",
        "volume": "成交量状态 (放量/缩量/正常)"
      },
      "summary": "技术面分析总结，包括趋势、形态、压力支撑等"
    },
    "fundamental": {
      "score": 基本面评分 (0-100),
      "valuation": {
        "PE": "市盈率水平 (高估/合理/低估)",
        "PB": "市净率水平",
        "PEG": "增长比率"
      },
      "financial": {
        "profitability": "盈利能力评价",
        "growth": "成长性评价",
        "debt": "偿债能力评价"
      },
      "industry": "行业地位和竞争优势描述",
      "summary": "基本面分析总结，包括估值水平、财务健康度等"
    },
    "capital": {
      "score": 资金面评分 (0-100),
      "mainForce": "主力资金流向 (大幅流入/流入/流出/大幅流出)",
      "northbound": "北向资金动向",
      "institution": "机构持仓变化趋势",
      "summary": "资金面分析总结，主力态度、资金动向等"
    },
    "sentiment": {
      "score": 情绪面评分 (0-100),
      "newsSentiment": "新闻舆情 (正面/中性/负面)",
      "marketHeat": "市场热度 (高/中/低)",
      "investorEmotion": "投资者情绪 (贪婪/中性/恐慌)",
      "summary": "情绪面分析总结，舆情、热度等"
    }
  },
  "recommendation": {
    "action": "建议操作 (买入/持有/卖出)",
    "targetPrice": "目标价位（估算）",
    "stopLoss": "止损位建议",
    "riskLevel": "风险等级 (低/中/高)",
    "reason": "给出此建议的综合理由"
  }
}

评分标准：
- 80-100分：表现优秀/非常积极
- 60-79分：表现良好/积极
- 40-59分：表现一般/中性
- 0-39分：表现较差/消极

请用中文回答，分析要专业、客观、有数据支撑。`;

export async function POST(req: NextRequest) {
  try {
    const { stockCode } = await req.json();

    if (!stockCode || !stockCode.trim()) {
      return new Response(
        JSON.stringify({ error: '请输入股票代码' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 调用智谱AI进行多维度分析
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
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `请对股票代码 ${stockCode.trim()} 进行全面的多维度分析，返回JSON格式的详细结果。`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
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

    // 尝试解析AI返回的JSON
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      const analysisResult = JSON.parse(jsonStr);

      return new Response(
        JSON.stringify(analysisResult),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.warn('JSON解析失败，返回原始内容:', parseError);
      return new Response(
        JSON.stringify({
          error: '分析结果格式异常',
          rawContent: content,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('多维度分析请求失败:', error);
    const errorMessage = error instanceof Error ? error.message : 'AI服务暂时不可用';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
