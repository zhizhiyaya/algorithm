// 输入：[['a', 'b'], ['n', 'm'], ['0', '1']]
// 输出：["an0", "an1", "am0", "am1", "bn0", "bn1", "bm0", "bm1"]

function join(arr) {
    return arr.reduce((a, cur) => {
        if (a.length === 0) {
            return cur;
        }
        var res = []; 
        for (var i = a.length; i--;) {
            res.push(`${a[i]}${cur[0]}`);
            res.push(`${a[i]}${cur[1]}`);
        }
        return res;
    }, []);
}