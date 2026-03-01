'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MultiDimensionalAnalysis } from './components/ai/MultiDimensionalAnalysis';
import { StockScreening } from './components/ai/StockScreening';
import { SmartAlert } from './components/ai/SmartAlert';
import { Card } from './components/ui/Card';
import { MainLayout } from './components/layout/MainLayout';
import { Button } from './components/ui/Button';
import { Heart, BookOpen } from 'lucide-react';

type AIPage = 'multiDim' | 'screening' | 'alert';

const AI_PAGES = [
  { id: 'multiDim' as const, name: '多维度分析', icon: '🎯' },
  { id: 'screening' as const, name: '智能选股', icon: '🔍' },
  // { id: 'alert' as const, name: '智能提醒', icon: '🔔' },
];

export default function Home() {
  const [aiPage, setAiPage] = useState<AIPage>('multiDim');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-8 animate-slideIn text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI股票分析助手
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-6">
            基于AI大模型的专业股票分析工具
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="space-y-6">
          {/* AI功能标签页 */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {AI_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setAiPage(page.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    aiPage === page.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md'
                  }`}
                >
                  <span className="text-lg">{page.icon}</span>
                  <span className="hidden sm:inline">{page.name}</span>
                  <span className="sm:hidden">{page.name}</span>
                </button>
              ))}
            </div>

            {/* AI功能内容 */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {aiPage === 'multiDim' && <MultiDimensionalAnalysis />}
              {aiPage === 'screening' && <StockScreening />}
              {aiPage === 'alert' && <SmartAlert />}
            </div>
          </div>

          {/* 底部说明 */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>⚠️ 免责声明：本工具提供的信息仅供参考，不构成投资建议</p>
            <p className="mt-2">投资有风险，决策需谨慎</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
