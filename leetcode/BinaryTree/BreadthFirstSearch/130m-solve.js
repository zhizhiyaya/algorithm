/**
 * For example,
		X X X X
		X O O X
		X X O X
		X O X X

		After running your function, the board should be:
		X X X X
		X X X X
		X X X X
		X O X X
 *	保留 O 周围全是 x 的，否则转换为 X
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function(board) {
	var s = '';
	for(var i = board.length - 1; i >= 0; i--) {
		s = '';
		for (var j = board[i].length - 1; j >= 0; j--) {
			if (board[i][j] === 'O') {
				if (
					!((!board[i - 1] || board[i - 1][j] === 'X')
					&& (!board[i][j - 1] || board[i][j - 1] === 'X')
					&& (!board[i][j + 1] || board[i][j + 1] === 'X')
					&& (!board[i + 1] || board[i + 1][j] === 'X')
				)) {
					s += 'X';
				} else {
					s += board[i][j];
				}
			} else {
				s += board[i][j];
			}
		}
		board[i] = s;
	}
};
var a = ["XXXX","XOOX","XXOX","XOXX"];
console.log(solve(a));
