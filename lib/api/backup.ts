import { Stock, StockRanking } from '../types/stock';

const BACKUP_API_URL = 'https://api.eastmoney.com';

/**
 * 东方财富API备用实现
 * 注意：此API可能有访问限制，仅供备用
 */
export async function getBackupStockData(code: string): Promise<Stock | null> {
  try {
    const response = await fetch(`${BACKUP_API_URL}/api/stock/${code}`, {
      headers: {
        'Referer': 'https://www.eastmoney.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.code && data.name) {
      return {
        code: data.code,
        name: data.name,
        currentPrice: parseFloat(data.currentPrice) || 0,
        changePercent: parseFloat(data.changePercent) || 0,
        changeAmount: parseFloat(data.changeAmount) || 0,
        volume: parseFloat(data.volume) || 0,
        turnover: parseFloat(data.turnover) || 0,
        high: parseFloat(data.high) || 0,
        low: parseFloat(data.low) || 0,
        open: parseFloat(data.open) || 0,
        previousClose: parseFloat(data.previousClose) || 0,
      };
    }

    return null;
  } catch (error) {
    console.warn(`备用API获取股票 [${code}] 失败:`, error);
    return null;
  }
}

/**
 * 获取多只股票的备用数据
 */
export async function getBackupStockDataBatch(codes: string[]): Promise<Stock[]> {
  const stockList: Stock[] = [];
  const batchSize = 10;

  for (let i = 0; i < codes.length; i += batchSize) {
    const batch = codes.slice(i, i + batchSize);

    try {
      const responses = await Promise.all(
        batch.map(code =>
          fetch(`${BACKUP_API_URL}/api/stock/${code}`, {
            headers: {
              'Referer': 'https://www.eastmoney.com',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            signal: AbortSignal.timeout(5000),
          })
        )
      );

      const results = await Promise.all(
        responses.map(response => response.json())
      );

      results.forEach((data, index) => {
        if (data && data.code && data.name) {
          stockList.push({
            code: data.code,
            name: data.name,
            currentPrice: parseFloat(data.currentPrice) || 0,
            changePercent: parseFloat(data.changePercent) || 0,
            changeAmount: parseFloat(data.changeAmount) || 0,
            volume: parseFloat(data.volume) || 0,
            turnover: parseFloat(data.turnover) || 0,
            high: parseFloat(data.high) || 0,
            low: parseFloat(data.low) || 0,
            open: parseFloat(data.open) || 0,
            previousClose: parseFloat(data.previousClose) || 0,
          });
        }
      });
    } catch (error) {
      console.warn(`备用API批量获取股票失败 [${batch.join(',')}]:`, error);
    }
  }

  return stockList;
}