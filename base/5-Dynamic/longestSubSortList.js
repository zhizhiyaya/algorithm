/**
 * 1 、3 、2、4 -> 1 3 4 或 1 2 4
 * A（1） A（2）.... A(N)求最长上升子序列
 * 转换为以 A(k)为终点的最长上升子序列
 * maxLen(1) = 1;
 * maxLen(k) = max(maxLen(i): 1 <= i < k && A(i) < A(k) 且 k != 1) + 1; 
 * 若不存在上述条件的 i, 则 maxLen(k) = 1;
 */
function longestSubSortList(arr) {
    var len = arr.length;
    var maxLen = new Array(len);
    var max = 0;
    for(var i = 0; i < len; i++) {
        maxLen[i] = 1;
    }
    // 每次求以 A(i)为终点的最长上升子序列的长度
    for(var i = 1; i < len; i++) {
        // 察看以 A（j）为终点的最长上升子序列的长度
        for(var j = 0; j < i; j++) {
            if (arr[i] > arr[j]) {
                maxLen[i] = Math.max(maxLen[i], maxLen[j] + 1);
                max = Math.max(max, maxLen[i]);
            }
        }
    }
    return max;
}
longestSubSortList([1, 3, 2, 4, 2, 1])
