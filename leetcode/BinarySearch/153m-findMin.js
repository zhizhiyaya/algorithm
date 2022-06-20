/**
 * @desc 数组必是 两段有序，找到临界点（即左边大于右边的，）
 * @param {number[]} nums
 * @return {number}
 */
 var findMin = function(nums) {
    // if (null == nums || nums.length == 0) {
    //     return -1;
    // }
    
    var l = 0, r = nums.length - 1;
    while (l < r) {
        var mid = l + parseInt((r - l) / 2);
        if (nums[mid] > nums[r]) {
            l = mid + 1;
        } else {
            r = mid;
        } 
    }
    return nums[l];
};

// Example 1:
// Input: nums = [3,4,5,1,2]
// Output: 1
// Explanation: The original array was [1,2,3,4,5] rotated 3 times.

// Example 2:
// Input: nums = [4,5,6,7,0,1,2]
// Output: 0
// Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.

// Example 3:
// Input: nums = [11,13,15,17]
// Output: 11
// Explanation: The original array was [11,13,15,17] and it was rotated 4 times. 
