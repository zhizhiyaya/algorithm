/**
 * @method 插空 （）看作一个整体
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
	var ret = [];
	var _a = []
	addChar('()', n);
	for (var i = _a.length - 1; i >= 0; i--) {
		for (var j = ret.length; j >= 0; j-- ) {
			if (_a[i] === ret[j]) {
				break;
			}
		}
		if (j < 0) {
			ret.push(_a[i]);
		}
	}
	return ret;
	function addChar(curChars) {

		if (curChars.length === 2 * n) {
			_a.push(curChars);
			return;
		} else {
			for (var i = 0; i < curChars.length; i ++) {
				if (curChars[i] === '('){
					// 左括号之前 和 之后加完整的括号
					addChar(curChars.slice(0, i) + '()' + curChars.slice(i));
					addChar(curChars.slice(0, i + 1) + '()' + curChars.slice(i + 1));
				}
			}
		}
	}
};

// 对于（）， 只有左右两侧
// （） （）， 有三个空
// （） （） （） 数值满了，不需要补空缺
