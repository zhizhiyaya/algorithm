/**
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