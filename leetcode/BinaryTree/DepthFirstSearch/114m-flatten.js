// 后序
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    var now = root;
	while (now) {
		if(now.left) {
			var pre = now.left;
			while(pre.right) {
				pre = pre.right;
			}
			pre.right = now.right;
			now.right = now.left;
			now.left = null;
		}
		now = now.right;
	}
};

// 1、
//      1
//     / \
//    2   5
//   / \   \
//  3   4   6

// 2、
//       1
//        \
//         2
//        / \
//       3   4
//            \
//             5
//              \
//               6

// 3、
//    1
//     \
//      2
//       \
//        3
//         \
//          4
//           \
//            5
//             \
//              6
