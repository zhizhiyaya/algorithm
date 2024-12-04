/**
 * @method 查找最长回文，有3种方法，1.中心扩散法，2.动态规划，3.Manacher算法
 * @param {string} s
 * @return {string}
 */

/**
 * 中心扩散法
 * T = O(n^2)
 * S = O(1)
 */
function longestPalindrome(str) {
	function expandAroundCenter(str, left, right) {
		while (left >= 0 && right < str.length && str[left] === str[right]) {
			left--;
			right++;
		}
		return right - left - 1;
	}
	let start = 0, end = 0;
    for (let i = 0; i < str.length; i++) {
		const len1 = expandAroundCenter(str, i, i); // 以i为中心点，向两边扩散
		const len2 = expandAroundCenter(str, i, i + 1); // 以i和i+1为中心点，向两边扩散
		const maxLen = Math.max(len1, len2);
		// 如果找到更长的回文子串，更新起始和结束索引
        if (maxLen > end - start) {
            start = i - Math.floor((maxLen - 1) / 2);
            end = i + Math.floor(maxLen / 2);
        }
	}
	return s.substring(start, end + 1);
}

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

/**
 * 动归
 * 如果 s[i] === s[j] 并且 s[i+1:j-1] 是回文，则 s[i:j] 也是回文，
 * 这部分也是中心扩展，小子串s[i+1:j-1]是回文，那向外扩展 若s[i] === s[j]，则s[i:j]也是回文
 * T = O(n²)，双层循环遍历所有子串。
 * S = O(n²)，因为使用了二维数组 dp。
 */
var longestPalindrome = function longestPalindromicSubstringDP(s) {
    const n = s.length;
    if (n < 2) return s;

    let start = 0, maxLength = 1;
    const dp = Array.from({ length: n }, () => Array(n).fill(false));

    // 单个字符的回文情况
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // 填充 dp 表格
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < j; i++) {
            if (s[i] === s[j]) {
                if (j - i === 1 || dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (j - i + 1 > maxLength) {
                        start = i;
                        maxLength = j - i + 1;
                    }
                }
            }
        }
    }

    return s.substring(start, start + maxLength);
}

/**
 * Manacher算法，复杂度 O(n)
 * 它通过将奇偶长度的回文统一为奇数长度（插入特殊字符 #），即 length * 2 + 1 必为奇数，
 * 并在扩展时利用先前计算的回文长度来减少计算。
 * T = O(n)，每个字符位置的回文半径可以在常数时间内确定
 * S = O(n)，需要数组 p 来存储每个位置的回文半径。
 */ 
var longestPalindrome = function longestPalindromicSubstringManacher(s) {
    // 预处理字符串
    let t = '#' + s.split('').join('#') + '#';
    const n = t.length;
    const p = Array(n).fill(0); // 回文半径数组
    let center = 0, right = 0; // 当前最右回文的中心和边界

    let maxLength = 0, start = 0;
    for (let i = 0; i < n; i++) {
        if (i < right) {
            p[i] = Math.min(right - i, p[2 * center - i]);
        }
        // 尝试扩展回文半径，以 i 为中心向两边扩展，是回文更新p[i]
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] === t[i - p[i] - 1]) {
            p[i]++;
        }
        // 更新当前最右回文的中心和边界
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
        // 更新最大回文子串的长度和起点
        if (p[i] > maxLength) {
            maxLength = p[i];
            start = (i - maxLength) / 2;
        }
    }
    
    return s.substring(start, start + maxLength);
}

console.log(longestPalindrome('abba'));
