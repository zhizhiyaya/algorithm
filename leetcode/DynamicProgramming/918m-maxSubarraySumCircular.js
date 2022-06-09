/**
 * @desc 求最大和 最小和， 用总和减最小和
 * @param {number[]} nums
 * @return {number}
 */
var maxSubarraySumCircular = function(nums) {
    var sum = 0,
        min = Number.MAX_SAFE_INTEGER,
        max = -Number.MAX_SAFE_INTEGER,
        curMax = 0,
        curMin = 0;

    for (var i = 0; i < nums.length; i++) {
        var num = nums[i];
        curMin = Math.min(curMin + num, num);
        min = Math.min(min, curMin);
        curMax = Math.max(curMax + num, num);
        max = Math.max(max, curMax);
        sum += num;
    }
    return (sum - min == 0) ? max : Math.max(max, sum - min);
};
