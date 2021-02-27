// 可关联 122e-maxProfit.js 买卖多次
/**
 * @desc 先买后卖，买卖各一次，且不在同一天，求最大利润
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let min = Number.MAX_VALUE;
    let max = 0;
    const length = prices.length;
    for (let i = 0; i < length; i++) {
        min = Math.min(min, prices[i]); // 0～i取最小值
        max = Math.max(max, prices[i] - min); // 当前值减去0～i的最小值取收益
    }
    return max;
};
