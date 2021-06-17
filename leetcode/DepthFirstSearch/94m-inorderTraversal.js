/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @method 中序遍历（左根右）
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    var stack = [];
    var ret = [];
    while (root || stack.length > 0) {
        if(root) {
            stack.push(root);
            root = root.left;
        } else {
            root = stack.pop();
            ret.push(root.val);
            root = root.right;
        }
    }
    return ret;
};


//      1
//     / \
//    2   5
//   / \   \
//  3   4   6