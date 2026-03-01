// API 测试脚本
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('=== 开始测试收藏API ===\n');

  try {
    // 1. 测试获取收藏列表
    console.log('1. 测试获取收藏列表...');
    const response = await fetch(`${BASE_URL}/api/favorites`);
    const data = await response.json();
    console.log(`状态码: ${response.status}`);
    console.log(`收藏数量: ${data.total}\n`);

    // 2. 测试添加收藏
    console.log('2. 测试添加收藏...');
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

    const addResponse = await fetch(`${BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stockCode: '000001',
        stockName: '平安银行',
        analysisData: mockAnalysisData,
        tags: ['银行', '价值投资'],
        notes: '长期持有',
      }),
    });

    const addData = await addResponse.json();
    console.log(`状态码: ${addResponse.status}`);
    if (addResponse.ok) {
      console.log(`添加成功: ${addData.stockName}`);
      console.log(`收藏ID: ${addData.id}\n`);
    } else {
      console.log(`错误: ${addData.error}\n`);
    }

    // 3. 测试搜索
    console.log('3. 测试搜索功能...');
    const searchResponse = await fetch(`${BASE_URL}/api/favorites?q=银行`);
    const searchData = await searchResponse.json();
    console.log(`状态码: ${searchResponse.status}`);
    console.log(`搜索结果数量: ${searchData.total}\n`);

    // 4. 测试按标签筛选
    console.log('4. 测试按标签筛选...');
    const tagResponse = await fetch(`${BASE_URL}/api/favorites?tag=银行`);
    const tagData = await tagResponse.json();
    console.log(`状态码: ${tagResponse.status}`);
    console.log(`标签筛选结果数量: ${tagData.total}\n`);

    // 5. 测试删除收藏
    if (addData.id) {
      console.log('5. 测试删除收藏...');
      const deleteResponse = await fetch(`${BASE_URL}/api/favorites/${addData.id}`, {
        method: 'DELETE',
      });
      const deleteData = await deleteResponse.json();
      console.log(`状态码: ${deleteResponse.status}`);
      console.log(`删除结果: ${deleteData.message}\n`);
    }

    // 6. 测试获取单个收藏
    if (addData.id) {
      console.log('6. 测试获取单个收藏...');
      const getResponse = await fetch(`${BASE_URL}/api/favorites/${addData.id}`);
      const getData = await getResponse.json();
      console.log(`状态码: ${getResponse.status}`);
      if (getResponse.ok) {
        console.log(`获取成功: ${getData.stockName}`);
      } else {
        console.log(`错误: ${getData.error}\n`);
      }
    }

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testAPI();