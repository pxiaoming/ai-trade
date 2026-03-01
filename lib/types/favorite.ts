import { AnalysisData } from '@/app/components/ai/MultiDimensionalAnalysis';

export interface FavoriteItem {
  id: string;
  stockCode: string;
  stockName: string;
  overallScore: number;
  analysisData: AnalysisData;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
  version: string;
}

export interface CreateFavoriteRequest {
  stockCode: string;
  stockName: string;
  analysisData: AnalysisData;
  tags?: string[];
  notes?: string;
}

export interface UpdateFavoriteRequest {
  tags?: string[];
  notes?: string;
}

export interface FavoriteListResponse {
  favorites: FavoriteItem[];
  total: number;
  page: number;
  pageSize: number;
}