/**
 * @desc 两数之和等于target，分解为查找1个数
 * 1 <= index1 < index2 <= numbers.length.
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    for(var i = 0; i < numbers.length; i++) {
        var index = bsOneNum(numbers, target - numbers[i], i + 1);
        if (index !== -1) {
            return [i + 1, index + 1];
        }
    }
    return [-1, -1];
};
function bsOneNum(numbers, target, l = 0) {
    var r = numbers.length - 1;
    
    while(l <= r) {
        var mid = l + parseInt((r - l) / 2);
        if (numbers[mid] === target) {
            return mid;
        } else if (numbers[mid] < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }
    return -1;
}
