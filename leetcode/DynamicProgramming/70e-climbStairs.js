/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if ( n === 1) {
        return 1;
    }
    if (n === 2) {
        return 2;
    }
    var res = [1, 2];
    // return climbStairs(n - 1) + climbStairs(n - 2);
    for (var i = 3; i <= n; i++) {
        res.push(res[0] + res[1]);
        res.shift();
    }
    return res[1];
};


// TLE
var climbStairs = function(n) {
    if ( n === 1) {
        return 1;
    }
    if (n === 2) {
        return 2;
    }
    return climbStairs(n - 1) + climbStairs(n - 2);
};