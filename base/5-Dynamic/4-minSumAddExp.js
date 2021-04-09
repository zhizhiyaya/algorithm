/**
 * n 个数字插入 m 个加号，使和最小
 * 转换为 最后一个 + 放在第 i 个数字之后，
 *     那么表达式的最小值 = (前 i 个字符插入 m - 1 个加号组成的最小值) + (后 i+1 ～ n 组成的最小数) i从1开始
 * m = 0，V(m, n) = n个数字组成的整数;
 * m > n - 1，V(m, n) = ∞ (即 n 个数字有 n - 1 个空位，最多放 n-1个 +，m > n - 1 超出 +的最大量)
 * m <= n - 1，V(m, n) = Min( V(m - 1, i) + Num(i+1, n))，（i= m ... n - 1）
 */
function minSumAddExp(arr, m) {
    var len = arr.length;
    if (m === 0) {
        return getNum(arr);
    }
    if (m > len - 1) {
        return Number.MAX_SAFE_INTEGER;
    }
    var sumArr = new Array(len);
    var min = Number.MAX_SAFE_INTEGER;
    /**
     * 预处理，算出来 Num(i, j)
     *      [3, 5, 1]
     *      j    
     *   i     0   1   2
     *      0  3   x   x
     *      1  35  5   x
     *      2  351 51  1
     */ 
    for (var i = 0; i < len; i++) {
        sumArr[i] = new Array(len);
        for (var j = i; j < len; j++) {
            sumArr[i][j] = getNum(arr.slice(i, j + 1));
        }
    }
    function getV(m, n) {
        if (m === 0) {
            return sumArr[0][n];
        }
        if (m > len - 1) {
            return Number.MAX_SAFE_INTEGER;
        }
        for(var i = len - 2; i > -1; i--) {
            min = Math.min(min, getV(m - 1, i) + sumArr[i + 1][n]);
        }
        return min;
    }
    return getV(m, len - 1);
}


function getNum(arr) {
    return arr.reduce((sum, i) => {
        return sum * 10 + i;
    }, 0);
}
minSumAddExp([3, 2, 4], 1)
