// 遍历
function trans(arr, n) {
    return arr.reduce((a, item) => {
        if (a.length === 0) {
            a.push([]);
        }
        if (a[a.length - 1].length >= n) {
            a.push([])
        } 
        a[a.length - 1].push(item);
        return a;
    }, []);
}
// 切片1
function trans(arr, n) {
    let newArr = [];
    let i = 0;
    while(i < arr.length) {
        newArr.push(arr.slice(i, i + n));
        i += n;
    }
    return newArr;
}
// 切片2，该方法有副作用噢... ..... 
function trans(arr, n) {
    let newArr = [];
    while(arr.length) {
        newArr.push(arr.splice(0, n));
    }
    return newArr;
}