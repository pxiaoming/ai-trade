/**
 * 格式化工具函数
 */

/**
 * 格式化数字，添加千分位分隔符
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化价格，保留2位小数
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * 格式化涨跌幅，带颜色标识
 */
export function formatChangePercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * 格式化涨跌额
 */
export function formatChangeAmount(amount: number): string {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${amount.toFixed(2)}`;
}

/**
 * 格式化成交量
 */
export function formatVolume(volume: number): string {
  if (volume >= 100000000) {
    return `${(volume / 100000000).toFixed(2)}亿`;
  } else if (volume >= 10000) {
    return `${(volume / 10000).toFixed(2)}万`;
  }
  return formatNumber(volume);
}

/**
 * 格式化成交额
 */
export function formatTurnover(turnover: number): string {
  if (turnover >= 100000000) {
    return `${(turnover / 100000000).toFixed(2)}亿`;
  } else if (turnover >= 10000) {
    return `${(turnover / 10000).toFixed(2)}万`;
  }
  return formatNumber(turnover);
}

/**
 * 格式化时间
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
