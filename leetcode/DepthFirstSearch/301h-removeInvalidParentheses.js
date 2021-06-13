/**
 * @desc 返回最长的合法字符串，剔除最短的（ 、）
 * @param {string} s
 * @return {string[]}
 */
function removeInvalidParentheses(s) {
    var res = [];
    if (s == null) return res;
    var visited = [];
    var queue = [];

    queue.push(s);
    visited.push(s);

    var found = false;
    while (queue.length) {
        s = queue.shift();
        if (isValid(s)) {
            // s 的（）是合法的
            res.push(s);
            found = true;
        }
        // 有合法的 即是最长的（因为是依次删除 （）来的），就不需要再分割去找子串了
        if (found) continue;

        // 对非法的串 进行删减 （） 然后再到 while 判断是否合法
        for (var i = 0; i < s.length; i++) {
            // we only try to remove left or right paren
            if (s.charAt(i) != '(' && s.charAt(i) != ')') continue;
            // 删减 （ 或 ）生成新串
            var t = s.substring(0, i) + s.substring(i + 1);
            if (visited.indexOf(t) === -1) { // 新生成的串 跟之前的串不重合
                queue.push(t);
                visited.push(t);
            }
        }
    }
    return res;
}

// 左（就++ ，右 ）-- , 最终数值一致则合法，否则中间则会校验出不合法
function isValid(s) {
    var count = 0;
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (c == '(') count++;
        if (c == ')' && count-- == 0) return false; // 检测到'）'多了1个，肯定就是非法字符了，不需要遍历完就终止了 
    }
    return count == 0;
}


/**
 * @desc p[1] 比 p[0] 多，则删 p[1]
 * @param {string} s
 * @return {string[]}
 */
function removeInvalidParentheses(s) {
    var res = [];
    helper(s, 0, 0, ['(', ')'], res);
    return res;
}

function helper(s, lastI, lastJ, p, res) {
    var cnt = 0;
    for (var i = lastI; i < s.length; ++i) {
        if (s[i] == p[0]) ++cnt;
        else if (s[i] == p[1]) --cnt;
        if (cnt >= 0) continue;
        // p[1] 比 p[0] 多，则删 p[1] 那么也就会触发后面的return 
        for (var j = lastJ; j <= i; ++j) {
            if (s[j] == p[1] && (j == lastJ || s[j] != s[j - 1])) {
                helper(s.substr(0, j) + s.substr(j + 1), i, j, p, res);
            }
        }
        return;
    }
    if (cnt === 0 && p[0] == '(') {
        res.push(s);
        return;
    }
    // 最后来说这个最叼的翻转，当字符串的左括号个数大于等于右括号的时候，不会进入第二个 for 循环，
    // 自然也不会 return。那么由于左括号的个数可能会要大于右括号，所以还要删除多余的左括号，
    // 将字符串反转一下，比如 "(()"，反转变成 ")(("，此时虽然还是要删除多余的左括号，
    // 但是反转后就没有合法的括号了，所以变成了找反向括号 ")("，还是可以删除多余的左括号，
    // 然后判断此时括号数组的状态，如果是正向括号，说明此时正要删除左括号，就调用递归函数，
    // last_i 和 last_j 均重置为0，括号数组初始化为反向括号。
    // 如果此时已经是反向括号了，说明之前的左括号已经删掉了变成了 ")("，然后又反转了一下，变回来了 "()"，
    // 就可以直接加入结果 res 了
    var rev = s.split('').reverse().join('');
    if (p[0] == '(') helper(rev, 0, 0, [')', '('], res);
    else res.push(rev);
}
    

console.log(removeInvalidParentheses("(()))()"));

removeInvalidParentheses("()())()");

'()() ) ()'
'( () ) ()'
'()(  ) ()'
'()()   ()'

// Example 1:
// Input: "()())()"
// Output: ["()()()", "(())()"]

// Example 2:
// Input: "(a)())()"
// Output: ["(a)()()", "(a())()"]

// Example 3:
// Input: ")("
// Output: [""]
