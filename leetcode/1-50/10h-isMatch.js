/**
 * @method 正则匹配
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
    var reg;
    if (p.indexOf('*')) {
    	reg = eval('/' + p + '/');	
    } else {
    	reg = eval('/' + '\b' + p + '\b' + '/');	
    }
    return reg.test(s);
};

console.log(isMatch("aa","a"));
console.log(isMatch("aa","aa"));
console.log(isMatch("aaa","aa"));
console.log(isMatch("aa", "a*"));
console.log(isMatch("aa", ".*"));
console.log(isMatch("ab", ".*"));
console.log(isMatch("aab", "c*a*b"));