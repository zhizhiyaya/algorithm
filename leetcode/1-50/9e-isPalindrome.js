/**
 * @param {number} x
 * @return {boolean}
 */

// Discuss gaurav5 同学的解法
var isPalindrome = function(x) {
    if(x < 0 || ( x != 0 && x % 10 == 0)) return false;
    var sum = 0;
    var n = x;
    while(n > 0) {
        sum = sum * 10 + n % 10;
        n = parseInt(n / 10);
    }
    console.log(sum);
    return x == sum;
}


// 当字符串处理 😂 ，偷懒，然鹅
// Your runtime beats 95.16% of javascript submissions.
// 🤣🤣🤣
var isPalindrome = function(x) {
    // 负数
    // -0 情况 在leetcode 的case里被认为是回文
    // if (x < 0 || 1 / x < 0 ) {
    if (x < 0) {
        return false;
    }
    var s = x + '',
        len = s.length,
        mid = parseInt(len / 2);
        l = mid,
        r = mid;
    if (len % 2 === 0) { // 偶数长
        l = mid - 1;
        r = mid;
    }
    while (l > -1 && r < len) {
        if (s[l] !== s[r]) {
            return false;
        }
        l--;
        r++;
    }
    return true;
};
