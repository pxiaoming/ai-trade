'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';

interface AlertItem {
  type: string;
  icon: string;
  color: string;
  content: string;
  level?: string;
  action?: string;
  indicator?: string;
  signal?: string;
  event?: string;
  date?: string;
  impact?: string;
  trend?: string;
}

interface AlertResult {
  stockCode: string;
  stockName: string;
  alerts: AlertItem[];
  technicalSignals: AlertItem[];
  events: AlertItem[];
  capital: AlertItem[];
  summary: string;
}

const getLevelColor = (level?: string) => {
  switch (level) {
    case '高': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    case '中': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    case '低': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  }
};

const getTrendColor = (trend?: string) => {
  if (trend?.includes('流入')) return 'text-red-600 dark:text-red-400';
  if (trend?.includes('流出')) return 'text-green-600 dark:text-green-400';
  return 'text-gray-600 dark:text-gray-400';
};

export function SmartAlert() {
  const [stockCode, setStockCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AlertResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckAlerts = async () => {
    if (!stockCode.trim()) {
      setError('请输入股票代码');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCode: stockCode.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取提醒失败，请稍后重试');
      }

      const data: AlertResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取提醒失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const AlertCard = ({ item, title, type }: { item: AlertItem; title: string; type: string }) => {
    const cardColor = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    };

    const colorClass = cardColor[item.color as keyof typeof cardColor] || cardColor.blue;

    return (
      <div className={`p-3 rounded-lg border ${colorClass} hover:shadow-md transition-shadow`}>
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl">{item.icon}</span>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{title}</div>
            {item.indicator && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.indicator}: <span className="font-medium">{item.signal}</span>
              </div>
            )}
            {item.event && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.event} <span className="font-medium">({item.date})</span>
              </div>
            )}
          </div>
          {item.level && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(item.level)}`}>
              {item.level}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.content}</p>
        {item.impact && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            影响：{item.impact}
          </p>
        )}
        {item.action && (
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            💡 建议：{item.action}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card title="智能提醒" className="h-full flex flex-col">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={stockCode}
            onChange={(e) => setStockCode(e.target.value)}
            placeholder="输入股票代码（如：000001）"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleCheckAlerts()}
          />
          <Button onClick={handleCheckAlerts} disabled={loading} className="w-full sm:w-auto">
            {loading ? '获取中...' : '获取提醒'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && <Loading text="正在分析智能提醒..." />}

        {result && !loading && (
          <div className="space-y-3 animate-fadeIn">
            {/* 标题 */}
            <div className="text-center py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {result.stockName} ({result.stockCode})
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">智能提醒分析</div>
            </div>

            {/* 价格提醒 */}
            {result.alerts && result.alerts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span>💰</span> 价格提醒
                </h4>
                <div className="space-y-2">
                  {result.alerts.map((item, idx) => (
                    <AlertCard key={idx} item={item} title={item.type} type="alert" />
                  ))}
                </div>
              </div>
            )}

            {/* 技术指标提醒 */}
            {result.technicalSignals && result.technicalSignals.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span>📊</span> 技术指标提醒
                </h4>
                <div className="space-y-2">
                  {result.technicalSignals.map((item, idx) => (
                    <AlertCard key={idx} item={item} title={item.type} type="technical" />
                  ))}
                </div>
              </div>
            )}

            {/* 事件提醒 */}
            {result.events && result.events.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span>📅</span> 事件提醒
                </h4>
                <div className="space-y-2">
                  {result.events.map((item, idx) => (
                    <AlertCard key={idx} item={item} title={item.type} type="event" />
                  ))}
                </div>
              </div>
            )}

            {/* 资金提醒 */}
            {result.capital && result.capital.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span>💧</span> 资金提醒
                </h4>
                <div className="space-y-2">
                  {result.capital.map((item, idx) => (
                    <div key={idx} className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">{item.content}</div>
                          <div className={`text-sm font-medium ${getTrendColor(item.trend)} mb-1`}>
                            {item.trend}
                          </div>
                          {item.action && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              💡 建议：{item.action}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 综合建议 */}
            {result.summary && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">综合建议</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
