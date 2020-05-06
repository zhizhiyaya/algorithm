/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    var len = nums.length;
    var last = len - 1;
    for (var i = len - 2; i > -1; i--) {
        if (i + nums[i] >= last) {
            last = i;
        }
    }
    return last <= 0;
};
