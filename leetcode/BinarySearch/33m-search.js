/**
 * @desc 升序数组被反转，还是两段有序
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search  =  function(nums, target) {
    var len = nums.length;
    var l = 0, r = len - 1;
    // 找最小值
    while (l < r) {
        var mid = l + parseInt((r - l) / 2);
        // nums = [4,5,6,7,0,1,2]
        if (nums[mid] > nums[r]) {
            l = mid + 1;
        } else {
            r = mid;
        }
    }
    // 确定target在哪段
    if (l >= len || r <= 0) { // 整体有序的，全段查找
		l = 0;
		r = len - 1;
	} else if (target >= nums[l] && target <= nums[len - 1] ) { // 右半段
		r = len - 1;
	} else if (target <= nums[l - 1] && target >= nums[0]) { // 左半段
		r = l;
		l = 0;
	} else { // 不存在
		return -1;
	}
    // 找target
    while (l <= r) {
        var mid = l + parseInt((r - l) / 2);
        // nums = [4,5,6,7,0,1,2]
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    return -1;
}

 var search  =  function(nums, target) {
    var l = 0, r = n - 1;
    // find the index of the smallest value using binary search.
    // Loop will terminate since mid < r, and l or r will shrink by at least 1.
    // Proof by contradiction that mid < r: if mid == r, then l == r and loop would have been terminated.
    while(l < r) {
        var mid = l + parseInt((r - l) / 2);
        if(nums[mid] > nums[r]) l = mid + 1;
        else r = mid;
    }
    // l == r is the index of the smallest value and also the number of places rotated.
    var rot = l;
    l = 0; r = n - 1;
    // The usual binary search and accounting for rotation.
    while(l <= r) {
        var mid = l + parseInt((r - l) / 2);
        var realmid = (mid + rot) % n;
        if(nums[realmid] == target) return realmid;
        if(nums[realmid] < target) l = mid + 1;
        else r = mid-1;
    }
    return -1;
};