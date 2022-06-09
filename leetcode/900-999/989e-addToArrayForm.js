/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function(num, k) {
    var b = (k + '').split('');
    var i = num.length - 1;
    var j = b.length - 1; 
    var carry = 0;
    var sum = 0;
    var bSum = '';

    while(i >= 0 || j >= 0) {
        sum = carry + (+num[i--] || 0) + (+b[j--] || 0);
        bSum = '' + sum % 10 + bSum;
        carry = Math.floor(sum / 10);
    }
    if (carry) {
        bSum = carry + bSum
    }
    return bSum.split('');
};

// Input: num = [1,2,0,0], k = 34
// Output: [1,2,3,4]
// Explanation: 1200 + 34 = 1234