/**
 * @desc 多次买卖，只要后者大于前者，就可以进行一次买卖。同一天可以同时买卖(当前数最多买1次卖1次)
 * @param {number[]} prices
 * @return {number}
 */
 var maxProfit = function(prices) {
    var prev = Number.MAX_VALUE;
    var profit = 0;
    prices.reduce((prev, i) => {
        if (prev < i) {
            profit += i - prev;
        }
        return i;
    }, prev);
    return profit;
};
var maxProfit = function(prices) {
    let max = 0;
    const length = prices.length;
    for(let i = 0; i < length; i++) {
        if (prices[i+1] - prices[i] > 0) {
            max += prices[i+1] - prices[i];
        }
    }
    return max;
};
// Input: prices = [7,1,5,3,6,4]
// Output: 7
// Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
// Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
// [7,1,5,3,4,6]
// Output: 7 
