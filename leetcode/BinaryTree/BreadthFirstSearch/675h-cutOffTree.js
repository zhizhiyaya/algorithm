// Wrong Answer !!!

/**
 * @desc 把是树的节点，按树高从低到高排序。从第一棵树开始，BFS求出和下一棵树之间的最短路径，然后累计路径和为结果。如果不能走到下一棵树，则返回-1。
 * @param {number[][]} forest
 * @return {number}
 */
var cutOffTree = function (forest) {
    if (!forest.length || !forest[0].length) {
        return;
    }
    var m = forest.length;
    var n = forest[0].length;
    var res = 0, row = 0, col = 0;
    var trees = [];
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            if (forest[i][j] > 1) {
                binInsert(trees, { // 二分插入
                    val: forest[i][j],
                    row: i,
                    col: j
                });
            }
        }
    }
    for (var i = 0; i < trees.length; i++) {
        var cnt = helper(forest, row, col, trees[i].row, trees[i].col);
        if (cnt === -1) return -1;
        res += cnt;
        row = trees[i].row;
        col = trees[i].col;
    }
    return res;
};

function helper(forest, row, col, treeRow, treeCol) {
    if (row === treeRow && col === treeCol) return 0;
    var m = forest.length, n = forest[0].length, cnt = 0;
    var q = [{row, col}];
    var visited = new Array(row);
    var dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    while (q.length) {
        ++cnt;
        for (var i = q.length; i--;) {
            var t = q.shift();
            for (var j = dirs.length; j--;) {
                var dir = dirs[j];
                var x = t.row + dir[0];
                var y = t.col + dir[1];
                if (!visited[x]) {
                    visited[x] = new Array(n);
                }
                if (x < 0 || x >= m || y < 0 || y >= n
                    || visited[x][y] || forest[x][y] === 0) {
                    continue;
                }
                if (x === treeRow && y === treeCol) {
                    return cnt;
                }
                visited[x][y] = true;
                q.push({
                    row: x,
                    col: y
                });
            }
        }
    }
    return -1;
}

// 二分插入
function binInsert(arr, cur) {
    var left = 0;
    var right = arr.length;
    var mid;
    if (right <= 0) {
        return arr.push(cur);
    }
    while (left < right) {
        mid = parseInt((left + right) / 2, 10);
        if (arr[mid].val <= cur.val) {
            if (!arr[mid + 1] || (arr[mid + 1] && cur.val <= arr[mid + 1].val)) {
                arr.splice(mid + 1, 0, cur);
                break;
            } else {
                left = mid;
            }
        } else {
            right = mid;
        }
    }
}

// var forest = [[1, 2, 3], [0, 0, 0], [7, 6, 5]];
// var forest = [
//     [54581641, 64080174, 24346381, 69107959],
//     [86374198, 61363882, 68783324, 79706116],
//     [  668150, 92178815, 89819108, 94701471],
//     [83920491, 22724204, 46281641, 47531096],
//     [89078499, 18904913, 25462145, 60813308]
// ];
// < === >
var forest = [
    [       8,       11,        4,       13],
    [      16,       10,       12,       14],
    [       1,       19,       18,       20],
    [      15,        3,        6,        7],
    [      17,        2,        5,        9]
];
cutOffTree(forest);