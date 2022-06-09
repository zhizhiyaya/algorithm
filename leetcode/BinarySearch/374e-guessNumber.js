/** 
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	     -1 if num is higher than the picked number
 *			      1 if num is lower than the picked number
 *               otherwise return 0
var guess = function(num) {
    if (num == pick) return 0;
    if (num > pick) return -1;
    if (num < pick) return 1;
}
 */

/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
    var l = 1;
    var r = n;
    var m;
    while(l <= r){
        m = l + parseInt((r - l) / 2);
        if (m === l) {
            break;
        }
        if(guess(m) == 1) {
            l = m + 1;
        } else if (guess(m) == -1 ) {
            r = m - 1;
        } else {
            return m;
        }
    }
    return -1;    
};



