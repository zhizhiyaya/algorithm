/**
 * @desc 数字三角形
 * 从下往上，val(i, j) = val(i, j) + Max(val(i+1, j), val(i+1, j+1))   
    7
    3 8
    8 1 0
    2 7 4 4  =》 7 12 10 10 （2 从 下一行的（4， 5）里选择5 变成7，7 从 （5， 2）里选择5 12 .... ）
    4 5 2 6 5 
 * @param {string} s
 * @param {string} p
 * @return max
 */
var maxVal = function(grid) {
    var r = grid.length - 1;
    var c = grid[r].length;
    var arr = grid[r]; // 滚动数组

    for(r--; r > -1; r--) {
        for (var c = 0;  c < grid[r].length; c++) {
            arr[c] = grid[r][c] + Math.max(arr[c], arr[c + 1]);
        }
    }
    return arr[0];
};

console.log(maxVal([
    [7],
    [3, 8],
    [8, 1, 0],
    [2, 7, 4, 4] 
]));
    

function maxSum(num, a)
{
    var D = generateArr(num);
    for(i = num - 1; i >= 0; i --) {
        if (D[i+1]) {
            for(j = 0; j <= i; j ++){
                D[i][j] = Math.max(D[i+1][j],D[i+1][j+1]) + D[i][j];
            }
        }
    }
    return D[0][0];
}

function generateArr(n) {
    var i, j;
    var a = new Array(n);
    for(i = 1; i <= n; i++) {
        a[i-1] = new Array(i);
        for(j = 1; j <= i; j++) {
            a[i-1][j-1] = parseInt(Math.random() * 10);
        }
    }
    return a;
}
