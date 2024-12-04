/**
 * @desc 求不相邻的位置上的数字之和的最⼤值
 * @desc 相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    var dp = [0, 0]; // dp[0] 偷nums[i]时的值, dp[1]是nums[i]前面序列偷不偷的最大值
    var length = nums.length;
    for (var i = 0; i < length; i++) {
        var t = dp[0];
        dp[0] = nums[i] + dp[1]; // 当前数值+间隔为的最大值dp[1]
        dp[1] = Math.max(t, dp[1]);
    }
    return Math.max(dp[0], dp[1]);
};
// 输⼊: [1,2,3,1] 
// 输出: 4
// 解释: 偷窃 1 号房屋 (⾦额 = 1) ，然后偷窃 3 号房屋 (⾦额 = 3)。
// 偷窃到的最⾼⾦额 = 1 + 3 = 4 。
// ⽰例 2:
// 输⼊: [2,7,9,3,1]
// 输出: 12
// 解释: 偷窃 1 号房屋 (⾦额 = 2), 偷窃 3 号房屋 (⾦额 = 9)，接着偷窃 5 号房屋 (⾦额 = 1)。
// 偷窃到的最⾼⾦额 = 2 + 9 + 1 = 12 。
// 间隔加和，0位缓存当前位的 sum, 1位 缓存相邻位的 sum

// dp[0] 是偷num[i]的价值，dp[1]是不偷 num[i] num[i]之前的最大值
[2, 1, 1, 2]
[
    [0, 0],
    [2, 0], // 偷 num[0], 
    [1, 2], // 偷 num[1],不偷价值为 2（即相邻位的最大值）
    [3, 2], // 偷 num[2],不偷价值为 num[2]之前的最大值 2
    [4, 3]  // 偷 num[3],不偷价值为 2
]
