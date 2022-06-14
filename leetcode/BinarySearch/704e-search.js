/**
 * @desc 递增有序数组，查找 target 的 position ，返回 index 
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    var l = 0;
    var r = nums.length - 1;
    var m = 0;
    while(l <= r) {
        m = l + parseInt((r - l) / 2);
        if (nums[m] === target) {
            return m;
        } else if (nums[m] < target) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }    
    return -1;
};