/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    var count = 0;
    n = grid.length;
    if (n == 0) return 0;
    m = grid[0].length;
    for (var i = 0; i < n; i++){
        for (var j = 0; j < m; j++)
            if (grid[i][j] == 1) {
                DFSMarking(grid, i, j);
                ++count;
            }
    }
    return count;
};

function DFSMarking(grid, i, j) {
    if (i < 0 || j < 0 || i >= n || j >= m || grid[i][j] != 1) {
        return ;
    }
    grid[i][j] = '0'; // 这里有点机智哇 ，深度优先遍历后 将一个 land 变成了 water， 主流程里的 == 1 就不再满足
    DFSMarking(grid, i + 1, j);
    DFSMarking(grid, i - 1, j);
    DFSMarking(grid, i, j + 1);
    DFSMarking(grid, i, j - 1);
}
