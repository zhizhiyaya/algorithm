/**
 * @desc 平方 
 * @param {number} num
 * @return {boolean}
 */
 var isPerfectSquare = function(num) {
    var l = 1;
    var r = num;
    while(l <= r) {
        m = l + parseInt((r - l) / 2);
        if (m * m < num) {
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return l * l == num || r * r == num;
};