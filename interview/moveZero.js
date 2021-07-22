function moveZero(arr) { 
    var length = arr.length;
    if (length < 2) {
        return arr;
    }
    var l = 0;
    var r = arr.length - 1;
    var mid = 0;
    while (l < r) {
        if (arr[l] === 0 && arr[r] !== 0) {
            mid = arr[l];
            arr[l] = arr[r];
            arr[r] = mid;
            l++;
            r--;
        } else if (arr[r] === 0) {
            r--;
        } else if (arr[l] !== 0) {
            l++;
        } 
    }
    return arr;
}