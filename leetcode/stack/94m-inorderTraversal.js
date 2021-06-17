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

var root = {
	val: 1,
	left: {
		val: 2,
		left: {
			val: 3,
		},
		right: {
			val: 4,
		}
	},
	right: {
		val: 5,
		right: {
			val: 6,
		}
	}
};
inorderTraversal(root)
//      1
//     / \
//    2   5
//   / \   \
//  3   4   6
