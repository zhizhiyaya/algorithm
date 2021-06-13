/**
 * @desc m n 的矩阵，从 （0，0） 到 （m -1, n -1）的方式
 *      动态规划法，从左上角到每一格的路径数与它的上面一格和左边一格的路径和;
 *      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
 *      0  1  1 
 *      1  2  3
 *      1  3  6
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
    if (m < 1 || n < 1) {
        return 0;
    }
    var dp = new Array(m);
    for (var i = m; i--;) {
        dp[i] = new Array(n);
        for (var j = n; j--;) {
            // 初始化，边缘的只有一种走法, 比如第一层，到（0，1）位置只能向右，到（0，2）依旧只能向右，（1，0） （2，0）是向下走 也是只一种选择
            dp[i][j] = i === 0 || j === 0 ? 1 : 0;
        }
    }
    for (var i = 1; i < m; i++) {
        for (var j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1] [n -1];
};
