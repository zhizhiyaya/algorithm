/**
 * 插入排序
 * 设数组为a[0 … n-1]。
 * 初始时，a[0]自成1个有序区，无序区为a[1..n-1]。令i=1
 * 将a[i]并入当前的有序区a[0…i-1]中形成a[0…i]的有序区间。
 * i++并重复第二步直到i==n-1。排序完成。
 */

// 如果a[j]前一个数据a[j-1] > a[j]，就交换a[j]和a[j-1]，再j--
// 直到a[j-1] <= a[j]。这样也可以实现将一个新数据并入到有序区间
function insertSort (arr, n) {
    var mid = null;
    n = n || arr.length;

    for (i = 1; i < n; i++) {
        if (arr[i] < arr[i - 1]) { // 当前元素 比 有序区最大的小时才需要调整，否则不需要
            for (j = 0; j < i; j++) {
                if (arr[j] >= arr[i]) {
                    // 非 js 要考虑，insert 时需要将当前位置后的元素后移
                    mid = arr[i];
                    arr.splice(i, 1); // 之所以先删除, 是因为如果先添加进去会影响 后面的索引
                    arr.splice(j, 0, mid);
                }
            }
        }
    }
    return arr;
}
// js 中就不用担心数组后移操作，因为数组有一个方法 arr.splice(start,0,num)即可直接将插入的数放进去,

// 二分插入排序，优化的是 有序区的查找
function binInsertSort(arr) {
    var cur = null;
    var left = 0;
    var right = 0;
    var mid = 0;
    var n = arr.length;

    for (var i = 1; i < n; i++) {
        cur = arr[i];
        if (arr[i] < arr[i - 1]) { // 当前元素 比 有序区最大的小时才需要调整，否则不需要
            left = 0;
            right = i - 1;
            while (left < right) {
                mid = left + parseInt((right - left) / 2, 10);
                if (arr[mid] > cur) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
            if (arr[left] < cur) {
                left++;
            }
            arr.splice(i, 1);
            arr.splice(left, 0, cur);
        }
    }
    return arr;
}

/**
 * 同 二分排序，
 * 从无序数列 选取 k 个最小数
 * in: [4,5,1,6,2,7,3,8], 4
 * out : [1, 2, 3, 4]
 */
function GetLeastNumbers_Solution(input, k) {
    if (k > input.length || k === 0) {
        return [];
    }
    var res = new Array(); 
    var length = input.length;
    for (var i =  length; i--; ) {
        var resLength = res.length;
        // 判断提前，否则就移到 insert里检查
        if (input[i] < res[0]) {
            res.unshift(input[i]);
            if (res.length > k) {
                res.pop();
            }
        } else if (input[i] > res[resLength - 1]) {
            if (resLength < k) {
                res.push(input[i]);
            }
        } else {
            insert(res, k, input[i]);
        }
    }
    return res;
}
function insert(arr, k, num) {
    var length = arr.length;
    var h = length - 1;
    var l = 0;
    var mid = Math.floor((l + h) / 2, 10);;
    // 2 3 7 8 , 6
    while(l < h && mid !== l && mid !==h) {
        if (num < arr[mid]) {
            h = mid;
        } else if (num > arr[mid]) {
            l = mid;
        }
        mid = Math.floor((l + h) / 2, 10);
    }
    if (arr[l] < num) {
        l++;
    }
    arr.splice(l, length < k ? 0 : 1, num);
}
var a = [4,5,1,6,2,7,3,8];
GetLeastNumbers_Solution(a, 4)
