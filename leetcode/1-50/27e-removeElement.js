/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */

 var removeElement = function(nums, val) {
 	// var reg = //;
 };
 var removeElement = function(nums, val) {
 	var str = nums.join(',') + ',';
	str = str.replace(eval('/' + val + ',{0,1}/g'), '');
	// str = str.replace(/,,/g, '');
	if (str[str.length - 1] === ',') {
		str = str.slice(0, str.length - 1);
	}
	nums = str.split(',');
	nums = nums.map(i => +i);
	return nums;
 };

// var removeElement = function(nums, val) {
// 	for (var i = nums.length; i >= 0; i--) {
// 		if (nums[i] == val) {
// 			nums.splice( i, 1 );
// 		}
// 	}
// 	return nums;
// };
console.log(removeElement([3,2,2,3], 3));
