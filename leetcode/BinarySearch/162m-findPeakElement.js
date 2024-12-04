/**
 * @desc 求数组的局部峰值
 * @param {number[]} nums
 * @return {number}
 */
// 只需找到任意一个峰值，则在确定二分查找折半后中间那个元素后，和紧跟的那个元素比较下大小，
// 如果大于，则说明峰值在前面，如果小于则在后面
var findPeakElement  =  function(nums) {
    var l = 0;
    var r = nums.length - 1;
    while (l < r) {
        var m = l + parseInt((r - l) / 2);
        if (nums[m] < nums[m + 1]) {
            l = m + 1;
        } else {
            r = m;
        }
    }
    return r;
};

// 线性扫描:
// 由于题目中说明了局部峰值一定存在，那么实际上可以从第二个数字开始往后遍历，
// 如果第二个数字比第一个数字小，说明此时第一个数字就是一个局部峰值；
// 否则就往后继续遍历，现在是个递增趋势，如果此时某个数字小于前面那个数字，
// 说明前面数字就是一个局部峰值，返回位置即可。
// 如果循环结束了，说明原数组是个递增数组，返回最后一个位置即可，参见代码如下：
var findPeakElement  =  function(nums) {
    var n = nums.length
    for (var i = 1; i < n; i++) {
        if (nums[i - 1] > nums[i]) { // 否则就是递增喽
            return i - 1;
        }
    }
    return n - 1;
}

// Example 1:
// Input: nums  =  [1,2,3,1]
// Output: 2
// Explanation: 3 is a peak element and your function should return the index number 2.

// Example 2:
// Input: nums  =  [1,2,1,3,5,6,4]
// Output: 5
// Explanation: Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.