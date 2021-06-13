var uniquePathsWithObstacles = function(obstacleGrid) {
    var m = obstacleGrid.length;
    var n = obstacleGrid[0] && obstacleGrid[0].length;
    if (m < 1 || n < 1 || obstacleGrid[0][0] === 1) {
        return 0;
    }
    var dp = new Array(m);
    for (var i = m; i--;) {
        dp[i]  = new Array(n);
        for (var j = n; j--;) {
            if (obstacleGrid[i][j] === 1) {
                dp[i][j] = -1;
            } else {
                dp[i][j] = 0;
            }
        }
    }
    
    dp[0][0] = 1;
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            if (dp[i][j] !== -1) {
                var preI = dp[i - 1] && dp[i - 1][j] || 0;
                var preJ = dp[i][j - 1] || 0;
                // preI 和 preJ 都为-1，那当前的（i，j）是无法通过的，还为 -1；
                // preI 或 preJ 存在为 -1 的情况 加和时，置为0
                dp[i][j] = preI === -1 && preJ === -1 ? -1 : (preI > -1 ? preI : 0) + (preJ > -1 ? preJ : 0);
            }
        }
    }
    return dp[m - 1][n - 1] === -1 ? 0 : dp[m - 1][n - 1];
};
