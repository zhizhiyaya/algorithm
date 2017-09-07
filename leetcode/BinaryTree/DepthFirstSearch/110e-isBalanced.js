/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
	if(!root)
		return true;
	var isBalanced = getHeight(root);
	if(isBalanced != -1)
		return true;
	else
		return false;
}


function getHeight(root) {
	if(!root)
		return 0;
	var leftHeight = getHeight(root.left);
	if(leftHeight == -1)
		return -1;
	var rightHeight = getHeight(root.right);
	if(rightHeight == -1)
		return -1;
	var diffHeight = rightHeight > leftHeight ? rightHeight - leftHeight : leftHeight - rightHeight;
	if(diffHeight > 1)
		return -1;
	else
		return diffHeight = (rightHeight > leftHeight ? rightHeight : leftHeight) + 1;
}
