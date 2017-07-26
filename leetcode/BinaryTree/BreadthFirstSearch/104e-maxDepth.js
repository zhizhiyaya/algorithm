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

var maxDepth = function(root) {
	if(root) {
		return 0;
	}
    var depth = 0;
    var stack = [];
    stack.push(root);
    while(stack.length) {
		depth++;
		for(var i = 0, n = stack.length; i < n; i++) {
			root = stack.pop();
			if (root.left) {
				stack.push(root.left);
			}
			if (root.right) {
				stack.push(root.right);
			}
		}
	}
    return depth;
}

var maxDepth = function(root) {
	let curDepth = 0;
	let depth = 0;
	if(root) {
		let stack = [];
		let flagStack = [];
		while(root || stack.length) {

			while (root && !root.flag) { // 直到无左子树
				// root.flag = 1;
				flagStack.push(1);
				stack.push(root);
				curDepth++;
				if (root.left) {
					root = root.left;
				} else {
					break;
				}
			}
			if (depth < curDepth) {
				depth = curDepth;
			}
			// 遍历父节点，以当前节点为根的二叉树的后序的最后一个节点
			if (stack.length && flagStack[flagStack.length - 1] === 2) {
				root = stack.pop();
				flagStack.pop();
				curDepth--;
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
	return depth;
};
