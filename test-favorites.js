// 测试收藏功能
const {
  getFavorites,
  addFavorite,
  deleteFavorite,
  updateFavorite,
  getFavoriteByStockCode,
  searchFavorites,
  getFavoritesByTag,
  getAllTags,
  exportFavorites,
  importFavorites,
} = require('./lib/utils/favorites');

console.log('=== 开始测试收藏功能 ===\n');

// 1. 测试初始状态
console.log('1. 测试获取初始收藏列表...');
const initialFavorites = getFavorites();
console.log(`初始收藏数量: ${initialFavorites.length}\n`);

// 2. 创建测试数据
const mockAnalysisData = {
  stockCode: '000001',
  stockName: '平安银行',
  overallScore: 75,
  analysis: {
    technical: { score: 80, summary: '技术面强势' },
    fundamental: { score: 70, summary: '基本面稳健' },
    capital: { score: 75, summary: '资金面良好' },
    sentiment: { score: 70, summary: '情绪面积极' },
  },
  recommendation: {
    action: '买入',
    targetPrice: '20.00',
    stopLoss: '15.00',
    riskLevel: '中',
    reason: '业绩稳定增长，估值合理',
  },
};

console.log('2. 测试添加收藏...');
const newFavorite = addFavorite({
  stockCode: '000001',
  stockName: '平安银行',
  analysisData: mockAnalysisData,
  tags: ['银行', '价值投资'],
  notes: '长期持有',
});

console.log(`添加成功: ${newFavorite.stockName} (${newFavorite.stockCode})`);
console.log(`综合评分: ${newFavorite.overallScore}`);
console.log(`标签: ${newFavorite.tags.join(', ')}`);
console.log(`备注: ${newFavorite.notes}\n`);

// 3. 测试重复添加（应该更新）
console.log('3. 测试重复添加同一只股票...');
const updatedFavorite = addFavorite({
  stockCode: '000001',
  stockName: '平安银行',
  analysisData: mockAnalysisData,
  tags: ['银行', '价值投资', '重点关注'],
  notes: '考虑加仓',
});

console.log(`更新后标签: ${updatedFavorite.tags.join(', ')}`);
console.log(`更新后备注: ${updatedFavorite.notes}\n`);

// 4. 测试获取收藏
console.log('4. 测试按股票代码获取收藏...');
const favorite = getFavoriteByStockCode('000001');
if (favorite) {
  console.log(`找到收藏: ${favorite.stockName}`);
  console.log(`收藏时间: ${favorite.createdAt.toISOString()}\n`);
} else {
  console.log('未找到收藏\n');
}

// 5. 测试搜索功能
console.log('5. 测试搜索功能...');
const searchResults = searchFavorites('银行');
console.log(`搜索'银行'的结果数量: ${searchResults.length}\n`);

// 6. 测试标签筛选
console.log('6. 测试标签筛选...');
const tagResults = getFavoritesByTag('价值投资');
console.log(`标签'价值投资'的结果数量: ${tagResults.length}\n`);

// 7. 测试更新收藏
console.log('7. 测试更新收藏...');
const updated = updateFavorite(updatedFavorite.id, {
  tags: ['银行'],
  notes: '观察期',
});

if (updated) {
  console.log(`更新成功，新备注: ${updated.notes}\n`);
}

// 8. 测试获取所有标签
console.log('8. 测试获取所有标签...');
const allTags = getAllTags();
console.log(`所有标签: ${allTags.join(', ')}\n`);

// 9. 测试删除收藏
console.log('9. 测试删除收藏...');
const deleteSuccess = deleteFavorite(updated.id);
console.log(`删除成功: ${deleteSuccess}\n`);

// 10. 测试导出功能
console.log('10. 测试导出收藏数据...');
const exportedData = exportFavorites();
console.log(`导出的数据长度: ${exportedData.length} 字符\n`);

// 11. 测试导入功能
console.log('11. 测试导入收藏数据...');
const importSuccess = importFavorites(exportedData);
console.log(`导入成功: ${importSuccess}\n`);

// 12. 测试最终状态
console.log('12. 最终收藏列表:');
const finalFavorites = getFavorites();
console.log(`最终收藏数量: ${finalFavorites.length}`);
finalFavorites.forEach(fav => {
  console.log(`- ${fav.stockName} (${fav.stockCode}) - ${fav.overallScore}分`);
});

console.log('\n=== 测试完成 ===');