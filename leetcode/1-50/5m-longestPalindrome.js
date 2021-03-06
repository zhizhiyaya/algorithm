/**
 * @method 查找最长回文
 * @param {string} s
 * @return {string}
 */

// 暴力遍历, TLE， O(n^3)
var longestPalindrome = function(s) {
	var len = s.length;
	var retStr = '';
	for (var i = 0; i < len; i++) {
		for (var j = i; j < len; j++) {
			if (shrinkCheckPalindrome(s, i, j)) {
				if (j - i + 1 > retStr.length) {
					retStr = s.substring(i, j + 1);
				}
			}
		}
	}
	return retStr;

	function shrinkCheckPalindrome(s, l, r) {
		while (l <= r) {
			if (s[l] === s[r]) {
				l++;
				r--;
			} else {
				return false;
			}
		}
		return true;
	}
};

/**
 * @desc 从中心点向外扩散，复杂度 O(n^2),
 * 			中心点需 注意，以当前字符为中心时，是奇数长，
 * 			还需以当前字符为中心的一半，处理偶数长
 **/

var longestPalindrome = function(s) {
	var len = s.length;
	var retStr = '';
	// 以每个字符为中心遍历
	for (var i = 0; i < len; i++) {
		// 每次处理奇数长
		getLongestPalindrome(s, i, i);
		// 每次处理偶数长
		getLongestPalindrome(s, i, i + 1);
	}
	return retStr;

	function getLongestPalindrome(s, l, r) {
		while (l > -1 && r < len && s[l] === s[r]) {
			if (r- l + 1 > retStr.length) {
				retStr = s.substring(l, r + 1);
			}
			l--;
			r++;
		}
	}
};


function preProcess(s) {
  var n = s.length;
  if (n == 0) return "^$";
  var arr = s.split('');
  return '^#' + arr.join('#') + '#$';
}

// Manacher算法，复杂度 O(n)
// 实现 -> 作者：Eason_Wong, 链接：https://www.jianshu.com/p/bc80a10af8f5
var longestPalindrome = function(s) {
	if (s.length < 2) {
       return s;
    }
    let str = '#' + s.split('').join('#') + '#'
    let rl = []
    let mx = 0
    let pos = 0
    let ml = 0
    for (let i = 0; i < str.length; i++){
        if (i < mx) {
            rl[i] = Math.min(rl[2 * pos - i], mx - i)
        } else {
            rl[i] = 1
        }
        while (i - rl[i] > 0 && i + rl[i] < str.length && str[i - rl[i]] == str[i + rl[i]]) {
            rl[i]++
        }
        if (rl[i] + i - 1 > mx) {
            mx = rl[i] + i - 1
            pos = i
        }
        if (ml < rl[i]) {
            ml = rl[i]
            sub = str.substring(i - rl[i]+1, i + rl[i])
        }
    }
    return sub.split('#').join('').trim()
}

console.log(longestPalindrome('abba'));
