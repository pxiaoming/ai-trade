'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FavoriteItem } from '@/lib/types/favorite';

interface FavoriteItemCardProps {
  favorite: FavoriteItem;
  onDelete: (id: string) => void;
  onEdit: (favorite: FavoriteItem) => void;
  getScoreColor: (score: number) => string;
}

export function FavoriteItemCard({
  favorite,
  onDelete,
  onEdit,
  getScoreColor,
}: FavoriteItemCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300">
      <div className="p-5 flex-1 flex flex-col">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {favorite.stockName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {favorite.stockCode}
            </p>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(favorite.overallScore)}`}>
            {favorite.overallScore}
          </div>
        </div>

        {/* 分析摘要 */}
        <div className="space-y-3 mb-4 flex-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="line-clamp-2">{favorite.analysisData.recommendation.reason}</p>
          </div>

          {/* 标签 */}
          {favorite.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {favorite.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 备注信息 */}
          {favorite.notes && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-gray-700 dark:text-gray-300">
              <div className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">
                备注说明
              </div>
              <p className="text-xs line-clamp-2">{favorite.notes}</p>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>收藏于 {formatDate(favorite.createdAt)}</span>
            <span>更新于 {formatDate(favorite.updatedAt)}</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // 这里可以添加查看详情功能
                console.log('View favorite:', favorite.id);
              }}
              className="flex-1"
            >
              查看详情
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(favorite)}
              className="px-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(favorite.id)}
              className="px-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}