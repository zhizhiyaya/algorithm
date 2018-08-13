/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
	var len = nums.length;
	if (len < 3) {
		return ;
	}
	nums.sort((a, b) => a - b );
	var res = nums[0] + nums[1] + nums[2];
	var renge = len - 2;
	for (var i = 0, j = 0, k = 0; i < len; i++) {
		j = i + 1;
		k = len - 1;
		while (j < k) {
			sum = nums[i] + nums[j] + nums[k];
			if (sum === target) {
				return sum;
			}
			if (Math.abs(sum - target) < Math.abs(res - target)) {
				res = sum;
			}
			if (sum < target) {
				j++;
			} else if (sum > target) {
				k--;
			}
		}
	}
	return res;
};
