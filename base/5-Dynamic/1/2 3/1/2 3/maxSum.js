// 1
// 2 3 
// 4 5 6
// 数字三角形
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
