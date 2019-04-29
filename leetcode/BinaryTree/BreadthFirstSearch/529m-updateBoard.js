/**
 * @desc 如果点击的是雷点M则将该点变为X然后返回结束扫雷。
 *          如果点击的不是雷点，则查看其八邻域内是否有雷，
 *          如果没有雷，则将该节点的值设置为B，
 *          如果有雷，则将该点的值置为雷的个数。
 * 优化：根据第一次找周围雷个数的时候，若此时cnt个数为0并且标识是E的位置记录下来，
 *      那么如果最后雷个数确实为0了的话，我们直接遍历我们保存下来为E的位置递归即可
 * @param {character[][]} board
 * @param {number[]} click
 * @return {character[][]}
 */
var updateBoard = function (board, click) {
    if (!board.length || !board[0].length) {
        return {};
    };
    var m = board.length;
    var n = board[0].length;
    var row = click[0];
    var col = click[1];
    var cnt = 0;
    if (board[row][col] === 'M') {
        board[row][col] = 'X';
    } else {
        var neighbors = [];
        for (var i = -1; i < 2; ++i) { // 遍历八邻位
            for (var j = -1; j < 2; ++j) {
                var x = row + i;
                var y = col + j;
                if (x < 0 || x >= m || y < 0 || y >= n) {
                    continue;
                }
                if (board[x][y] === 'M') { // 统计雷的个数
                    ++cnt;
                } else if (cnt === 0 && board[x][y] === 'E') {
                    neighbors.unshift([x, y]);
                }
            }
        }
        if (cnt > 0) {
            board[row][col] = cnt + '';
        } else { // 周围没有雷的点置为 B
            for (var i = neighbors.length; i--;) {
                var a = neighbors[i];
                board[a[0]][a[1]] = 'B';
                updateBoard(board, a);
            }
        }
    }
    return board;
};
var board = [['E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'M', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E']];
var click = [3, 0];
updateBoard(board, click);

// Output:
// [['B', '1', 'E', '1', 'B'],
//  ['B', '1', 'M', '1', 'B'],
//  ['B', '1', '1', '1', 'B'],
//  ['B', 'B', 'B', 'B', 'B']]