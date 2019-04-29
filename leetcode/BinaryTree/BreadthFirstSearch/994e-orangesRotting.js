/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
    if (grid === null || grid.length === 0) return 0;
    var m = grid.length;
    var n = grid[0].length;
    var queue = [];
    var freshNum = 0;
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            if (grid[i][j] === 2) {
                queue.push({i, j});
            }
            else if (grid[i][j] === 1) {
                freshNum++;
            }
        }
    }
    if (freshNum === 0) return 0;
    var count = 0;
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length) {
        ++count;
        for (var i = queue.length; i--;) {
            var point = queue.shift();
            for (var j = dirs.length; j--;) {
                var x = point.i + dirs[j][0];
                var y = point.j + dirs[j][1];
                if (x < 0 || y < 0 || x >= m || y >= n
                    || grid[x][y] === 0 || grid[x][y] === 2) continue; // grid[x][y] === 2 与外层queue的遍历结合
                grid[x][y] = 2;
                queue.push({i: x, j: y});
                freshNum--;
            }
        }
    }
    return freshNum === 0 ? count - 1 : -1;
};

var grid = [[2,1,1],[1,1,0],[0,1,1]];
// var grid = [[2,1,1],[0,1,1],[1,0,1]];
orangesRotting(grid);