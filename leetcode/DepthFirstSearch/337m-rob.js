/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @desc   间隔的数据和最大
     3
    / \
   2   3
    \   \
     3   1
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function(root) {
    if (root == null) return 0;

    var val = 0;

    if (root.left) {
        val += rob(root.left.left) + rob(root.left.right);
    }

    if (root.right) {
        val += rob(root.right.left) + rob(root.right.right);
    }

    return Math.max(val + root.val, rob(root.left) + rob(root.right));
};
