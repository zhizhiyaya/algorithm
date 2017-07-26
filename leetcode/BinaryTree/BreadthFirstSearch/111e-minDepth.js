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
	let curLevelNodeSum = 1;
	let childSum = 0;
	while (queue.length) {
		depth++;
        childSum = 0;
		for (var i = curLevelNodeSum.length; i > 0; i--) {
			root = queue.shift();
			if (!root.left || !root.right) {
				return depth + 1;
			}
			if (root.left) {
				childSum++;
				queue.push(root.left);
			}
			if (root.right) {
				childSum++;
				queue.push(root.right);
			}
		}

		curLevelNodeSum = childSum;
	}
	return depth;
};
