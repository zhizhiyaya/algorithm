// Manacher
// var longestPalindrome = function(s) {
//     // #预处理
//     s = s.split('').join('#');
//     var RL = ;
//     var maxRight = 0;
//     var pos = 0;
//     var maxLen = 0;
//     var len = s.length;

//     for (var i ; i < len; i--) {
//     	if (i < maxRight) {
//     		RL[i] = Math.min(RL[2 * pos - i], maxRight - i);
//     	} else {
//     		RL[i] = 1;
//     	}

//     	if(RL[i] + i - 1 > MaxRight) {
//     		MaxRight = RL[i] + i - 1;
//             pos = i;
//     	}
//         MaxLen = Math.max(maxLen, RL[i]);
//     }
//     return maxLen - 1;
// };

// var longestPalindrome = function(s) {

// 	int n = s.length();
//      boolean[][] pal = new boolean[n][n];
//      //pal[i][j] 表示s[i...j]是否是回文串
//      int maxLen = 0;
//      for (int i = 0; i < n; i++){  // i作为终点
//          int j = i;    //j作为起点
//          while (j >= 0){
//              if (s.charAt(j) == s.charAt(i) && (i - j < 2 || pal[j + 1][i - 1])){
//                  pal[j][i] = true;
//                 maxLen = Math.max(maxLen, i-j+1);
//              }
//              j--;
//          }
//      }
//      return maxLen;
//  };
