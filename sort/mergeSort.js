/** 归并排序 mergeArray
 * 采用 分治法，
 * 1、Divide: 把长度为n的输入序列分成两个长度为 n/2 的子序列。
 * 2、Conquer: 对这两个子序列分别采用 归并排序。
 * 3、Combine: 将两个排序好的子序列合并成一个最终的排序序列。
 *
 * 设数列长为N，将数列分开成小数列一共要logN步，每步都是一个合并有序数列的过程，
 * 时间复杂度可以记为O(N)，故一共为O(N*logN)
 **/

// 可以看出合并有序数列的效率是比较高的，可以达到O(n)
/**
 * @method 将有二个有序数列a[first...mid]和a[mid...last]合并。
 * @param {Array} a
 * @param {Number} first index
 * @param {Number} mid index
 * @param {Number} last index
 * @param {Array} temp
 **/
function mergeArray(a, first, mid, last, temp) {
    var i = first, j = mid + 1;
    var m = mid,   n = last;
    var k = 0;

    while (i <= m && j <= n) {
        if (a[i] <= a[j])
            temp[k++] = a[i++];
        else
            temp[k++] = a[j++];
    }

    while (i <= m)
        temp[k++] = a[i++];

    while (j <= n)
        temp[k++] = a[j++];

    for (i = 0; i < k; i++)
        a[first + i] = temp[i];
}

/**
 * @param {Array} a
 * @param {Number} first index
 * @param {Number} last index
 * @param {Array} temp
 **/
function _mergeSort(a, first, last, temp) {
    if (first < last) {
        var mid = parseInt((first + last) / 2);
        _mergeSort(a, first, mid, temp);    //递归拆分左边
        _mergeSort(a, mid + 1, last, temp); //递归拆分右边
        mergeArray(a, first, mid, last, temp); //再将二个有序数列合并，拆分到数组长度为 1 时，就自然有序了
    }
}

function mergeSort(a, n) {
    _mergeSort(a, 0, n - 1, []);
	return a;
}
