/**
 * @desc 将数组变换，转换为每个值的所有点数。就成了打家劫舍问题
 * @param {number[]} nums
 * @return {number}
 */
var deleteAndEarn = function(nums) {
    var trans = new int[10001];
    for (var i = 0; i < nums.Length; i ++) {
        trans[nums[i]] += nums[i];
    }
    var dp = new int[10001];
    dp[0] = 0;
    dp[1] = trans[1];
    for (var i = 2; i < trans.Length; i ++) {
        dp[i] = Math.Max(dp[i-1], dp[i-2] + trans[i]);
    }
    return dp[dp.Length - 1];
};
