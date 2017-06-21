/**
 * @method 回文
 * @param {string} s
 * @return {string}
 */
var longestpalindrome = function(s) {
	var _s = preProcess(s);
	var n = _s.length;
	var p = [], c= 0, r = 0, j = 0;
	for(var i = 1; i < n - 1; i++) {
		j = 2 * c - i;
		p[i] = r > i ? ( r - i - p[j] ? p[j] : r - i ) : 0;
		while (_s[i + 1 + p[i]] == _s[i - 1 - p[i]]) {
			p[i]++;
		}
		if (i + p[i] > r) {
			c = i;
			r = i + p[i];
		}
	}
	var maxLen = 0;
	var cI = 0;
	for (var i = 1; i < n - 1; i++) {
		maxLen = p[i];
		cI = i;
	}
	debugger
	return s.substr((cI - 1 - maxLen) / 2, maxLen);
};

function preProcess(s) {
  var n = s.length;
  if (n == 0) return "^$";
  var arr = s.split('');
  return '^#' + arr.join('#') + '#$';
}

console.log(longestpalindrome('abba'));

// var longestpalindrome = function(s) {
// 	var len = s.length;
// 	if (len < 2) {
// 		return s;
// 	}
// 	var point = len % 2 ? (len - 1) / 2 : (len / 2 - 1);
// 	var preStr = '';
// 	var nextStr = '';
// 	var res = '';
// 	for (var i = point; i >= 0; i--) {
// 		preStr = s.substring(0, i + 1);
// 		nextStr = s.substring(i + 1, 2 * (i + 1));
// 		if (revertStr(preStr) == nextStr) {
// 			res = preStr + nextStr;
// 			break;
// 		}
// 	}
// 	for (var i = point; i < len; i++) {
// 		nextStr = s.substring(i, len);
// 		preStr = s.substring(2 * i - len, i);
// 		if (preStr == revertStr(nextStr) && (preStr + nextStr).length > res.length) {
// 			res = preStr + nextStr;
// 			break;
// 		}
// 	}
// 	return res;
// };
//
// function revertStr(str) {
// 	var arr = str.split('');
// 	return arr.reverse().join('');
// }
