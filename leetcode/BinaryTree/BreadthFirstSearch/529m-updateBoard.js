/**
 * @desc 对于当前需要点击的点，我们先判断是不是雷，是的话直接标记X返回即可。
 *          如果不是的话，我们就数该点周围的雷个数，如果周围有雷，则当前点变为雷的个数并返回。如果没有的话，我们再对周围所有的点调用递归函数再点击即可。
 * @param {character[][]} board
 * @param {number[]} click
 * @return {character[][]}
 */
var updateBoard = function(board, click) {
    var m = board.length;
    var n = board[0].length;
    var row = click[0];
    var col = click[1];
    if (board[r][c] === 'M') {
        board[r][c] = 'X';
    } else {
        var count = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                var r = row + i, c = col + j;
                if (r < 0 || r >= m || c < 0 || c < 0 || c >= n) continue;
                if (board[r][c] == 'M' || board[r][c] == 'X') count++;
            }
        }
        if (count > 0) { // If it is not a 'B', stop further DFS.
            board[row][col] = (char)(count + '0');
        }
        else { // Continue DFS to adjacent cells.
            board[row][col] = 'B';
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    var r = row + i, c = col + j;
                    if (r < 0 || r >= m || c < 0 || c < 0 || c >= n) continue;
                    if (board[r][c] == 'E') updateBoard(board, [r, c]);
                }
            }
        }
    }
    return board;
};


public char[][] updateBoard(char[][] board, int[] click) {
    int m = board.length, n = board[0].length;
    int row = click[0], col = click[1];
    
    if (board[row][col] == 'M') { // Mine
        board[row][col] = 'X';
    }
    else { // Empty
        // Get number of mines first.
        int count = 0;
        for (int i = -1; i < 2; i++) {
            for (int j = -1; j < 2; j++) {
                if (i == 0 && j == 0) continue;
                int r = row + i, c = col + j;
                if (r < 0 || r >= m || c < 0 || c < 0 || c >= n) continue;
                if (board[r][c] == 'M' || board[r][c] == 'X') count++;
            }
        }
        
        if (count > 0) { // If it is not a 'B', stop further DFS.
            board[row][col] = (char)(count + '0');
        }
        else { // Continue DFS to adjacent cells.
            board[row][col] = 'B';
            for (int i = -1; i < 2; i++) {
                for (int j = -1; j < 2; j++) {
                    if (i == 0 && j == 0) continue;
                    int r = row + i, c = col + j;
                    if (r < 0 || r >= m || c < 0 || c < 0 || c >= n) continue;
                    if (board[r][c] == 'E') updateBoard(board, new int[] {r, c});
                }
            }
        }
    }
    
    return board;
}