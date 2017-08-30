/**
 * 平衡二叉树
 * 如果子树高度差大于1，则不平衡
 * 采用分治法，
 * 以中间元素为根，左部为 左子树，右部 为右子树
 * 依次递归
 **/

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var nums = [1, 3];
var sortedArrayToBST = function(nums) {
	if (nums.length <= 0) {
		return null;
	}
	return subChildTree(nums, 0, nums.length - 1);
};

var subChildTree = function (nums, start, end) {
	if (start > end) return null;
	var mid = parseInt(start + (end - start) / 2);
	const root = new TreeNode(nums[mid]);
	// const root = {val: nums[mid]};
	root.left = subChildTree(nums, start, mid - 1);
	root.right = subChildTree(nums, mid + 1, end);
	return root;
}
sortedArrayToBST(nums);

// function isBalanced(root) {
//     if(root == null) //基本情况，为空的话，返回true
//         return true;
//
//     var left = depth(root.mLeft);
//     var right = depth(root.mRight);
//     var diff = left - right; //计算左右子树深度之差
//     if(diff > 1 || diff < -1) //如果深度之差大于1返回false
//         return false;
//
//     return isBalanced(root.mLeft) && isBalanced(root.mRight); //递归判断左右子树，注意是&&，即左右子树都必须是平衡的这棵二叉树才是平衡的
// }

// function depth(root) {
// 
// }
