// *
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 
var twoSum = function(nums, target) {
    if (!nums || nums.length < 2) {
        return null;
    }
    nums.sort(); // 先排序
    var l = 0; // left 索引
    var r = nums.length - 1; // right 索引
    var res = [];
    var _sums = 0;
    while(l < r) {
    	_sums = nums[l] + nums[r];
    	if (_sums == target) {
    		res.push(nums[l]);
    		res.push(nums[r]);
    		return res;
    	} else if (_sums < target) { // 两数之和小于 target，则 left 向右移
    		l++;
    	} else { // 两数之和大于 target，则 right 向左移
    		r--;
    	}
    }
    return null;
};