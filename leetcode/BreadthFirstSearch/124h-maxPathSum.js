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

var maxValue = −9007199254740992;

var max = function(a, b) {
	return a > b ? a : b;
}

var maxPathDown = function(node) {
    if (node == null) return 0;
    var left = max(0, maxPathDown(node.left));
    var right = max(0, maxPathDown(node.right));
    maxValue = max(maxValue, left + right + node.val);
    return max(left, right) + node.val;
}

var maxPathSum = function(root) {
    maxPathDown(root);
    return maxValue;
};
