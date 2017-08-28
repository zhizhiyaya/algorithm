/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @method 给出前序和中序 构建二叉树
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
	if (!preorder.length) {
		return null;
	}
	var root = new TreeNode(preorder[0]);

	subChildTree(root, preorder, inorder);
	return root;
};

var subChildTree = function(root, preorder, inorder) {

	// 确定左右子树的长度
	var rootIndex = inorder.indexOf(root.val);

	preInorder = inorder.slice(0, rootIndex);
	nextInorder = inorder.slice(rootIndex + 1);
	// 依靠中序分割的子树的长度分割前序
	prePreorder = preorder.slice(1, preInorder.length + 1);
	nextPreorder = preorder.slice(preInorder.length + 1);

	if (prePreorder && prePreorder.length > 0) {
		root.left = new TreeNode(prePreorder[0]);
		subChildTree(root.left, prePreorder, preInorder);
	} else {
		root.left = null;
	}
	if (nextPreorder && nextPreorder.length > 0) {
		root.right = new TreeNode(nextPreorder[0]);
		subChildTree(root.right, nextPreorder, nextInorder);
	} else {
		root.right = null;
	}
};

// 假设树的先序遍历是 12453687，中序遍历是 425 1 6837。
// 先序遍历可以提供根的所在，而根据中序遍历的性质知道根的所在就可以将序列分为左右子树。
// 比如上述例子，我们知道1是根，所以根据中序遍历的结果425是左子树，而6837就是右子树。
// 接下来根据切出来的左右子树的长度又可以在先序便利中确定左右子树对应的子序列（先序遍历也是先左子树后右子树）。
// 根据这个流程，左子树的先序遍历和中序遍历分别是 245 和 425 ，右子树的先序遍历和中序遍历则是3687和6837，
// 我们重复以上方法，可以继续找到根和左右子树，直到剩下一个元素。
// 可以看出这是一个比较明显的递归过程，对于寻找根所对应的下标，我们可以先建立一个HashMap，以免后面需要进行线行搜索，
// 这样每次递归中就只需要常量操作就可以完成对根的确定和左右子树的分割。
