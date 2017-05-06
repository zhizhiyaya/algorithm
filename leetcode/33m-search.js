/**
 * @method 局部有序 查找
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
	var len = nums.length;
	var l = 0,
		r = len - 1;
	if (len <= 0) {
		return -1;
	}
	if (len === 1 && target === nums[len - 1]) {
		return 0;
	}
	var m = 0;

	while ( l < r) {
		m = parseInt((l + r) / 2);
		if (nums[m] > nums[r]) {
			l = m + 1;
		} else {
			r = m;
		}
	}
	if (l >= len || r <= 0) { // 整体有序的
		l = 0;
		r = len - 1;
	} else if (target >= nums[l] && target <= nums[len - 1] ) {
		r = len - 1;
	} else if (target <= nums[l - 1] && target >= nums[0]) {
		r = l;
		l = 0;
	} else {
		return -1;
	}

	while ( l <= r) {
        m = parseInt((l + r) / 2);
        if(nums[m] === target) {
			return m;
		} else if (nums[m] < target) {
			l = m + 1;
		} else {
			r = m - 1;
		}
    }
    return -1;
};

// console.log(search([4, 5, 6, 7, 0, 1, 2], 6));
// console.log(search([], 6));
console.log(search([3, 1], 3));
// console.log(search([5,1,3], 5));
// console.log(search([1], 1));
