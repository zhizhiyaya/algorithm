/**
 * 动态规划实现
    定义状态：dp[i][w] 表示前 𝑖 件物品在容量为 𝑤 的背包中的最大价值。
    状态转移方程：
        如果不选第 i 件物品：dp[i][w] = dp[i-1][w]；
        如果选第 i 件物品：dp[i][w] = dp[i-1][w-weights[i]] + values[i]
        那么：dp[i][w]=max(dp[i−1][w],dp[i−1][w−weights[i]]+values[i])
    初始化：
        dp[0][w] = 0，容量为 w 时，无物品可选时的价值为 0
    计算顺序：
    遍历物品，从 i=1 到 n；遍历容量，从 w=0 到 𝑊。
 */

/**
 * @desc 每种物品均有两种拿法， 即 拿或不拿，枚举的方法总数为 Math.pow(2, k);
 * @param {number[][]} matrix
 * @return {number}
 */
var N = Math.floor(Math.random() * 30);
var a = generatWeights(N);
var MAX_Weight = 40;
/**
 * 递归解法
 * 每种物品均有两种拿法， 即 拿或不拿
 * 从 K 种物品种选择一些，组成重量为 W 的做法总数
 */ 
function ways(w, k) {
    if (w === 0) return 1; // k 种物品都不拿
    if (k === 0) return 0; // 没有物品可拿
    // 第 K 个物品不拿 + 拿第 K 个物品的方法总和
    return ways(w, k - 1) + ways(w - a[k], k - 1);
}
ways(MAX_Weight, N);
/**
 * 动归解法
 * 每种物品均有两种拿法， 即 拿或不拿
 * 从 K 种物品种选择一些，组成重量为 W 的做法总数
 */ 
function ways(w, k) {
    if (w === 0) return 1; // k 种物品都不拿
    if (k === 0) return 0; // 没有物品可拿
    // 第 K 个物品不拿 + 拿第 K 个物品的方法总和
    // ways(w, k - 1) + ways(w - a[k], k - 1);
    // -------------------列-
    // --------  k-1  --- k -
    // -------- w-a[k]---   -
    // --------       ---   -
    // --w行-----     --- o -
    var ways = new Array(MAX_Weight + 1);
    for (var i = 0; i <= k; i++) {
        ways[i] = new Array(30);
        ways[0][i] = 1; // 重量为0 i种物品都不取 1种方法
    }
    ways[0][0] = 1;

    for (var w = 1; w <= MAX_Weight; w++) {
        for (var k = 1; k <= N; k++) {
            ways[w][k] = ways[w][k-1];
            if (w - a[k] > 0) {
                ways[w][k] += ways[w - a[k]][k - 1];
            }
        }
    }
    return ways;
}

ways(MAX_Weight, N);

function generatWeights(n) {
    var a = [];
    for (; n--;) {
        a.push(Math.ceil(Math.random() * MAX_Weight));
    }
    console.log(a);
    return a;
}
