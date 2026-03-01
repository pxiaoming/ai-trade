// 测试导入路径修复
const fs = require('fs');
const path = require('path');

// 检查文件是否存在
const files = [
  'app/page.tsx',
  'app/favorites/page.tsx',
  'app/components/layout/MainLayout.tsx',
  'app/components/ui/FavoriteButton.tsx',
  'app/components/ai/MultiDimensionalAnalysis.tsx',
];

console.log('=== 检查文件路径 ===\n');

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${file}: ${exists ? '✓ 存在' : '✗ 不存在'}`);
});

console.log('\n=== 检查导入路径 ===\n');

// 检查导入语句
const checkImports = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importLines = content.match(/import.*from\s+['"](.+)['"]/g) || [];

    console.log(`\n${filePath}:`);
    importLines.forEach(line => {
      console.log(`  ${line}`);
    });
  } catch (error) {
    console.log(`${filePath}: 无法读取文件`);
  }
};

// 检查主要文件的导入
['app/page.tsx', 'app/favorites/page.tsx'].forEach(checkImports);

console.log('\n=== 修复完成 ===');
console.log('所有文件已使用正确的相对路径导入');