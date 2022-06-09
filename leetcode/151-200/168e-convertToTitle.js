/**
 * @param {number} columnNumber
 * @return {string}
 */
var convertToTitle = function(n) {
    var strArr = [];
    var dig = 26;
    while(n > 0) {
        var r = n % dig === 0 ? dig : n % dig;
        var tmp = String.fromCharCode(r + 64);
        strArr.unshift(tmp);
        n = (n - r) / dig;
    }
    
    return strArr.join('');
};


// For example:

// A -> 1
// B -> 2
// C -> 3
// ...
// Z -> 26
// AA -> 27
// AB -> 28 
// ...
 

// Example 1:
char 
// Input: columnNumber = 1 
// Output: "A"
// Example 2:

// Input: columnNumber = 28
// Output: "AB"
// Example 3:

// Input: columnNumber = 701
// Output: "ZY"
// Example 4:

// Input: columnNumber = 2147483647
// Output: "FXSHRXW"