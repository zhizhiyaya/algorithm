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
var minDepth = function(root) {
	if (!root) {
		return 0;
	}
	let queue = [];
	queue.push(root);
	let depth = 0;
	while (queue.length) {
		depth++;
		root = queue.shift();
		if (!root.left && !root.right) {
			return depth;
		}
		root.left && queue.push(root.left);
		root.right && queue.push(root.right);
	}
	return depth;
};
