'use client';

import { useState, useEffect, useCallback } from 'react';
import { FavoriteItem, CreateFavoriteRequest, UpdateFavoriteRequest } from '@/lib/types/favorite';
import {
  getFavorites,
  addFavorite as addFavoriteUtil,
  deleteFavorite as deleteFavoriteUtil,
  updateFavorite as updateFavoriteUtil,
  getFavoriteByStockCode,
  searchFavorites,
  getFavoritesByTag,
} from '@/lib/utils/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载收藏列表
  const loadFavorites = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const savedFavorites = getFavorites();
      setFavorites(savedFavorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加收藏
  const addFavorite = useCallback((request: CreateFavoriteRequest) => {
    try {
      const newFavorite = addFavoriteUtil(request);
      setFavorites(prev => [newFavorite, ...prev]);
      return newFavorite;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '添加失败');
    }
  }, []);

  // 删除收藏
  const removeFavorite = useCallback((id: string) => {
    try {
      const success = deleteFavoriteUtil(id);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.id !== id));
      }
      return success;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '删除失败');
    }
  }, []);

  // 更新收藏
  const updateFavorite = useCallback((id: string, request: UpdateFavoriteRequest) => {
    try {
      const updated = updateFavoriteUtil(id, request);
      if (updated) {
        setFavorites(prev => prev.map(fav =>
          fav.id === id ? updated : fav
        ));
      }
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '更新失败');
    }
  }, []);

  // 搜索收藏
  const search = useCallback((query: string) => {
    try {
      return searchFavorites(query);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '搜索失败');
    }
  }, []);

  // 按标签筛选
  const filterByTag = useCallback((tag: string) => {
    try {
      return getFavoritesByTag(tag);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '筛选失败');
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    updateFavorite,
    search,
    filterByTag,
    refresh: loadFavorites,
  };
}