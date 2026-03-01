'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TagFilter } from './TagFilter';
import { FavoriteItemCard } from './FavoriteItemCard';
import { FavoriteModal } from '../ui/FavoriteModal';
import { FavoriteItem } from '@/lib/types/favorite';
import { getFavoriteByStockCode, deleteFavorite } from '@/lib/utils/favorites';

export function FavoriteList() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 获取收藏列表
  useEffect(() => {
    loadFavorites();
  }, []);

  // 应用搜索和筛选
  useEffect(() => {
    let result = favorites;

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(fav =>
        fav.stockCode.toLowerCase().includes(query) ||
        fav.stockName.toLowerCase().includes(query)
      );
    }

    // 标签筛选
    if (selectedTag) {
      result = result.filter(fav => fav.tags.includes(selectedTag));
    }

    setFilteredFavorites(result);
  }, [favorites, searchQuery, selectedTag]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      // 先从本地存储获取（为了即时响应）
      const { getFavorites } = await import('@/lib/utils/favorites');
      const localFavorites = getFavorites();
      setFavorites(localFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个收藏吗？')) {
      try {
        await deleteFavorite(id);
        setFavorites(prev => prev.filter(fav => fav.id !== id));
      } catch (error) {
        console.error('Error deleting favorite:', error);
      }
    }
  };

  const handleEdit = (favorite: FavoriteItem) => {
    setSelectedFavorite(favorite);
    setIsEditing(true);
  };

  const handleUpdate = async (data: { tags: string[]; notes: string }) => {
    if (!selectedFavorite) return;

    try {
      const { updateFavorite } = await import('@/lib/utils/favorites');
      const updated = updateFavorite(selectedFavorite.id, data);

      if (updated) {
        setFavorites(prev => prev.map(fav =>
          fav.id === updated.id ? updated : fav
        ));
      }

      setIsEditing(false);
      setSelectedFavorite(null);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="text-gray-500">加载中...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      {/* 收藏列表 */}
      {filteredFavorites.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              {favorites.length === 0 ? '暂无收藏' : '没有找到匹配的收藏'}
            </div>
            {favorites.length === 0 && (
              <p className="text-sm text-gray-500">
                使用多维度分析功能，点击"收藏分析"按钮将感兴趣的股票加入收藏
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFavorites.map((favorite) => (
            <FavoriteItemCard
              key={favorite.id}
              favorite={favorite}
              onDelete={handleDelete}
              onEdit={handleEdit}
              getScoreColor={getScoreColor}
            />
          ))}
        </div>
      )}

      {/* 编辑收藏弹窗 */}
      <FavoriteModal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedFavorite(null);
        }}
        onConfirm={handleUpdate}
        stockCode={selectedFavorite?.stockCode || ''}
        stockName={selectedFavorite?.stockName || ''}
        initialTags={selectedFavorite?.tags || []}
        initialNotes={selectedFavorite?.notes || ''}
      />
    </div>
  );
}