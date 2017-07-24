/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @method 中序遍历 BST 必有序，后遍历的一定要比前一个大
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
	if(root) {
		let valArr = [];
		let stack = [];
		while(root || stack.length) {
			while (root) {
				stack.push(root);
				root = root.left;
			}
			if (stack.length) {
				root = stack.pop();
				if (valArr.length === 0 || root.val > valArr[valArr.length - 1]){
					valArr.push(root.val);
				} else {
					return false;
				}
				root = root.right;
			}
		}
	}
	return true;
};
