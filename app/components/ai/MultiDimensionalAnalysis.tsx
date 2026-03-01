'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';
import { FavoriteButton } from '../ui/FavoriteButton';

interface DimensionAnalysis {
  score: number;
  [key: string]: any;
}

export interface AnalysisData {
  stockCode: string;
  stockName: string;
  overallScore: number;
  analysis: {
    technical: DimensionAnalysis;
    fundamental: DimensionAnalysis;
    capital: DimensionAnalysis;
    sentiment: DimensionAnalysis;
  };
  recommendation: {
    action: string;
    targetPrice?: string;
    stopLoss?: string;
    riskLevel: string;
    reason: string;
  };
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', bar: 'bg-green-500' };
  if (score >= 60) return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', bar: 'bg-blue-500' };
  if (score >= 40) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', bar: 'bg-yellow-500' };
  return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', bar: 'bg-red-500' };
};

const getActionColor = (action: string) => {
  switch (action) {
    case '买入': return 'bg-green-600 text-white';
    case '卖出': return 'bg-red-600 text-white';
    default: return 'bg-gray-600 text-white';
  }
};

const getRiskColor = (level: string) => {
  switch (level) {
    case '低': return 'text-green-600 dark:text-green-400';
    case '高': return 'text-red-600 dark:text-red-400';
    default: return 'text-yellow-600 dark:text-yellow-400';
  }
};

export function MultiDimensionalAnalysis() {
  const [stockCode, setStockCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!stockCode.trim()) {
      setError('请输入股票代码');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/multi-dim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockCode: stockCode.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '分析失败，请稍后重试');
      }

      const result: AnalysisData = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ score, label }: { score: number; label: string }) => {
    const colors = getScoreColor(score);
    return (
      <div className="flex items-center gap-3 mb-3">
        <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`w-10 text-sm font-bold ${colors.text}`}>{score}</span>
      </div>
    );
  };

  const DimensionCard = ({
    title,
    data,
    icon,
    colorClass,
  }: {
    title: string;
    data: DimensionAnalysis;
    icon: string;
    colorClass: string;
  }) => {
    const colors = getScoreColor(data.score);
    return (
      <div className={`p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${colorClass}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <span className={`text-2xl font-bold ${colors.text}`}>{data.score}</span>
        </div>
        <ScoreBar score={data.score} label="评分" />
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {data.summary || '暂无分析'}
        </div>
      </div>
    );
  };

  return (
    <Card title="多维度AI分析" className="h-full flex flex-col">
      <div className="space-y-4">
        {/* 收藏提示 */}
        {showFavoriteSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-600 dark:text-green-300 text-sm animate-fadeIn">
            ✅ 已添加到收藏列表
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={stockCode}
            onChange={(e) => setStockCode(e.target.value)}
            placeholder="输入股票代码（如：000001）"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <Button onClick={handleAnalyze} disabled={loading} className="w-full sm:w-auto">
            {loading ? '分析中...' : '深度分析'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && <Loading text="正在深度分析..." />}

        {analysis && !loading && (
          <div className="space-y-4 animate-fadeIn">
            {/* 综合评分 */}
            <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">综合评分</div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore).text}`}>
                {analysis.overallScore}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {analysis.stockName} ({analysis.stockCode})
              </div>
            </div>

            {/* 四维度评分 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">维度评分</h4>
              <ScoreBar score={analysis.analysis.technical.score} label="技术面" />
              <ScoreBar score={analysis.analysis.fundamental.score} label="基本面" />
              <ScoreBar score={analysis.analysis.capital.score} label="资金面" />
              <ScoreBar score={analysis.analysis.sentiment.score} label="情绪面" />
            </div>

            {/* 四维度详细分析 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DimensionCard
                title="技术面"
                data={analysis.analysis.technical}
                icon="📈"
                colorClass="bg-blue-50 dark:bg-blue-900/20"
              />
              <DimensionCard
                title="基本面"
                data={analysis.analysis.fundamental}
                icon="💼"
                colorClass="bg-purple-50 dark:bg-purple-900/20"
              />
              <DimensionCard
                title="资金面"
                data={analysis.analysis.capital}
                icon="💰"
                colorClass="bg-green-50 dark:bg-green-900/20"
              />
              <DimensionCard
                title="情绪面"
                data={analysis.analysis.sentiment}
                icon="🎯"
                colorClass="bg-orange-50 dark:bg-orange-900/20"
              />
            </div>

            {/* 投资建议 */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">投资建议</h4>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getActionColor(analysis.recommendation.action)}`}>
                  {analysis.recommendation.action}
                </span>
                <span className={`text-sm font-medium ${getRiskColor(analysis.recommendation.riskLevel)}`}>
                  风险等级：{analysis.recommendation.riskLevel}
                </span>
              </div>
              {analysis.recommendation.targetPrice && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  目标价：{analysis.recommendation.targetPrice}
                </div>
              )}
              {analysis.recommendation.stopLoss && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  止损位：{analysis.recommendation.stopLoss}
                </div>
              )}
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>理由：</strong>{analysis.recommendation.reason}
              </div>
            </div>
          </div>
        )}

        {/* 收藏按钮 */}
        {analysis && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  保存分析结果
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  添加标签和备注，方便后续查看对比
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FavoriteButton
                  stockCode={analysis.stockCode}
                  stockName={analysis.stockName}
                  analysisData={analysis}
                  onFavorite={() => setShowFavoriteSuccess(true)}
                  variant="default"
                  size="md"
                />
                <Link
                  href="/favorites"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  查看收藏 →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
