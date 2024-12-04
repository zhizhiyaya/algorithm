/**
 * 动态规划实现: 
 * 定义状态：dp[i] 表示第 𝑖 项的斐波那契数值。
 * 状态转移方程：dp[i] = dp[i-1] + dp[i-2]
 * 初始化：dp[0] = 0, dp[1] = 1
 * 计算顺序：从小到大依次计算。
 * T：𝑂(𝑛) ； S：𝑂(1)
 */ 
const fibnacci = function(n) {
    let res = [0, 1];
    if (n <= 2) return n;
    for (let i = 2; i <= n; i++) {
        let s = res[0] + res[1];
        res[0] = res[1];
        res[1] = s;
    }
    return res[1];
}