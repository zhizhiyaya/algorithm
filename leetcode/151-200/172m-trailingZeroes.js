/**
 * @param {number} n
 * @return {number}
 */
var trailingZeroes = function(n) {
    if (n < 5) {
        return 0;
    }
    return n == 0 ? 0 : Math.floor(n / 5) + trailingZeroes(Math.floor(n / 5));
};