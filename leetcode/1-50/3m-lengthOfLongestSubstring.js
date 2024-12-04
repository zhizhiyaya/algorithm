/** Best
 * @method 查找最长不重复字符的字符串
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
	var hashMap = {};
	var ans = 0;
	for (var end = 0, start = 0; end < s.length; end++) {
		var alpha = s.charAt(end);
		if (hashMap[alpha] > -1) {
			start = Math.max(hashMap[alpha], start);
		}
		ans = Math.max(ans, end - start + 1);
		hashMap[alpha] = end + 1;
	}
	return ans;
}

var lengthOfLongestSubstring = function(s) {
	var len = s.length;
	if (len === 0 || len === 1) {
		return len;
	} 

	var charsArr = [''];
	var r = 0;
	var arr = s.split(''); // 将字符串拆分为数组
	var index = -1;
	var subLen = 0;
	for (var i = 0; i < len; i++) {
		index = charsArr[r].lastIndexOf(arr[i]);
		if (index === -1) {
			charsArr[r] += arr[i];
		} else {
			charsArr.push(charsArr[r].substring(index + 1) + arr[i]);
		} 	
		r = charsArr.length - 1;
		if (charsArr[r].length > subLen) {
			subLen = charsArr[r].length;
		}
	}
	return subLen;
};


// TLE 了
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {debugger
	var maxStr = '';
	var i = 0;
	while(i < s.length) {
		var curStr = s[i];
		i++;
		var subStrArr = s.substring(i).split('');
		while (subStrArr.length) {
			if (curStr.indexOf(subStrArr[0]) === -1) {
				curStr += subStrArr.splice(0, 1).join('');
			} else {
				break;
			}
		}
		maxStr = maxStr.length >= curStr.length ? maxStr : curStr;
	}
	return maxStr.length;
};

console.log(lengthOfLongestSubstring('abcabcbb'));
console.log(lengthOfLongestSubstring('bbbbb'));
console.log(lengthOfLongestSubstring('pwwkew'));
console.log(lengthOfLongestSubstring('aab'));
console.log(lengthOfLongestSubstring('dvdf'));
console.log(lengthOfLongestSubstring('ohvhjdml'));
