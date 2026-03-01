'use client';

import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { FavoriteModal } from './FavoriteModal';
import { getFavoriteByStockCode, addFavorite } from '@/lib/utils/favorites';
import { AnalysisData } from '../../components/ai/MultiDimensionalAnalysis';

interface FavoriteButtonProps {
  stockCode: string;
  stockName: string;
  analysisData: AnalysisData;
  onFavorite?: (favorite: any) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({
  stockCode,
  stockName,
  analysisData,
  onFavorite,
  variant = 'outline',
  size = 'md',
  className = '',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查是否已收藏
  React.useEffect(() => {
    const favorite = getFavoriteByStockCode(stockCode);
    setIsFavorited(!!favorite);
  }, [stockCode]);

  const handleAddFavorite = useCallback(async (data: { tags: string[]; notes: string }) => {
    setIsSubmitting(true);
    try {
      const favorite = addFavorite({
        stockCode,
        stockName,
        analysisData,
        tags: data.tags,
        notes: data.notes,
      });

      setIsFavorited(true);
      setIsModalOpen(false);
      onFavorite?.(favorite);
    } catch (error) {
      console.error('Error adding favorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [stockCode, stockName, analysisData, onFavorite]);

  const handleUpdateFavorite = useCallback(async (data: { tags: string[]; notes: string }) => {
    setIsSubmitting(true);
    try {
      const { updateFavorite } = await import('@/lib/utils/favorites');
      const updated = updateFavorite(
        getFavoriteByStockCode(stockCode)?.id || '',
        { tags: data.tags, notes: data.notes }
      );

      if (updated) {
        onFavorite?.(updated);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [stockCode, onFavorite]);

  const handleClick = () => {
    const existingFavorite = getFavoriteByStockCode(stockCode);
    if (existingFavorite) {
      // 如果已收藏，更新备注和标签
      setIsModalOpen(true);
    } else {
      // 如果未收藏，添加收藏
      handleAddFavorite({ tags: [], notes: '' });
    }
  };

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const heartIcon = (
    <svg
      className={`w-5 h-5 transition-all duration-300 ${
        isFavorited
          ? 'text-red-500 fill-current transform scale-110'
          : 'text-white group-hover:text-red-400'
      }`}
      fill={isFavorited ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ transition: 'all 0.3s ease' }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  // 根据变体选择样式
  const buttonClasses = `
    relative overflow-hidden
    group transition-all duration-300 ease-in-out
    ${isFavorited
      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg'
      : variant === 'default'
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
        : ''
    }
    ${variant === 'outline'
      ? 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      : variant === 'ghost'
        ? 'border-0 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
        : 'text-white'
    }
    ${isFavorited ? 'ring-2 ring-red-300/50' : ''}
    ${buttonSizeClasses[size]}
    ${className}
    font-medium rounded-lg
    active:scale-95
  `;

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isSubmitting}
        className={buttonClasses}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{isFavorited ? '更新中...' : '收藏中...'}</span>
          </>
        ) : (
          <>
            <div className="relative">
              {heartIcon}
              {/* 收藏时的动画效果 */}
              {isFavorited && (
                <div className="absolute inset-0 bg-white/30 rounded-lg animate-ping"></div>
              )}
            </div>
            <span className="font-medium">
              {isFavorited ? '已收藏' : '收藏分析'}
            </span>
          </>
        )}
      </Button>

      <FavoriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(data) => {
          const existingFavorite = getFavoriteByStockCode(stockCode);
          if (existingFavorite) {
            handleUpdateFavorite(data);
          } else {
            handleAddFavorite(data);
          }
        }}
        stockCode={stockCode}
        stockName={stockName}
        initialTags={getFavoriteByStockCode(stockCode)?.tags || []}
        initialNotes={getFavoriteByStockCode(stockCode)?.notes || ''}
      />
    </>
  );
}