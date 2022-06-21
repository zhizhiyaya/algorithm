/**
 * @desc m*n 矩阵，行列都是降序排列，返回负数的个数。
 * @desc 从最后一行开始检测到负数 则累加负数的个数
 * ++++++
 * ++++--
 * ++++--
 * +++---
 * @param {number[][]} grid
 * @return {number}
 */
 var countNegatives = function(grid) {
    var m = grid.length, n = grid[0].length, r = m - 1, c = 0, cnt = 0;
    while (r >= 0 && c < n) {
        if (grid[r][c] < 0) {
            --r;
            cnt += n - c; // there are n - c negative numbers in current row.
        } else {
            ++c;
        }
    }
    return cnt;
};

// Example 1:
// Input: grid = [
//      [4,3,2,-1],
//      [3,2,1,-1],
//      [1,1,-1,-2],
//      [-1,-1,-2,-3]
// ]
// Output: 8
// Explanation: There are 8 negatives number in the matrix.