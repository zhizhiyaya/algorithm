/**
 * @desc 是否存在一个数 X, 满足数组中 X 个项都大于等于X 
 *       排序后的数组，找到 num[i] >= x 的左边界，最终看有多少个 >=x
 *       1 <= nums.length <= 100
 *       0 <= nums[i] <= 1000
 * @param {number[]} nums
 * @return {number}
 */
 var specialArray = function(nums) {
    nums = nums.sort((a, b) => a - b);
    var length = nums.length;
    
    for (var x = 0; x <= length; x++) {
        var l = 0;
        var r = length - 1;
        var pos = -1;
        while (l <= r) {
            var mid = l + parseInt((r - l) / 2);
            if (x <= nums[mid]) {
                pos = mid
                r = mid - 1
            } else {
                l = mid + 1
            }
        }
        if (length - pos === x) {
            return x;
        }
    }
    return -1
};

// Example 1:
// Input: nums = [3,5]
// Output: 2
// Explanation: There are 2 values (3 and 5) that are greater than or equal to 2.

// Example 2:
// 输入：nums = [0,0]
// 输出：-1
// 解释：没有满足题目要求的特殊数组，故而也不存在特征值 x 。
// 如果 x = 0，应该有 0 个元素 >= x，但实际有 2 个。
// 如果 x = 1，应该有 1 个元素 >= x，但实际有 0 个。
// 如果 x = 2，应该有 2 个元素 >= x，但实际有 0 个。
// x 不能取更大的值，因为 nums 中只有两个元素。
