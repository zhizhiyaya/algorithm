/**
 * @desc 相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    var dp = [0, 0];
    var length = nums.length;
    for (var i = 0; i < length; i++) {
        var t = dp[0];
        dp[0] = nums[i] + dp[1];
        dp[1] = Math.max(t, dp[1]);
    }
    return Math.max(dp[0], dp[1]);
};
// 间隔加和，0位缓存当前位的 sum, 1位 缓存相邻位的 sum
[2, 1, 1, 2]
[
    [0, 0],
    [2, 0], // 偷 num[0],
    [1, 2], // 偷 num[1],不偷价值为 2
    [3, 2], // 偷 num[2],不偷价值为 num[2]之前的最大值 2
    [4, 3]  // 偷 num[3],不偷价值为 2
]
