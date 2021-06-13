/**
 * @desc 1离0最近的距离
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var updateMatrix = function (matrix) {
    var m = matrix.length;
    if (!m) {
        return matrix;
    }
    var n = matrix[0].length;
    if (!n) {
        return matrix;
    }
    var queue = [];
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                queue.push([i, j]);
            } else {
                // 为1 的置成最大值， 结合遍历条件 matrix[r][c] <= matrix[cell[0]][cell[1]] + 1
                // 类似海平面上升原理，离0 为1 的距离的+1，变成二级优先的点，
                // 离二级优先的再+1 依次类推
                matrix[i][j] = Number.MAX_VALUE;
            }
        }
    }
    
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    while (queue.length) {
        var cell = queue.shift();
        for (var i = dirs.length; i--;) {
            var r = cell[0] + dirs[i][0];
            var c = cell[1] + dirs[i][1];
            if (r < 0 || r >= m || c < 0 || c >= n
                || matrix[r][c] <= matrix[cell[0]][cell[1]] + 1) {
                continue;
            }
            queue.push([r, c]);
            matrix[r][c] = matrix[cell[0]][cell[1]] + 1;
        }
    }
    return matrix;
};
var m = [[0,0,0],[0,1,0],[1,1,1]];
updateMatrix(m);
// Input:
// 0 0 0
// 0 1 0
// 1 1 1

// Output:
// 0 0 0
// 0 1 0
// 1 2 1