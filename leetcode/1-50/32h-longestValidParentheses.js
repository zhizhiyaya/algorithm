/**
 * 最长合法的 () , stack 存储合法（）前的索引
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
	var maxLength = 0;
	var stack = [-1];
	var length = s.length;
	for(var i = 0; i < length; i++) {
		switch(s[i]) {
			case '(':
				stack.push(i);
				break;
			case ')':
				stack.pop();
				var stackLength = stack.length;
				if (stackLength !== 0) {
					maxLength = max(maxLength, i - stack[stackLength - 1]);
				} else {
					stack.push(i);
				}
				break;
		}
	}
	return maxLength;
};
