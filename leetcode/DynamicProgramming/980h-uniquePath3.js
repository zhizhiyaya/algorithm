// 1 represents the starting square.  There is exactly one starting square.
// 2 represents the ending square.  There is exactly one ending square.
// 0 represents count squares we can walk over.
// -1 represents obstacles that we cannot walk over.
// walk over every non-obstacle square exactly once.
/**
 * @param {number[][]} grid
 * @return {number}
 */
var uniquePathsIII = function(grid) {
    if(!grid || !grid[0]) {
        return 0;
    }
    var visitCount = 0;
    for(var i = 0; i < grid.length; i++){
        for(var j=0; j < grid[0].length; j++) {
            visitCount += grid[i][j] == 0 ? 1 : 0; // 0 的数量
        }
    }

    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid[0].length; j++) {
            if(grid[i][j] == 1) {
                visitCount++; // 开始节点1 也走了 所以+1
                return dfs(grid, i, j, visitCount);
            }
        }
    } 
    return 0;
};
function dfs(grid, x, y, visitCount) {
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length || grid[x][y] < 0)
        return 0;
    if (grid[x][y] == 2) {
        return visitCount == 0 ? 1 : 0; 
    }
    grid[x][y] = -2;
    visitCount--;
    var ways = 0;
    ways += dfs(grid, x + 1, y, visitCount);
    ways += dfs(grid, x - 1, y, visitCount);
    ways += dfs(grid, x, y + 1, visitCount);
    ways += dfs(grid, x, y - 1, visitCount);
    grid[x][y] = 0; // 可能是初始的1呢.. 
    visitCount++;
    return ways;
}   