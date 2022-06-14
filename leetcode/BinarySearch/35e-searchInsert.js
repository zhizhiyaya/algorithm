/**
 * @desc 递增有序数组，插入 target 保持有序
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
 var searchInsert = function(nums, target) {
    var l = 0;
    var r = nums.length - 1;
    var m = 0;
    while (l <= r) { // 最终总是 l = r + 1;
        m = l + parseInt((r - l) / 2);
        if (nums[m] === target) {
            return m;
        } else if (nums[m] < target) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    // 到这 l = r + 1
    // 右边界，l = num.length， return l;
    // 左边界，r = -1,l = 0， return l;
    // 否则 曾经必定 l == r时没匹配，就比 nums[r]大 比 nums[l]小了，所以 return l; 
    return l;
};
