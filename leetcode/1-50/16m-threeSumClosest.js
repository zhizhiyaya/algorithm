/**
* @param {number[]} nums
* @param {number} target
* @return {number}
*/
var threeSumClosest = function(nums, target) {
	var len = nums.length;
	nums.sort(function (a, b) {
		return a - b;
	});

	int res, dis = INT_MAX;
	for(int i = 0; i < n - 2; i++) {
		int target2 = target - num[i], tmpdis;
		int tmpres = twoSumClosest(num, i+1, target2);
		if((tmpdis = abs(tmpres - target2)) < dis) {
			res = tmpres + num[i];
			dis = tmpdis;
			if(res == target)
			return res;
		}
	}
	return res;


	nums = nums.sort(function(a, b) {
		return a - b;
	});
	var res = [];
	var sum = 0;
	var _sum = 0;
	var len = nums.length;
	for (var i = 0, r = 0, l = 0; i < len; i++) {
		if (i == 0 || (i > 0 && nums[i] != nums[i-1])) {
			sum = 0 - nums[i];
			l = i + 1;
			r = len - 1;
			while (l < r) {
				_sum = nums[l] + nums[r];
				if (sum == _sum) {
					res.push([nums[i], nums[l], nums[r]]);
					while (nums[l] == nums[l + 1]) {
						l++;
					}
					while (nums[r] == nums[r - 1]) {
						r--;
					}
					l++;
					r--;
				} else if (sum < _sum) {
					r--;
				} else {
					l++;
				}
			}
		}
	}
    return res;
};

console.log(threeSum([-1,0,1,2,-1,-4]));


function twoSumClosest() {
     int head = start, tail = sortedNum.size() - 1;
     int res, dis = INT_MAX;
     while(head < tail) {
         int tmp = sortedNum[head] + sortedNum[tail];
         if(tmp < target) {
             if(target - tmp < dis)
             {
                 res = tmp;
                 dis = target - tmp;
             }
             head++;
         } else if(tmp > target) {
             if(tmp - target < dis) {
                 res = tmp;
                 dis = tmp - target;
             }
             tail--;
         } else
             return target;
     }
     return res;
 }
