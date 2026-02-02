/*
输入: "abbaba"
输出: 2 (子串 "ab" 或 "ba" 出现了2次)
*/

/**
 * @description 最长重复子串,二分答案长度 + 哈希表检查
 * @param {string} s
 * @return {number}
 */

var longestRepeatingSubstring = function(str) {
    // # 二分搜索最长长度
    var left = 1, right = str.length;
    var result = 0; 
    while (left <= right) {
        var mid = (left + right) / 2;
        // 检查是否存在长度为 mid 的重复子串
        if (hasRepeatedSubstring(str, mid)) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;    
        }
    }
    return result;
}
var hasRepeatedSubstring = function(str, length) {
    var seen = new Set();
    for (var i = 0; i < str.length - length + 1; i++) {
        var substring = str.substring(i, i + length);
        if (seen.has(substring)) {
            return true;
        }
        seen.add(substring);
    }
    return false;
}

