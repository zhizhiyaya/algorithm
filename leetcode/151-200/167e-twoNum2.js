/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
 var twoSum = function(numbers, target) {
    if (numbers.length < 2) {
        return [];
    }
    var length = numbers.length;
    var dic = {};
    for(var i = 0; i < length - 1; i++) {
        // 字典不可少。否则 TLE
        if (!dic[numbers[i]] && target - numbers[i] !== numbers[i]) {
            dic[numbers[i]] = i;
        }
        if (numbers[i] <= target) {
            var findIndex = findNum(target - numbers[i], numbers.slice(i + 1));
            if (findIndex !== -1) {
                return [i + 1, i + findIndex + 1 + 1];
            }
        }
    }
    return []
};
    
function findNum(num, arr) {
    var leng = arr.length;
    var l = 0;
    var r = leng - 1;
    var i = -1;
    while(l >= 0 && r <= leng - 1 && l <= r) {
        i = Math.floor(l + (r - l ) / 2);
        if (arr[i] === num) {
            return i;
        } else if (arr[i] < num) {
            l = i + 1;
        } else {
            r = i - 1;
        }
    }
    return l === r && arr[l] === num ? l : -1;
}