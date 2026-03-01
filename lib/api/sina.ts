import { Stock, StockRanking } from '../../types/stock';
import * as iconv from 'iconv-lite';
import { getBackupStockData, getBackupStockDataBatch } from './backup';

// 默认导出所有函数
export default {
  getSinaStockData,
  getSinaStockRanking,
  getSinaSingleStock,
  getSinaHotStockCodes
};

/**
 * 新浪财经API接口
 * 文档：http://blog.sina.com.cn/s/blog_7094fd3c0102w5p8.html
 */

const SINA_API_URL = 'https://hq.sinajs.cn'; // 注意：此API可能有访问限制，考虑使用备用API

// A股热门股票代码列表
const HOT_STOCKS = [
  'sh600000', // 浦发银行
  'sh600036', // 招商银行
  'sh600519', // 贵州茅台
  'sh600887', // 伊利股份
  'sz000001', // 平安银行
  'sz000002', // 万科A
  'sz000333', // 美的集团
  'sz000651', // 格力电器
  'sz000725', // 京东方A
  'sz000858', // 五粮液
  'sh600276', // 恒瑞医药
  'sh600309', // 万华化学
  'sz002594', // 比亚迪
  'sz002415', // 海康威视
  'sh601318', // 中国平安
  'sh600031', // 三一重工
  'sz002230', // 科大讯飞
  'sh600900', // 长江电力
  'sz300750', // 宁德时代
];

/**
 * 解码 GBK 格式的文本
 */
function decodeGBK(buffer: ArrayBuffer): string {
  return iconv.decode(Buffer.from(buffer), 'GBK');
}

/**
 * 解析新浪财经单只股票数据
 * 数据格式：股票名称,今开,昨收,现价,最高,最低,买一,卖一,成交量,成交额,买一量,卖一量,日期,时间
 */
function parseSinaStockData(code: string, dataStr: string): Stock | null {
  if (!dataStr || dataStr === '') {
    return null;
  }

  try {
    const parts = dataStr.split(',');
    if (parts.length < 32) {
      // 尝试处理可能的不同格式
      const alternativeParts = dataStr.split(';');
      if (alternativeParts.length >= 10) {
        const name = alternativeParts[0];
        const current = parseFloat(alternativeParts[1]);
        const previousClose = parseFloat(alternativeParts[2]);
        const open = parseFloat(alternativeParts[3]);
        const high = parseFloat(alternativeParts[4]);
        const low = parseFloat(alternativeParts[5]);
        const volume = parseFloat(alternativeParts[8]) || 0;
        const turnover = parseFloat(alternativeParts[9]) || 0;

        if (isNaN(current) || isNaN(previousClose) || current === 0) {
          return null;
        }

        const changeAmount = current - previousClose;
        const changePercent = previousClose > 0 ? (changeAmount / previousClose) * 100 : 0;

        return {
          code: code.toUpperCase(),
          name: name.trim(),
          currentPrice: current,
          changePercent: parseFloat(changePercent.toFixed(2)),
          changeAmount: parseFloat(changeAmount.toFixed(2)),
          volume,
          turnover,
          high,
          low,
          open,
          previousClose,
        };
      }
      return null;
    }

    const name = parts[0];
    const open = parseFloat(parts[1]);
    const previousClose = parseFloat(parts[2]);
    const current = parseFloat(parts[3]);
    const high = parseFloat(parts[4]);
    const low = parseFloat(parts[5]);
    const volume = parseFloat(parts[8]) || 0;
    const turnover = parseFloat(parts[9]) || 0;

    // 检查数据是否有效
    if (isNaN(current) || isNaN(previousClose) || current === 0) {
      return null;
    }

    const changeAmount = current - previousClose;
    const changePercent = previousClose > 0 ? (changeAmount / previousClose) * 100 : 0;

    return {
      code: code.toUpperCase(),
      name: name.trim(),
      currentPrice: current,
      changePercent: parseFloat(changePercent.toFixed(2)),
      changeAmount: parseFloat(changeAmount.toFixed(2)),
      volume,
      turnover,
      high,
      low,
      open,
      previousClose,
    };
  } catch (error) {
    console.error('解析新浪财经数据失败:', error);
    return null;
  }
}

/**
 * 获取多只股票的实时行情
 */
export async function getSinaStockData(codes: string[]): Promise<Stock[]> {
  const stockList: Stock[] = [];
  const maxRetries = 3;
  const retryDelay = 1000; // 1秒

  // 新浪API每次最多请求约200只股票
  const batchSize = 50;
  for (let i = 0; i < codes.length; i += batchSize) {
    const batch = codes.slice(i, i + batchSize);
    const codesStr = batch.join(',');

    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`${SINA_API_URL}/list=${codesStr}`, {
          headers: {
            'Referer': 'http://finance.sina.com.cn',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: AbortSignal.timeout(5000), // 5秒超时
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 获取 GBK 编码的响应
        const buffer = await response.arrayBuffer();
        const text = decodeGBK(buffer);

        // 解析返回数据
        batch.forEach((code) => {
          const match = text.match(new RegExp(`var hq_str_${code}="([^"]*)"`));
          if (match) {
            const stock = parseSinaStockData(code, match[1]);
            if (stock) {
              stockList.push(stock);
            }
          }
        });

        // 成功获取数据，退出重试循环
        break;
      } catch (error) {
        lastError = error as Error;
        retryCount++;

        if (retryCount < maxRetries) {
          console.warn(`获取新浪财经数据失败 [${codesStr}]，尝试重试 (${retryCount}/${maxRetries}):`, error);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (lastError && retryCount >= maxRetries) {
      console.error(`获取新浪财经数据最终失败 [${codesStr}]，尝试使用备用API:`, lastError);
      // 使用备用API作为 fallback
      const backupStocks = await getBackupStockDataBatch(batch);
      stockList.push(...backupStocks);
    }
  }

  return stockList;
}

/**
 * 获取股票排行榜（涨跌幅榜）
 */
export async function getSinaStockRanking(): Promise<StockRanking> {
  try {
    // 获取热门股票数据
    const stocks = await getSinaStockData(HOT_STOCKS);

    // 按涨跌幅排序
    const sortedStocks = [...stocks].sort((a, b) => b.changePercent - a.changePercent);

    // 取涨幅TOP 5和跌幅TOP 5
    const topGainers = sortedStocks.filter(s => s.changePercent > 0).slice(0, 5);
    const topLosers = [...sortedStocks].reverse().filter(s => s.changePercent < 0).slice(0, 5);

    return {
      topGainers,
      topLosers,
      lastUpdate: new Date().toISOString(),
    };
  } catch (error) {
    console.error('获取新浪财经排行榜失败，尝试使用备用API:', error);

    // 使用备用API作为 fallback
    try {
      const backupStocks = await getBackupStockDataBatch(HOT_STOCKS);
      const sortedStocks = [...backupStocks].sort((a, b) => b.changePercent - a.changePercent);
      const topGainers = sortedStocks.filter(s => s.changePercent > 0).slice(0, 5);
      const topLosers = [...sortedStocks].reverse().filter(s => s.changePercent < 0).slice(0, 5);

      return {
        topGainers,
        topLosers,
        lastUpdate: new Date().toISOString(),
      };
    } catch (backupError) {
      console.error('备用API也失败:', backupError);
      throw error;
    }
  }
}

/**
 * 获取单只股票的实时行情
 */
export async function getSinaSingleStock(code: string): Promise<Stock | null> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1秒

  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`${SINA_API_URL}/list=${code}`, {
        headers: {
          'Referer': 'http://finance.sina.com.cn',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(5000), // 5秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const text = decodeGBK(buffer);
      const match = text.match(new RegExp(`var hq_str_${code}="([^"]*)"`));

      if (match) {
        return parseSinaStockData(code, match[1]);
      }

      return null;
    } catch (error) {
      lastError = error as Error;
      retryCount++;

      if (retryCount < maxRetries) {
        console.warn(`获取新浪财经股票 [${code}] 失败，尝试重试 (${retryCount}/${maxRetries}):`, error);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  if (lastError) {
    console.error(`获取新浪财经股票 [${code}] 最终失败，尝试使用备用API:`, lastError);
    // 使用备用API作为 fallback
    return await getBackupStockData(code);
  }

  return null;
}

// 确保所有函数都被正确导出
export { getSinaStockRanking };

/**
 * 获取A股所有股票列表（简化版，只返回部分热门股）
 */
export function getSinaHotStockCodes(): string[] {
  return [...HOT_STOCKS];
}
