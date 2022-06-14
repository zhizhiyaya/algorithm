/**
 * 
 * @param {number} x
 * @return {number}
 */
 var mySqrt = function(x) {
    var l = 1;
    var r = x;
    var m;
    var ans;
    while(l <= r) {
        m = l + parseInt((r - l) / 2);
        if(m * m == x) {
            return m;
        } else if(m * m < x) {
            l = m + 1;
            ans = m;
        } else {
            r = m - 1;
        }
    }
    return ans;
};

// Example 1:
// Input: x = 4
// Output: 2

// Example 2:
// Input: x = 8
// Output: 2