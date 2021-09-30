/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    var len = nums.length;
    var last = len - 1;
    for (var i = len - 2; i > -1; i--) {
        // index + nums[i]够大就能跳出去
        if (i + nums[i] >= last) { // nums = [2,3,1,1,4]
            last = i;
        }
    }
    return last <= 0;
};

var canJump = function(nums) {
    var length = nums.length;
    var dp = new Array(length).fill(0);
    for (var i = 1; i < length; ++i) {
        // 跳了当前位置 还剩多少步
        dp[i] = Math.max(dp[i - 1], nums[i - 1]) - 1;
        // 没剩步数 就跳不出去了
        if (dp[i] < 0) return false;
    }
    return true;
};