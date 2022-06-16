/**
 * @desc 在有序递增数组中找 target 所在的左右边界的索引
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
 var searchRange = function(nums, target) {
    var res = [-1, -1];
    var numsLength = nums.length;
    if (numsLength <= 0) { 
        return res;
    }
    var ll = 0;
    var lr = numsLength - 1;
    var m = 0;
    // 先找左边界
    while(ll <= lr) {
        m = ll + parseInt((lr - ll) / 2);
        if (nums[m] < target) { // 小 ll 就 m+1
            ll = m + 1;
        } else {
            lr = m - 1;
        }
    }
    // 找左边界，就是在 ll :m+1，所以这里边界只判断 ll 即可
    if (ll >= numsLength) { // ll 大于 lr的最大值了，越界
        return res;
    }

    var rl = 0;
    var rr = numsLength - 1;
    // 再找右边界
    while(rl <= rr) {
        m = rl + parseInt((rr - rl) / 2);
        if (nums[m] > target) { // 大 rr就 m-1
            rr = m - 1;
        } else {
            rl = m + 1;
        }
    }
    // 找右边界，就是在 rr :m-1，所以这里边界只判断 rr 即可
    if (rr < 0) { // rr 大于 rl的最小值了，越界
        return res;
    }
    if (ll <= rr) {
        return [ll, rr];
    }
    return res;
};

// searchRange([5, 7, 7, 8, 8, 8, 10], 8)
// [3, 5]