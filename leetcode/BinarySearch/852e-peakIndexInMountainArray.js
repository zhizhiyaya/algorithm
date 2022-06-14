/**
 * @desc 山头两边有序，例如 [ 1, 3, 5, 4, 2], 5是山头
 * @param {number[]} arr
 * @return {number}
 */
 var peakIndexInMountainArray = function(arr) {
    var l = 0;
    var r = arr.length - 1;
    var m = 0;
    while(l <= r){
        m = l + parseInt((r - l) / 2);
        if(arr[m] < arr[m + 1]){
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return arr[l] < arr[r] ? r : l;
};