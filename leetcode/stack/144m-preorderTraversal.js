/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @desc 前序遍历 (根左右)
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    var ret = [];
    if(root) {
        var stack = [];
        while(root || stack.length) {
            while (root) {
                ret.push(root.val);
                stack.push(root);
                root = root.left;
            }
            if (stack.length) {
                root = stack.pop();
                root = root.right;
            }
        }
    }
    return ret;
};

// Input: [1,null,2,3]
//    1
//     \
//      2
//     /
//    3
//
// Output: [1,2,3]
