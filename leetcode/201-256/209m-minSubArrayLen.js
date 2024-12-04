/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
    const t = target.sort((a, b) => a - b);
    let leftNum = nums;
    let left = 0;
    let a = [];
    
    for(let right = 0; right < t.length; right++) {
        
        nums.push(t[right]);
        leftNum -= t[right];

        if (leftNum === 0) {
            break;
        } else if (leftNum < 0) {

        } else {

            while (leftNum > 0) {
                nums.shift();
                leftNum -= t[left];
                left++;
            }
            if (leftNum === 0) break;
        }
    }
};