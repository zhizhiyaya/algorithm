/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    if (t.length > s.length || s === '' || t === '') return '';

    // 初始化 `need` 和 `window` 字典
    const need = {};
    const window = {};
    for (let char of t) {
        need[char] = (need[char] || 0) + 1;
        window[char] = 0;
    }

    // `required` 是 `t` 中不同字符的数量
    const required = Object.keys(need).length;

    // 左右指针和 `formed` 变量
    let left = 0, right = 0, formed = 0;
    let minLength = Infinity, ans = [-1, -1];

    while (right < s.length) {
        const char = s[right];
        
        // 更新窗口中的字符频率
        if (char in window) {
            window[char]++;
            // 如果当前字符的数量达到了 `need` 中的需求量，则增加 `formed`
            if (window[char] === need[char]) {
                formed++;
            }
        }

        // 当 `formed` 等于 `required` 时，尝试收缩窗口
        while (left <= right && formed === required) {
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                ans = [left, right];
            }

            // 移除 `s[left]` 并收缩窗口
            const leftChar = s[left];
            if (leftChar in window) {
                window[leftChar]--;
                // 如果某个字符的数量不再满足 `need`，则减少 `formed`
                if (window[leftChar] < need[leftChar]) {
                    formed--;
                }
            }

            left++;
        }

        // 扩展右指针
        right++;
    }

    // 如果没有找到有效的窗口，则返回空字符串
    return ans[0] === -1 ? '' : s.substring(ans[0], ans[1] + 1);
}

var minWindow = function(s, t) {
    if (t.length > s.length || s === '' || t === '') return '';
    if (t.length === s.length && t === s) return s;

    var tArr = t.split('');
    var window = {}; // 记录当前窗口内的字符出现次数
    var need = tArr.reduce((r, i) => {
        r[i] = (r[i]+1 || 1); // 记录 t 中每个字符的需求量
        return r;
    }, {});
	var ans = '';
	for (var right = t.length, left = 0; right <= s.length; right++) {
		var substr = s.substring(left, right);
        window = {...need};
        substr.split('').forEach(c => {
            window[c] -= 1;
        });
        var match = tArr.every(c => window[c] <= 0);
        // substr 包含了 t,开始收缩窗口
        while (left < right && match) {
            ans = ans && ans.length <= substr.length ? ans : substr;
            var leftChar = s[left];
            window[leftChar] += 1; // 把当前left的字符撇了
            if (need[leftChar] && window[leftChar] > 0) { // 撇了后不能包含t了
                match = false;
                left++;
            } else {// 撇了后还包含t
                left++;
                substr = s.substring(left, right);
                ans = ans && ans.length <= substr.length ? ans : substr;
            }
        }
	}
	return ans;
};

// 记录字符需求: 使用哈希表 need 记录 t 中每个字符的需求量，window 记录当前窗口内的字符出现次数。

// 定义滑动窗口: 使用两个指针 left 和 right，分别表示窗口的左右边界。right 用于扩展窗口，left 用于收缩窗口。

// 扩展窗口:
// 每次将 right 向右移动，增大窗口。
// 更新窗口中当前字符的出现次数。
// 如果窗口内该字符的数量满足 need 中的数量，更新 valid 值。

// 收缩窗口:
// 当 valid 值等于 t 的长度时，说明窗口已经满足条件。
// 尝试收缩窗口，将 left 向右移动，寻找更小的符合条件的窗口。
// 在收缩过程中更新最小窗口的起始位置和长度。
// 返回结果: 最后根据记录的最小窗口长度和起始位置返回结果。
