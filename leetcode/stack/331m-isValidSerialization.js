/**
 * @desc
 * @param {string} preorder
 * @return {boolean}
 */
var isValidSerialization = function(preorder) {
    var arr = preorder.split(",");
    var diff = 1;
    for (var i = 0; i < arr.length; i++) {
        if (--diff < 0) return false;
        if (arr[i] !== '#') diff +=2;
    }
    return !diff;
};

//      _9_
//     /   \
//    3     2
//   / \   / \
//  4   1  #  6
// / \ / \   / \
// # # # #   # #
// Input: "9,3,4,#,#,1,#,#,2,#,6,#,#"
// Output: true

// Input: "1,#"
// Output: false

// Input: "9,#,#,1"
// Output: false
