/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @desc 其实只是 find bottom ，not left bottom......
 * @param {TreeNode} root
 * @return {number}
 */
var findBottomLeftValue = function (root) {
    var queue = [];
    queue.push(root);
    while (queue.length) {
        root = queue.shift();
        if (root.right) {
            queue.push(root.right);
        }
        if (root.left) {
            queue.push(root.left);
        }
    }
    return root.val;
};
//   2
// 1   3

//     1
//   2   3
// 4   5   6
//     7
