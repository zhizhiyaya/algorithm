/**
 * @desc 
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var pacificAtlantic = function (matrix) {
    var m = matrix.length;
    if (m === 0) {
        return [];
    }
    var n = matrix[0].length;
    if (n === 0) {
        return [];
    }
    var res = [];
    var pacific = new Array(m);
    var atlantic = new Array(m);
    
    for (var i = 0; i < m; ++i) {
        dfs(matrix, pacific, 0, i, 0);
        dfs(matrix, atlantic, 0, i, n - 1);
    }
    for (var i = 0; i < n; ++i) {
        dfs(matrix, pacific, 0, 0, i);
        dfs(matrix, atlantic, 0, m - 1, i);
    }
    for (var i = 0; i < m; ++i) {
        for (var j = 0; j < n; ++j) {
            if (pacific[i][j] && atlantic[i][j]) {
                res.push([i, j]);
            }
        }
    }
    return res;
};

function dfs(matrix, visited, pre, i, j) {
    var m = matrix.length,
        n = matrix[0].length;
    if (!visited[i]) {
        visited[i] = [];
    }
    if (i < 0 || i >= m || j < 0 || j >= n // 边界
        || visited[i][j]
        || matrix[i][j] < pre // 就是要筛选海拔高的，才能流向低处
    ) {
        return;
    }
    visited[i][j] = true;
    dfs(matrix, visited, matrix[i][j], i + 1, j);
    dfs(matrix, visited, matrix[i][j], i - 1, j);
    dfs(matrix, visited, matrix[i][j], i, j + 1);
    dfs(matrix, visited, matrix[i][j], i, j - 1);
}

var m = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]];
pacificAtlantic(m);