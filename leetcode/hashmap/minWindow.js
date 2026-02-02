/*
输入: s = "ADOBECODEBANC", t = "ABC"
输出: "BANC"
*/

/**
 * @description 最小窗口子串, 滑动窗口 + 两个哈希表
 */

var minWindow = function(s, t) {
    if (!s || !t) {
        return "";
    }

    var dictT = {}; // 目标字符的计数
    var required = 0; // 需要匹配的不同字符数
    var windowCounts = {}; // 当前窗口的字符计数

    // 滑动窗口
    var start = 0;
    var formed = 0; // 当前窗口中已满足条件的字符种类数
    var ans = [Infinity, null, null]; // 结果：(窗口长度, 左边界, 右边界)

    for (var end = 0; end < s.length; end++) {
        var char = s[end];
        // 扩展窗口：加入新字符
        windowCounts[char] = windowCounts.get(char, 0) + 1;
        
        if (dictT[char] && windowCounts[char] === dictT[char]) {
            // 检查这个字符是否满足条件
            formed++;
        }

        while (formed === required) {
            // 更新结果
            if (end - start + 1 < ans[0]) {
                ans = [end - start + 1, start, end];
            }
        }
    }

    return ans[0] === Infinity ? "" : s.substring(ans[1], ans[2] + 1);
}
    for end, char in enumerate(s):
        # 扩展窗口：加入新字符
        window_counts[char] = window_counts.get(char, 0) + 1
        
        # 检查这个字符是否满足条件
        if char in dict_t and window_counts[char] == dict_t[char]:
            formed += 1
        
        # 收缩窗口：尝试缩小窗口
        while formed == required:
            # 更新结果
            if end - start + 1 < ans[0]:
                ans = (end - start + 1, start, end)
            
            # 移除左边字符
            left_char = s[start]
            window_counts[left_char] -= 1
            
            if left_char in dict_t and window_counts[left_char] < dict_t[left_char]:
                formed -= 1
            
            start += 1
    
    return "" if ans[0] == float("inf") else s[ans[1]:ans[2] + 1]
