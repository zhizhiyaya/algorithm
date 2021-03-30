// asd acsbd -> asd 3
// 两个字符串的最大相同子串
function maxSubStrLen(str1, str2) {
    var len1 = str1.length;
    var len2 = str2.length;
    // maxArr 0 行 0 列为初始化数据，1～len 为最大相同子串的长度
    var maxArr = new Array(len1 + 1);
    for(var i = 0; i <= len1; i++) {
        maxArr[i] = new Array(len2 + 1);
        maxArr[i][0] = 0;
    }
    for(var j = 0; j <= len2; j++) {
        maxArr[0][j] = 0;
    }
    for(var i = 1; i <= len1; i++) {
        for(var j = 1; j <= len2; j++) {debugger
            if (str1[i - 1] === str2[j - 1]) {
                // maxArr 0 行 0 列为初始化数据，1～len 为最大相同子串的长度
                // 所以 maxArr[i][j] 记录的是 str1[i - 1] === str2[j - 1] 的substrlen
                maxArr[i][j] = maxArr[i - 1][j - 1] + 1;
            } else {
                maxArr[i][j] = Math.max(maxArr[i - 1][j], maxArr[i][j - 1]);
            }
        }
    }
    return maxArr[len1][len2];
}
