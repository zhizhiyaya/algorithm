/**
 * @desc 所有能流向两大洋的点的集合（该点一定有某条通道是大于等于其他点的）
 * @method https://leetcode.com/problems/pacific-atlantic-water-flow/discuss/90810/Java-28ms-BFS-solution-using-one-queue
 *      00: cannot reach any ocean
 *      01: can reach pacific ocean
 *      10: can reach atlantic ocean
 *      11: can reach two oceans
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var pacificAtlantic = function (matrix) {
    var res = [];
    var m = matrix.length;
    if (m === 0) {
        return [];
    }
    var n = matrix[0].length;
    if (n === 0) {
        return [];
    }
    var state = new Array(m);
    var queue = [];
    // 以下的遍历 标记出边界点，并找出贯通 pacific atlantic的点
    for (var i = 0; i < m; i++) {
        if (!state[i]) {
            state[i] = [];
        }
        state[i][0] |= 1; // 左边界 可到达 pacific
        if (i === m - 1 || n === 1) { // 最后一列 || 只有一列， 可到达 atlantic
            state[i][0] |= 2;
        }
        if (state[i][0] === 3) { // 既可到达 pacific，也可到达 atlantic
            res.push([i, 0]);
        }
        queue.push([i, 0]); // 左边界
        if (n > 1) {
            state[i][n - 1] |= 2; // 右边界，可到达 atlantic
            if (i === 0) {
                state[0][n - 1] |= 1; // 右上角，也可到达 pacific
            }
            if (state[i][n - 1] === 3) {
                res.push([i, n - 1]);
            }
            queue.push([i, n - 1]); // 右边界
        }
    }
    
    for (var j = 1; j < n - 1; j++) {
        state[0][j] |= 1; // 上边界 可到达 pacific
        if (m === 1) { // 只有1行
            state[0][j] |= 2; // 只有1行 可到达 atlantic
        }
        if (state[0][j] === 3) { // 既可到达 pacific，也可到达 atlantic
            res.push([0, j]);
        }
        queue.push([0, j]); // 上边界
        if (m > 1) {
            state[m - 1][j] |= 2; // 下边界，
            if (state[m - 1][j] === 3) {
                res.push([m - 1, j]);
            }
            queue.push([m - 1, j]); // 下边界
        }
    }

    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    // 以边界点开始向内遍历
    while (queue.length) {
        var cell = queue.shift();
        for (var i = dirs.length; i--;) {
            var row = cell[0] + dirs[i][0];
            var col = cell[1] + dirs[i][1];
            if (row < 0 || col < 0 || row === m || col === n
                || matrix[row][col] < matrix[cell[0]][cell[1]] // 该点时高海拔点，则临接点无需再考虑
                // 临接点海拔不低时并且和该点标记相同时continue；
                // 不同时，则表明是交界点了，会被置为 3
                || ((state[cell[0]][cell[1]] | state[row][col]) === state[row][col])
            ) {
                continue;
            }
            state[row][col] |= state[cell[0]][cell[1]];
            if (state[row][col] === 3) {
                res.push([row, col]);
            }
            queue.push([row, col]);
        }
    }
    return res;
};

var matrix = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]];
pacificAtlantic(matrix);