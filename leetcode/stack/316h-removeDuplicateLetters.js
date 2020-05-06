// 《一》、递归
/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicateLetters = function(s) {
    var cnt = new Array(26);
    var pos = 0; // the position for the smallest s[i]
    var len = s.length;
    for (var i = 0; i < len; i++) {
        cnt[s[i].charCodeAt() - 97]++;
    }
    for (var i = 0; i < len; i++) {
        if (s[i].charCodeAt() < s[pos].charCodeAt()) pos = i;
        if (--cnt[s[i].charCodeAt() - 97] === 0) break;
    }
    var charIndex = s[pos].charCodeAt();
    return len == 0 ? "" : charIndex + removeDuplicateLetters(s.substring(pos + 1).replace("" + charIndex, ""));
};

// Input:  "bcabc""bcabc"
// Output:  "abc""abc"
//
// Input: "cbacdcbc"
// Output: "acdb"


// 《二》、
/**
 * 1. 扫描字符串，结果串置空；
 * 2. 如果当前字符用过了，扫描下一个；
 * 3. 如果当前字符串没用过，则判定结果串的字符串是否存在需要优化的字符。
 *      优化的条件：里面有大于当前字符的，并且后面存在重复的，也就是用后面的即可。
 * 4. 重复2,3步骤直到无字符串可以扫描。
 * 5. 按先进先出的原则输出结果串。
 */
