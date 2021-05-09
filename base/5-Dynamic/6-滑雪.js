var longestIncreasingPath = function(matrix) {
    
}


// leetcode 329h-longestIncreasingPath
/**
 * @param {number[][]} matrix
 * @return {number}
 */
// O(mn) time O(mn) space. DFS + DP
var MAX_VALUE = 2147483647;
var longestIncreasingPath = function(matrix) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return 0;
    }
    var cache = new Array(matrix.length);
    var max = 0;
    for (var i = 0; i < matrix.length; i++) {
        if (!cache[i]) {
            cache[i] = new Array(matrix[0].length);
        }
        for (var j = 0; j < matrix[0].length; j++) {
            var length = findSmallAround(i, j, matrix, cache, MAX_VALUE);
            max = Math.max(length, max);
        }
    }
    return max;
};

// int i, int j, int[][] matrix, int[][] cache, int pre
function findSmallAround(i, j, matrix, cache, pre) {
    // if out of bond OR current cell value larger than previous cell value.
    if (i < 0 || i >= matrix.length || j < 0 || j >= matrix[0].length || matrix[i][j] >= pre) {
        return 0;
    }
    if (!cache[i]) {
        cache[i] = new Array(matrix[0].length);
    }
    // if calculated before, no need to do it again
    if (cache[i][j] > 0) {
        return cache[i][j];
    } else {
        var cur = matrix[i][j] || 0;
        var tempMax = 0;
        tempMax = Math.max(findSmallAround(i - 1, j, matrix, cache, cur), tempMax);
        tempMax = Math.max(findSmallAround(i + 1, j, matrix, cache, cur), tempMax);
        tempMax = Math.max(findSmallAround(i, j - 1, matrix, cache, cur), tempMax);
        tempMax = Math.max(findSmallAround(i, j + 1, matrix, cache, cur), tempMax);
        cache[i][j] = ++tempMax;
        return tempMax;
    }
}
