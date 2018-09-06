/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
    var res = 0;
    var sign = 1;
    var stack = [];
    var curChar = '';
    s = s.replace(/\s/g, '');
    var len = s.length;
    for (var i = 0; i < len; i++) {
        curChar = s[i];
        if (curChar >= 0) {
            var num = 0;
            var flag = false;
            while (i < len && s[i] >= '0') {
                num = 10 * num + +s[i];
                i++;
                flag = true;
            }
            flag && i--;
            res += sign * num;
        } else {
            switch (curChar) {
                case '+':
                    sign = 1;
                    break;
                case '-':
                    sign = -1;
                    break;
                case '(':
                    stack.push(res);
                    stack.push(sign);
                    res = 0;
                    sign = 1;
                    break;
                case ')':
                    res *= stack.pop();
                    res += stack.pop();
                    break;
            }
        }
    }
    return res;
};
calculate('1 + 1');
// calculate('(1+(40+5+2)-3)+(6+8)');
// Input: "(1+(40+5+2)-3)+(6+8)"
// Output: 65
