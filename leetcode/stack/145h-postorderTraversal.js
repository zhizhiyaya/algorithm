/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @desc 后序遍历 （左右根）
 * 后序递归
 */
var postorderTraversal = function(root) {
    var ret = [];
    _postorderTraversal(root, ret);
    return ret;
};
function _postorderTraversal(root, ret) {
    if (root) {
        _postorderTraversal(root.left, ret);
        _postorderTraversal(root.right, ret);
        ret.push(root.val);
    }
}

/**
 * @desc 后序遍历 （左右根）
 * 后序非递归
 * 1. 栈s初始化;
 * 2. 循环直到root为空且栈s为空
 *    2.1 当root非空时循环
 *       2.1.1 将root连同标志flag=1 入栈;
 *       2.1.2 继续遍历root的左子树;
 *    2.2 当栈s非空，且栈顶元素被访问过右子树（标志为2） 时,出栈并输出栈顶结点;
 *    2.3 若栈非空,将栈顶元素的标志改为2,准备遍历栈顶结点的 右子树
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    var ret = [];
    if(root) {
        let stack = [];
        let flagStack = [];
        while(root || stack.length) {

            while (root) { // 直到无左子树
                flagStack.push(1);
                stack.push(root);
                if (root.left) {
                    root = root.left;
                } else {
                    break;
                }
            }

            // 遍历父节点，以当前节点为根的二叉树的后序的最后一个节点
            if (stack.length && flagStack[flagStack.length - 1] === 2) {
                root = stack.pop();
                flagStack.pop();
                ret.push(root.val);
                root = stack[stack.length - 1];
            }

            if (stack.length) {
                // 设置标记 为 遍历该子树的右子树
                flagStack[flagStack.length - 1] = 2;
                if (root.right) {
                    root = root.right;
                }
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
// Output: [3,2,1]
