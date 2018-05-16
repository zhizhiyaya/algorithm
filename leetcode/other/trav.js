var obj = {
    a: 'a',
    b: 'b',
    child: {
        c: 'a',
        d: 'b',
        child: {
            e: 'a',
            f: 'b',
        }
    }
};
// concat 返回新数组 😂   傻了吧 。。。。
// function getKey(obj, ret) {
//     for(let key in obj) {
//         if (key === 'child') {
//             ret.concat(getKey(obj[key], ret));
//         } else {
//             ret.push(key);
//         }
//     }
//     return ret;
// }
// getKey(obj, []);

function getKey(obj) {
    let ret = [];
    for(let key in obj) {
        if (key === 'child') {
            ret = ret.concat(getKey(obj[key]));
        } else {
            ret.push(key);
        }
    }
    return ret;
}
getKey(obj);
