/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
    var roman = [
        ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
        ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
        ["", "M", "MM", "MMM"]
    ];
    num += '';
    num = num.split('').reverse();
    var len = num.length;
    var n = '';
    for (var i = 0; i < len; i++) {
        n = roman[i][+ num[i]] + n;
    }
    
    return n;
};