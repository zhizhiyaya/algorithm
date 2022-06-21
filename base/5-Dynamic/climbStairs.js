/**
 * 爬楼梯，一次可以爬 1阶或2阶；
 * 如果为1，只有1种；如果为2，则有 11 或者 2 共两种
 * dp[i] = dp[i-1] + dp[i-2];
 */
// 递归 ， 跟 斐波那契数列一样吼,只是边界不一样
function climbStairs(n) {
    if (n === 1) {
        return 1;
    }
    if (n === 2) {
        return 2;
    }
    return climbStairs(n -1) + climbStairs(n -2);
}
/**
function fib(n) {
    if (n === 0 || n === 1) {
        return n
    }
    return fib(n - 1) + fib(n - 2);
}
 */
// 递推
function climbStairs(n) {
    var dp = new Array(n + 1);
    dp[0] = 1;
    dp[1] = 2;

    for(var i = 2; i < n; i++) {
        dp[i] = dp[i - 1] + dp[i + 2];
    }
    return dp[n - 1];
}
// 滚动数组优化内存，仅保存 dp[i - 1] 、 dp[i + 2]俩值
function climbStairs(n) {
    var dp = [1, 2];
    for(var i = 2; i < n; i++) {
        var temp = dp[1];
        dp[1] = dp[0] + dp[1];
        dp[0] = temp;
    }
    return dp[1];
}