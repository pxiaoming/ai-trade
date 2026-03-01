import { NextRequest, NextResponse } from 'next/server';
import { getFavoriteByStockCode, deleteFavorite, updateFavorite } from '@/lib/utils/favorites';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // 由于我们使用的是本地存储，需要遍历查找
    const { getFavorites } = await import('@/lib/utils/favorites');
    const favorites = getFavorites();
    const favorite = favorites.find(f => f.id === params.id);

    if (!favorite) {
      return NextResponse.json(
        { error: '收藏不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error fetching favorite:', error);
    return NextResponse.json(
      { error: '获取收藏详情失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const success = deleteFavorite(params.id);

    if (!success) {
      return NextResponse.json(
        { error: '收藏不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json(
      { error: '删除收藏失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const body = await request.json();
    const { tags, notes } = body;

    if (tags === undefined && notes === undefined) {
      return NextResponse.json(
        { error: '没有更新内容' },
        { status: 400 }
      );
    }

    const updated = updateFavorite(params.id, { tags, notes });

    if (!updated) {
      return NextResponse.json(
        { error: '收藏不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { error: '更新收藏失败' },
      { status: 500 }
    );
  }
}