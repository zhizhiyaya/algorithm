/**
 * @param {number[]} digits
 * @return {number[]}
 */
 var plusOne = function(digits) {
    var carry = 1;
    var sum = 0;
    for (var i = digits.length; i--;) {
        sum = carry + digits[i];
        digits[i] = sum % 10;
        carry = Math.floor(sum / 10);
    }
    if (carry) {
        digits.unshift(carry);
    }
    return digits;
};
// Input: num = [1,2,0,0]
// Output: [1,2,0,1]
// Explanation: 1200 + 1 = 1201