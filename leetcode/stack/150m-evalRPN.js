/** 逆波兰表示法: https://zh.wikipedia.org/wiki/%E9%80%86%E6%B3%A2%E5%85%B0%E8%A1%A8%E7%A4%BA%E6%B3%95
 *  在逆波兰记法中，所有操作符置于操作数的后面，不需要括号来标识操作符的优先级，因此也被称为后缀表示法。 
 */
/**
 * @desc 从前往后遍历数组，遇到数字则压入栈中，遇到符号，则把栈顶的两个数字拿出来运算，把结果再压入栈中，
 *       直到遍历完整个数组，栈顶数字即为最终答案
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    var stack = [];
    for (var i = 0; i < tokens.length; i++) {
        if (isNaN(+tokens[i])) {
            var secondNum = stack.pop();
            var firstNum = stack.pop();
            var result = 0;
            switch (tokens[i]) {
                case '+':
                    result = firstNum + secondNum;
                    break;
                case '-':
                    result = firstNum - secondNum;
                    break;
                case '*':
                    result = firstNum * secondNum;
                    break;
                case '/':
                    result = firstNum / secondNum;
                    break;
            }
            if (result < 0) {
                result = Math.ceil(result);
            } else {
                result = Math.floor(result);
            }
            stack.push(result);
        } else {
            stack.push(+tokens[i]);
        }
    }
    if (stack.length > 1) {
        return 0;
    }
    return stack[0];
};


// Input: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
// Output: 22
// "10", "6", "9", "3", "+"
// "10", "6", "12", 
// "10", "6", "12", "-11", "*"
// "10", "6", "-132"
// "10", "6", "-132", "/"
// "10", "0",
// "10", "0", "17", "+"
.......

// Explanation:
//   ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
// = ((10 * (6 / (12 * -11))) + 17) + 5
// = ((10 * (6 / -132)) + 17) + 5
// = ((10 * 0) + 17) + 5
// = (0 + 17) + 5
// = 17 + 5
// = 22
