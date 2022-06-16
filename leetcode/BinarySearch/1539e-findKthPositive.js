/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
 var findKthPositive = function(arr, k) {
    // lst = []
    // i = 1
    // while(lst.length <k + 1) {
    //     if (arr.indexOf(i) === -1) {
    //         lst.append(i)
    //         i = i + 1
    //     } else {
    //         i = i + 1
    //     }
    // }
    // return lst[k-1];

    var i = 0, j = arr.length;
        
    while(i < j) {
        var m = i + (j - i) / 2;
        if(arr[m] - (m + 1) >= k) {
            j = m;
        } else {
            i = m + 1;
        }
    }
    
    return i + k;
};


// Example 1:
// Input: arr = [2,3,4,7,11], k = 5
// Output: 9
// Explanation: The missing positive integers are [1,5,6,8,9,10,12,13,14,15]. The 5th missing positive integer is 9.


// Example 2:
// Input: arr = [1,2,3,4], k = 2
// Output: 6
// Explanation: The missing positive integers are [5,6,7,...]. The 2nd missing positive integer is 6.
