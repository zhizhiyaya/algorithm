/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
	while (root) {
		if (root.left && root.left.val > root.val) {
			return false;
		}
		if (root.right && root.right.val < root.val) {
			return false;
		}
		root = root.left;

	}
};
