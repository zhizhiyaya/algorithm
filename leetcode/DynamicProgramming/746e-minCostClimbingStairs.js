/**
 * @desc 花费最少价值 到达封顶（从数组透到数组尾+1 ，跟爬楼梯一样 步长 1||2 ）
 * @param {number} n
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {
    var a = 0, b = 0;
    for (var i = 0; i < cost.length; i++) {
        var t = Math.min(a, b) + cost[i];
        a = b;
        b = t;
    }
    return Math.min(a, b);
};

