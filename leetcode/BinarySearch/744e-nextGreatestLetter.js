/**
 * @desc 
 * @param {character[]} letters
 * @param {character} target
 * @return {character}
 */
 var nextGreatestLetter = function(letters, target) {
    var targetNum = target.charCodeAt();
    // const num = 97; // 'a' 的 ASCII 码值
    var l = 0;
    var r = letters.length - 1;
    var m = 0;
    var res = '';
    while(l <= r) {
        m = l + parseInt(l + (r - l) / 2);
        if (letters[m].charCodeAt() <= targetNum) {
            l = m + 1;
        } else {
            res = letters[m];
            r = m - 1;
        }
    }
    return res || letters[0];
};

// Example 1:
// Input: letters = ["c","f","j"], target = "a"
// Output: "c"

// Example 2:
// Input: letters = ["c","f","j"], target = "c"
// Output: "f"

// Example 3:
// Input: letters = ["c","f","j"], target = "d"
// Output: "f"