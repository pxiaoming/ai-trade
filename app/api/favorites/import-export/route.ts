import { NextRequest, NextResponse } from 'next/server';
import { exportFavorites, importFavorites } from '@/lib/utils/favorites';

export async function GET() {
  try {
    const data = exportFavorites();
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="favorites.json"',
      },
    });
  } catch (error) {
    console.error('Error exporting favorites:', error);
    return NextResponse.json(
      { error: '导出失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json(
        { error: '缺少数据' },
        { status: 400 }
      );
    }

    const success = importFavorites(data);

    if (!success) {
      return NextResponse.json(
        { error: '导入数据格式错误' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: '导入成功' });
  } catch (error) {
    console.error('Error importing favorites:', error);
    return NextResponse.json(
      { error: '导入失败' },
      { status: 500 }
    );
  }
}