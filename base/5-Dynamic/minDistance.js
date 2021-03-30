// Example 1:
// Input: word1 = "horse", word2 = "ros"
// Output: 3
// Explanation: 
// horse -> rorse (replace 'h' with 'r')
// rorse -> rose (remove 'r')
// rose -> ros (remove 'e')

// Example 2:
// Input: word1 = "intention", word2 = "execution"
// Output: 5
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
 var minDistance = function(word1, word2) {
    var m = word1.length, n = word2.length;
    var dp = new Array(m + 1);
    for (var i = 0; i <= m; i++) {
        dp[i] = new Array(n + 1);
        dp[i][0] = i; // 初始化为最大值，即每步都是 replace
    }
    for (var j = 0; j <= n; j++) {
        dp[0][j] = j; // 初始化为最大值，即每步都是 replace
    }
    for (var i = 1; i <= m; i++) {
        for (var j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i][j - 1], dp[i - 1][j])) + 1;
            }
        }
    }
    return dp[m][n];
}
