import { FavoriteItem, CreateFavoriteRequest, UpdateFavoriteRequest } from '@/lib/types/favorite';

const FAVORITES_KEY = 'ai-trading-favorites';
const CURRENT_VERSION = '1.0.0';

// 获取所有收藏
export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];

    const data = JSON.parse(stored);
    // 转换日期字符串为Date对象
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

// 添加收藏
export const addFavorite = (request: CreateFavoriteRequest): FavoriteItem => {
  const favorites = getFavorites();

  // 检查是否已收藏
  const existingIndex = favorites.findIndex(
    f => f.stockCode === request.stockCode
  );

  if (existingIndex !== -1) {
    // 更新现有收藏
    const updatedFavorite = {
      ...favorites[existingIndex],
      ...request,
      updatedAt: new Date(),
      version: CURRENT_VERSION,
    };
    favorites[existingIndex] = updatedFavorite;
  } else {
    // 创建新收藏
    const newFavorite: FavoriteItem = {
      id: generateId(),
      stockCode: request.stockCode,
      stockName: request.stockName,
      overallScore: request.analysisData.overallScore,
      analysisData: request.analysisData,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: request.tags || [],
      notes: request.notes,
      version: CURRENT_VERSION,
    };
    favorites.unshift(newFavorite); // 新收藏放在最前面
  }

  saveFavorites(favorites);
  return favorites.find(f => f.stockCode === request.stockCode)!;
};

// 删除收藏
export const deleteFavorite = (id: string): boolean => {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.id !== id);

  if (filtered.length !== favorites.length) {
    saveFavorites(filtered);
    return true;
  }
  return false;
};

// 更新收藏
export const updateFavorite = (id: string, request: UpdateFavoriteRequest): FavoriteItem | null => {
  const favorites = getFavorites();
  const index = favorites.findIndex(f => f.id === id);

  if (index !== -1) {
    const updated = {
      ...favorites[index],
      ...request,
      updatedAt: new Date(),
    };
    favorites[index] = updated;
    saveFavorites(favorites);
    return updated;
  }
  return null;
};

// 根据股票代码查询收藏
export const getFavoriteByStockCode = (stockCode: string): FavoriteItem | null => {
  const favorites = getFavorites();
  return favorites.find(f => f.stockCode === stockCode) || null;
};

// 根据标签筛选收藏
export const getFavoritesByTag = (tag: string): FavoriteItem[] => {
  const favorites = getFavorites();
  return favorites.filter(f => f.tags.includes(tag));
};

// 获取所有标签
export const getAllTags = (): string[] => {
  const favorites = getFavorites();
  const tagSet = new Set<string>();
  favorites.forEach(f => f.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
};

// 搜索收藏
export const searchFavorites = (query: string): FavoriteItem[] => {
  const favorites = getFavorites();
  const lowercaseQuery = query.toLowerCase();

  return favorites.filter(f =>
    f.stockCode.toLowerCase().includes(lowercaseQuery) ||
    f.stockName.toLowerCase().includes(lowercaseQuery) ||
    f.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// 保存到本地存储
const saveFavorites = (favorites: FavoriteItem[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    // 触发收藏更新事件
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { count: favorites.length }
    }));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 导出收藏数据
export const exportFavorites = (): string => {
  const favorites = getFavorites();
  return JSON.stringify(favorites, null, 2);
};

// 导入收藏数据
export const importFavorites = (data: string): boolean => {
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return false;

    // 验证数据格式
    const validData = parsed.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));

    saveFavorites(validData);
    return true;
  } catch (error) {
    console.error('Error importing favorites:', error);
    return false;
  }
};