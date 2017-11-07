/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
 	var ret = [];

 	if (root) {
 		addPathVal(root, '', ret);
 	}
 	return ret;

 	function addPathVal(node, path, arr) {
		if (!node.left && !node.right) {
			arr.push(path + node.val);
		}

		if (node.left) {
			addPathVal(node.left, path + node.val + '->', arr);
		}
		if (node.right) {
			addPathVal(node.right, path + node.val + '->', arr);
		}
 	}
 };
