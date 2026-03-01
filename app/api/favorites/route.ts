import { NextRequest, NextResponse } from 'next/server';
import { getFavorites, searchFavorites, getFavoritesByTag, getAllTags } from '@/lib/utils/favorites';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    let favorites;

    if (query) {
      favorites = searchFavorites(query);
    } else if (tag) {
      favorites = getFavoritesByTag(tag);
    } else {
      favorites = getFavorites();
    }

    // 分页
    const total = favorites.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFavorites = favorites.slice(startIndex, endIndex);

    return NextResponse.json({
      favorites: paginatedFavorites,
      total,
      page,
      pageSize,
      tags: getAllTags(),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: '获取收藏列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stockCode, stockName, analysisData, tags, notes } = body;

    if (!stockCode || !stockName || !analysisData) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查股票代码格式
    if (!/^\d{6}$/.test(stockCode)) {
      return NextResponse.json(
        { error: '股票代码格式错误' },
        { status: 400 }
      );
    }

    const { addFavorite } = await import('@/lib/utils/favorites');
    const favorite = addFavorite({
      stockCode,
      stockName,
      analysisData,
      tags: tags || [],
      notes: notes || '',
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error creating favorite:', error);
    return NextResponse.json(
      { error: '添加收藏失败' },
      { status: 500 }
    );
  }
}