'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';
import { FavoriteButton } from '../ui/FavoriteButton';
// 定义收藏需要的分析数据结构
interface AnalysisData {
  stockCode: string;
  stockName: string;
  overallScore: number;
  analysis: {
    technical: { score: number; [key: string]: any };
    fundamental: { score: number; [key: string]: any };
    capital: { score: number; [key: string]: any };
    sentiment: { score: number; [key: string]: any };
  };
  recommendation: {
    action: string;
    targetPrice?: string;
    stopLoss?: string;
    riskLevel: string;
    reason: string;
  };
}

type StrategyType = 'short' | 'mid' | 'long';

interface StrategyInfo {
  id: StrategyType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const STRATEGIES: StrategyInfo[] = [
  {
    id: 'short',
    name: '短线策略',
    description: '量价配合、涨停分析，捕捉短期机会',
    icon: '⚡',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'mid',
    name: '中线策略',
    description: '趋势跟踪、基本面筛选，把握中期行情',
    icon: '📊',
    color: 'from-blue-400 to-purple-500',
  },
  {
    id: 'long',
    name: '长线策略',
    description: '价值投资、行业龙头，稳健长期配置',
    icon: '🏆',
    color: 'from-green-400 to-teal-500',
  },
];

interface StockItem {
  code: string;
  name: string;
  price: string;
  reason: string;
  targetGain: string;
  risk: string;
}

interface ScreeningResult {
  strategy: string;
  description: string;
  stockList: StockItem[];
  marketCondition: string;
  attention: string;
}

export function StockScreening() {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('short');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScreen = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: selectedStrategy }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '选股失败，请稍后重试');
      }

      const data: ScreeningResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '选股失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const StrategyCard = ({ strategy, onClick }: { strategy: StrategyInfo; onClick: () => void }) => {
    const isSelected = selectedStrategy === strategy.id;
    return (
      <button
        onClick={onClick}
        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="text-3xl mb-2">{strategy.icon}</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{strategy.name}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">{strategy.description}</p>
      </button>
    );
  };

  return (
    <Card title="AI智能选股" className="h-full flex flex-col">
      <div className="space-y-4">
        {/* 策略选择 */}
        <div className="grid grid-cols-3 gap-2">
          {STRATEGIES.map((s) => (
            <StrategyCard key={s.id} strategy={s} onClick={() => setSelectedStrategy(s.id)} />
          ))}
        </div>

        <Button onClick={handleScreen} disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              <span>智能筛选中...</span>
            </span>
          ) : (
            '开始选股'
          )}
        </Button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && <Loading text="AI正在智能筛选..." />}

        {result && !loading && (
          <div className="space-y-3 animate-fadeIn">
            {/* 策略描述 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{result.strategy}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{result.description}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                市场环境：{result.marketCondition}
              </div>
            </div>

            {/* 股票列表 */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">推荐股票</h4>
              <div className="space-y-2">
                {result.stockList.map((stock, idx) => {
                  // 创建默认的分析数据用于收藏
                  const defaultAnalysisData: AnalysisData = {
                    stockCode: stock.code,
                    stockName: stock.name,
                    overallScore: 75, // 默认分数
                    analysis: {
                      technical: { score: 80, trend: '上升', momentum: '积极' },
                      fundamental: { score: 70, pe: '合理', growth: '良好' },
                      capital: { score: 70, volume: '活跃', flow: '流入' },
                      sentiment: { score: 75, news: '正面', sentiment: '乐观' }
                    },
                    recommendation: {
                      action: '买入',
                      targetPrice: `+${stock.targetGain}`,
                      riskLevel: '中等',
                      reason: stock.reason
                    }
                  };

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {stock.name} ({stock.code})
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">价格：{stock.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600 dark:text-green-400">
                              {stock.targetGain}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <FavoriteButton
                              stockCode={stock.code}
                              stockName={stock.name}
                              analysisData={defaultAnalysisData}
                              size="sm"
                              variant="outline"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stock.reason}</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        ⚠️ {stock.risk}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 注意事项 */}
            {result.attention && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1 text-sm">⚠️ 注意事项</h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">{result.attention}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
