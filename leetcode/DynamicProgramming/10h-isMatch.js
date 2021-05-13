/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
/**
 * 1. p[j]  ===  s[i]:　　dp[i][j] = dp[i-1][j-1]

 * 2. p[j]  ===  ".":　　 dp[i][j] = dp[i-1][j-1]

 * 3. p[j]  === "*":
 * 　　3.1 p[j-1]  !==  s[i]:　　dp[i][j] = dp[i][j-2]
 * 　　3.2 p[i-1]  ===  s[i] or p[i-1]  ===  ".":
 * 　　　　dp[i][j] = dp[i-1][j] // 多个a的情况
 * 　　　　or dp[i][j] = dp[i][j-1] // 单个a的情况
 * 　　　　or dp[i][j] = dp[i][j-2] // 没有a的情况} s 
 */
 var isMatch = function(s, p) {
    if (s === p) {
        return true;    
    }
    if (!s && !p) {
        return false;
    }

    var ls = s.length;
    var lp = p.length;
    var dp = new Array(ls + 1);
    for (var i = 0; i <= ls; i++) {
        dp[i] = new Array(lp + 1);
        for (var j = 0; j <= lp; j++) {
            dp[i][j] = false;
        }
    }
    dp[0][0] = true;
    for (var i = 0; i < lp; i++) {
        if (p[i] == '*' && dp[0][i-1]) {
            dp[0][i+1] = true;
        }
    }
    for (var i = 0 ; i < ls; i++) {
        for (var j = 0; j < lp; j++) {
            if (p[j] == '.' || p[j] == s[i]) {
                dp[i+1][j+1] = dp[i][j];
            }
            /**
             *    3.1 p[j-1]  !==  s[i]:　　dp[i][j] = dp[i][j-2]
             * 　　3.2 p[j-1]  ===  s[i] or p[j-1]  ===  ".":
             * 　　　　dp[i][j] = dp[i-1][j] // 多个a的情况
             * 　　　　or dp[i][j] = dp[i][j-1] // 单个a的情况
             * 　　　　or dp[i][j] = dp[i][j-2] // 没有a的情况} s             
             */
            if (p[j] == '*') {
                if (p[j-1] != s[i] && p[j-1] != '.') {
                    dp[i+1][j+1] = dp[i+1][j-1];
                } else {
                    dp[i+1][j+1] = (dp[i+1][j] || dp[i][j+1] || dp[i+1][j-1]);
                }
            }
        }
    }
    return dp[ls][lp];
};
