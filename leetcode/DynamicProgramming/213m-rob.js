/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    var length = nums.length;
    if (length === 0) {
        return 0;
    }
    if (nums.length <= 1) {
        return nums[0];
    }
    // 避免首尾加和
    return Math.max(_rob(nums.slice(0, length - 1)), _rob(nums.slice(1, length)));
};
// 完全 198 的解法
var _rob = function(nums) {
    var dp = [0, 0];
    var length = nums.length;
    for (var i = 0; i < length; i++) {
        var t = dp[0];
        dp[0] = nums[i] + dp[1];
        dp[1] = Math.max(t, dp[1]);
    }
    return Math.max(dp[0], dp[1]);
};

[2, 1, 1, 2]
[
    [0, 0],
    [2, 0], // 偷 num[0],
    [1, 2], // 偷 num[1],不偷价值为 2
    [3, 2], // 偷 num[2],不偷价值为 num[2]之前的最大值 2
    [4, 3]  // 偷 num[3],不偷价值为 2
]