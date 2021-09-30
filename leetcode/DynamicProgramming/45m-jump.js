/**
 * 55 的升级版, min steps reach the last index.
 * @param {number[]} nums
 * @return {boolean}
 */
var jump = function(nums) {
    var res = 0,
        n = nums.length,
        last = 0,
        cur = 0;
    for (var i = 0; i < n - 1; ++i) {
        cur = Math.max(cur, i + nums[i]);
        if (i == last) {
            last = cur;
            ++res;
            if (cur >= n - 1) break;
        }
    }
    return res;
};

var jump = function(nums) {
	var ret = 0;
    var curMax = 0;
    var curRch = 0;
    for(var i = 0; i < nums.length; i++) {
        if(curRch < i) {
            ret++;
            curRch = curMax;
        }
        curMax = Math.max(curMax, nums[i] + i);
    }
    return ret;
};

var jump = function(nums) {
    var res = 0,
        n = nums.length,
        i = 0,
        cur = 0;
    while (cur < n - 1) {
        ++res;
        var pre = cur;
        for (; i <= pre; ++i) {
            cur = Math.max(cur, i + nums[i]);
        }
        if (pre == cur) return -1; // May not need this
    }
    return res;
};
