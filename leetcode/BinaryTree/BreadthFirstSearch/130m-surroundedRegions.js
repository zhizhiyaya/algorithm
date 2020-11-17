/**
 * @desc 类比 403h-trapRainWater 从边界为 O 的开始向内搜索并标记，最终遍历 未标记的置为 X
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
    if (board.length && board[0].length) {
        var r = board.length;
        var c = board[0].length;
        var queue = [];
        // 过滤出边界
        for (var i = 0; i < r; ++i) {
            for (var j = 0; j < c; ++j) {
                if (i === 0 || i === r - 1 || j === 0 || j === c - 1) { // 边界
                    if (board[i][j] === 'O') {
                        board[i][j] = 1;
                        queue.push({i, j});
                    }
                }
            }
        }
        // 过滤出和边界想通的点，并标记
        var dir = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // 上下左右索引操作
        while (queue.length) {
            var t = queue.shift();
            for (i = 0; i < dir.length; ++i) {
                const x = t.i + dir[i][0];
                const y = t.j + dir[i][1];
                if (x < 0 || x >= r || y < 0 || y >= c // 边界
                    || board[x][y] === 'X' || board[x][y] === 1) { // 非 O联通
                    continue;
                }
                queue.push({i: x, j: y});
                board[x][y] = 1;
            }
        }
        // 将未做标记的点反转为 X
        for (i = 0; i < r; ++i) {
            for (j = 0; j < c; ++j) {
                board[i][j] = board[i][j] === 1 ? 'O' : 'X';
            }
        }
    }
};
// var b = [['X', 'X', 'X', 'X'],['X', 'O', 'O', 'X'],['X', 'X', 'O', 'X'],['X', 'O', 'X', 'X']];
var b = [["O","X","X","O","X"],["X","O","O","X","O"],["X","O","X","O","X"],["O","X","O","O","O"],["X","X","O","X","O"]];
solve(b);
// Example:
// X X X X
// X O O X
// X X O X
// X O X X

// After running your function, the board should be:
// X X X X
// X X X X
// X X X X
// X O X X