/**
 * @desc arr1 存在几项满足  abs(arr1[i] - arr2[0...j]) > d 的，
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @param {number} d
 * @return {number}
 */
 var findTheDistanceValue = function(arr1, arr2, d) {
    var i, j, c = 0;
    
    for(i = 0; i < arr1.length; i++) {
        for(j = 0; j < arr2.length; j++) {
            if (Math.abs(arr1[i] - arr2[j]) <= d) {
                break;
            }
        }
        if (j >= arr2.length) {
            c++;
        }
    }
    return c;
};


// Example 1:

// Input: arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2
// Output: 2
// Explanation: 
// For arr1[0]=4 we have:  
// |4-10|=6 > d=2 
// |4-9|=5 > d=2 
// |4-1|=3 > d=2 
// |4-8|=4 > d=2  全大于d ,结果 +1
// For arr1[1]=5 we have: 
// |5-10|=5 > d=2 
// |5-9|=4 > d=2 
// |5-1|=4 > d=2 
// |5-8|=3 > d=2 全大于d ,结果 +1
// For arr1[2]=8 we have:
// |8-10|=2 <= d=2 有小于d的,忽略
// |8-9|=1 <= d=2
// |8-1|=7 > d=2
// |8-8|=0 <= d=2

// Example 2:

// Input: arr1 = [1,4,2,3], arr2 = [-4,-3,6,10,20,30], d = 3
// Output: 2

// Example 3:
// Input: arr1 = [2,1,100,3], arr2 = [-5,-2,10,-3,7], d = 6
// Output: 1

// Given two integer arrays arr1 and arr2, and the integer d, return the distance value between the two arrays.

// The distance value is defined as the number of elements arr1[i] such that there is not any element arr2[j] where |arr1[i]-arr2[j]| <= d.

