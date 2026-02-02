/**
 * @description 最长子串, 滑动窗口+hashmap 解法
 * @param {string} s
 * @return {number}
 */

var longestSubstring = function(str) {
    var charIndex = {};
    var start = 0;
    var maxStr = '';
    for (var end = 0; end < str.length; end++) {
        var char = str[end];
        // 哈希表：字符 → 该字符最后出现的索引
        if (charIndex[char] >= start) {
            start = charIndex[char] + 1;
        }
        charIndex[char] = end;
        // 记录最长子串长度
        if (end - start + 1 > maxStr.length) {
            maxStr = str.substring(start, end + 1);
        }
    }
    return maxStr;
}
