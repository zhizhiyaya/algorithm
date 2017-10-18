/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumNumbers = function(root) {
	return sum(root, 0);
};

function sum(n, s){
	if (n == null) return 0;
	if (n.right == null && n.left == null) return s*10 + n.val;
	return sum(n.left, s*10 + n.val) + sum(n.right, s*10 + n.val);
}

//    1
//   / \
//  2   3
// The root-to-leaf path 1->2 represents the number 12.
// The root-to-leaf path 1->3 represents the number 13.
//
// Return the sum = 12 + 13 = 25.

// [1,2,3,2,null,3]
// 	   1
//   2   3
// 2    3
//
//  122 + 133 = 255

// [1,2,3,2,null,3]
// 	   1
//   2   3
// 2    3  1
//
//  122 + 133 + 131 = 386

// [1,2,3,2,null,3]
// 	   1
//   2   3
// 2    3  1
//			1
//  122 + 133 + 131 = 386

// [1,2,3,2,null,3,1, null, null, null,null, null,1]
// 	   1
//   2   3
// 2    3  1
//			1
// 122 + 133 => 255 + 1311 = 1566
