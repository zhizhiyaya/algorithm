/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
// 插入排序 return num1, num1.length == m + n; 
var merge = function(nums1, m, nums2, n) {
    
};

var merge = function(nums1, m, nums2, n) {
    var ret = [];    
    var i = 0, j = 0;
    while(i < m && j < n) {
        if (nums1[i] < nums2[j]) {
            ret.push(nums1[i]);
            i++;
        } else {
            ret.push(nums2[j]);
            j++;
        }
    }
    if (i < m) {
        ret = ret.concat(nums1.splice(i, m));
    }
    if (j < n) {
        ret = ret.concat(nums2.splice(j, n));
    }
    return ret;
};