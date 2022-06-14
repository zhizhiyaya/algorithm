/**
 * @desc 每次操作中，选择任意一个 nums[i] ，删除它并获得 nums[i] 的点数。之后，你必须删除 所有 等于 nums[i] - 1 和 nums[i] + 1 的元素。
 *       开始你拥有 0 个点数。返回你能通过这些操作获得的最大点数。
 * @desc 将数组变换，转换为每个值出现的个数，那相邻的数字不能偷，就成了打家劫舍问题
 *      [2,2,3,3,3,4]
 * 变换：[0,0,2,3,1] 0 1 都没有所以是0个，2是2个，3是3个，4是1个
 * @param {number[]} nums
 * @return {number}
 */
var deleteAndEarn = function(nums) {
    var freq = new Array(10001).fill(0);
    nums.forEach(num => freq[num]++);
    var maxVal = 0, prevMax = 0;
    for(var i = 0; i <= 10000; i++) {
        var temp = Math.max(maxVal, prevMax + i * freq[i]);
        prevMax = maxVal;
        maxVal = temp;
    }
    return maxVal;
};

// 输入：nums = [3,4,2]
// 输出：6
// 解释：
// 删除 4 获得 4 个点数(4-1=3、4+1 = 5 ； 3、5 都需要删除)，因此 3 也被删除。
// 之后，删除 2 获得 2 个点数。总共获得 6 个点数。

// 输入：nums = [2,2,3,3,3,4]
// 输出：9
// 解释：
// 删除 3 获得 3 个点数，接着要删除两个 2 和 4 。
// 之后，再次删除 3 获得 3 个点数，再次删除 3 获得 3 个点数。
// 总共获得 9 个点数。