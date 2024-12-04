; 数据集表示： 用二维数组表示数据集，每个子数组代表一个交易。
; 频繁项集存储： 用一个二维数组存储所有频繁项集，每一层表示不同长度的频繁项集。
; 支持度计算： countSupport 函数用于计算一个项集在数据集中的支持度。
; 候选集生成： 通过连接频繁 k-1 项集生成候选 k 项集，并进行剪枝。
; 频繁项集筛选： 统计候选集的支持度，筛选出频繁项集。
function apriori(dataset, minSupport) {
  // 找出所有项
  const items = new Set();
  dataset.forEach(transaction => {
    transaction.forEach(item => items.add(item));
  });

  // 找出频繁 1-项集
  const frequentItemSets = [];
  const countSupport = (itemSet) => {
    let count = 0;
    dataset.forEach(transaction => {
      if (itemSet.every(item => transaction.includes(item))) {
        count++;
      }
    });
    return count;
  };
  items.forEach(item => {
    const support = countSupport([item]);
    if (support >= minSupport) {
      frequentItemSets.push([item]);
    }
  });

  // 生成候选集并剪枝
  let k = 2;
  while (frequentItemSets[k - 2]) {
    const candidates = [];
    for (let i = 0; i < frequentItemSets[k - 2].length; i++) {
      for (let j = i + 1; j < frequentItemSets[k - 2].length; j++) {
        const candidate = [...frequentItemSets[k - 2][i], ...frequentItemSets[k - 2][j]];
        if (candidate.length === k && candidates.every(c => !c.every(item => candidate.includes(item)))) {
          candidates.push(candidate);
        }
      }
    }

    // 统计支持度
    const newFrequentSet = [];
    candidates.forEach(candidate => {
      const support = countSupport(candidate);
      if (support >= minSupport) {
        newFrequentSet.push(candidate);
      }
    });
    frequentItemSets.push(newFrequentSet);
    k++;
  }

  return frequentItemSets;
}

// 示例数据集
const dataset = [
  ['牛奶', '面包', '鸡蛋'],
  ['牛奶', '啤酒'],
  ['面包', '尿布', '啤酒'],
  ['牛奶', '尿布', '啤酒']
];

// 设置最小支持度
const minSupport = 2;

// 运行 Apriori 算法
const frequentItemSets = apriori(dataset, minSupport);
console.log(frequentItemSets);