/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @method  Inorder and Postorder , 中序 和 后序 构建二叉树
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
	if (!inorder.length) {
		return null;
	}
	var root = new TreeNode(postorder[postorder.length - 1]);

	subChildTree(root, inorder, postorder);
	return root;
};

// 			  1
// 		2			        3
// 4		5          6		7
// 				    	 8
// 假设树的中序遍历是 425 1 6837，后序是 452 8673 1
// 后序遍历可以提供根的所在，而根据中序遍历的性质知道根的所在就可以将序列分为左右子树。
// 同理 105， 前序中序构建二叉树

var root = {val: 1};
var inorder = [2, 1, 3];
var postorder=[2, 3, 1];

var subChildTree = function(root, inorder, postorder) {
	subLeftChildTree(root, inorder, postorder);
	subRightChildTree(root, inorder, postorder);
};
function subLeftChildTree(root, inorder, postorder) {
	// 确定左右子树的长度
	var rootIndex = inorder.indexOf(root.val);
	// 依靠中序分割的子树的长度分割前序
	leftInorder = inorder.slice(0, rootIndex);
	leftPostorder = postorder.slice(0, rootIndex);
	// console.log(rootIndex, leftInorder, leftPostorder);

	if (leftPostorder.length > 0) {
		root.left = new TreeNode(leftPostorder[leftPostorder.length - 1]);
		// root.left = {val: leftPostorder[leftPostorder.length - 1]};
		if (leftPostorder.length > 1) {
			subChildTree(root.left, leftInorder, leftPostorder);
		}
	}
}

function subRightChildTree(root, inorder, postorder) {
	var rootIndex = inorder.indexOf(root.val);
	rightInorder = inorder.slice(rootIndex + 1);
	rightPostorder = postorder.slice(rootIndex, postorder.length - 1);
	// console.log(rootIndex, rightInorder, rightPostorder);
	if (rightPostorder.length > 0) {
		root.right = new TreeNode(rightPostorder[rightPostorder.length - 1]);
		// root.right = {val: rightPostorder[rightPostorder.length - 1]};
		if (rightPostorder.length > 1) {
			subChildTree(root.right, rightInorder, rightPostorder);
		}
	}
}
subChildTree(root, inorder, postorder)
