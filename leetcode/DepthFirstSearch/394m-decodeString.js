/**
 * 	s = "3[a]2[bc]", return "aaabcbc".
 * 	s = "3[a2[c]]", return "accaccacc".
 * 	s = "2[abc]3[cd]ef", return "abcabccdcdcdef".
 **/
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
	var str = '';
	var stack = [];
	for (var i = 0; i < s.length; i++) {
		if (s[i] === ']') {
			var j = stack.length - 1;
			var curStr = '';
			while (j >= 0 && stack[j] !== '[') {
				curStr = stack[j] + curStr;
				j--;
			}
			j--; // ［
			var n = '';
			while (isNumber(stack[j])) {
				n = stack[j] + n;
				j--;
			}
			if (n > 0) {
				curStr = powStr(curStr, n);
			}

			if (stack.length > 0) {
				stack.splice(j + 1);
				stack.push(curStr);
				curStr = '';
			} else {
				str += curStr;
				stack = [];
			}
		} else {
			stack.push(s[i]);
		}
	}
	if (stack.length > 0) {
		str += stack.join('');
	}
	return str;
};

function powStr(str, n) {
	if (n == 0) {
		return '';
	}
	if (n == 1) {
		return str;
	}
	if (n < 0) {
		n = -n;
	}
	return (n % 2 == 0) ? powStr(str + str , n / 2) : str + powStr( str + str, (n - 1) / 2);
}

function isNumber(num) {
	var n = Number(num);
	// NaN !== NaN
	return n === n;
}

console.log(decodeString('10[le]'));
console.log(decodeString('2[le3[et]]'));
