/**
 * @param {number} n
 * @return {number}
 */
var tribonacci = function(n) {
    var arr = [0, 1, 1];
    if (n === 0 || n === 1 || n === 2) {
        return arr[n];
    }
    var next = 0;
    for (var i = 3; i <= n; i++) {
        next = arr[0] + arr[1] + arr[2];
        arr.shift();
        arr.push(next);
    }
    return arr[2];
};