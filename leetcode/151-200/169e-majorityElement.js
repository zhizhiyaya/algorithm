/**
 * @param {number[]} nums, The majority element is the element that appears more than ⌊n / 2⌋ times. 
 * @return {number}
 */
var majorityElement = function(nums) {
    var times = {};
    var leng = nums.length;
    for(var i = leng; i--; ){
        if (!times[nums[i]]) {
            times[nums[i]] = 1;
        } else {
            times[nums[i]]++;
        }
        if (times[nums[i]] > leng / 2) {
            return nums[i];
        }
    }
};