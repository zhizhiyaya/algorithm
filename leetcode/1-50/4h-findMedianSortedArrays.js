/**
 * @method js 偷懒式做法.返回中位数
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    var num = nums1.concat(nums2)
    num.sort((a, b) => a - b);

    var length = num.length;
    if (length % 2 === 0) {
        return (num[length / 2 - 1] + num[length / 2]) / 2;
    } else {
        return num[Math.floor(length / 2)];
    }
}

/**
 * O(log (m+n))
 */

function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    const m = nums1.length;
    const n = nums2.length;
    const halfLen = Math.floor((m + n + 1) / 2);
    let imin = 0, imax = m;
    
    while (imin <= imax) {
        let i = Math.floor((imin + imax) / 2);
        let j = halfLen - i;
        if (i < m && nums2[j - 1] > nums1[i]) {
            imin = i + 1;
        } else if (i > 0 && nums1[i - 1] > nums2[j]) { // i 太大，需要减小 i
            imax = i - 1;
        } else {
            let maxOfLeft;
            if (i === 0) { maxOfLeft = nums2[j - 1]; }
            else if (j === 0) { maxOfLeft = nums1[i - 1]; }
            else { maxOfLeft = Math.max(nums1[i - 1], nums2[j - 1]); }
            
            if ((m + n) % 2 === 1) return maxOfLeft;
            
            let minOfRight;
            if (i === m) { minOfRight = nums2[j]; }
            else if (j === n) { minOfRight = nums1[i]; }
            else { minOfRight = Math.min(nums1[i], nums2[j]); }
            
            return (maxOfLeft + minOfRight) / 2;
        }
    }
    return 0;
}

console.log(findMedianSortedArrays([1, 3], [2]))