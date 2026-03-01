'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { TagInput } from './TagInput';

interface FavoriteModalProps {
  stockCode: string;
  stockName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { tags: string[]; notes: string }) => void;
  initialTags?: string[];
  initialNotes?: string;
}

export function FavoriteModal({
  stockCode,
  stockName,
  isOpen,
  onClose,
  onConfirm,
  initialTags = [],
  initialNotes = '',
}: FavoriteModalProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      onConfirm({ tags, notes });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            收藏股票分析
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            股票代码
          </div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {stockCode} - {stockName}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分组标签
            </label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="添加标签，如：短线、科技、重点关注"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              用于分类管理收藏的股票
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              备注说明（可选）
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="添加收藏理由或观察要点..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '保存中...' : '确认收藏'}
          </Button>
        </div>
      </div>
    </div>
  );
}