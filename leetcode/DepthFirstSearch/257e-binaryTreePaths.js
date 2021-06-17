/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
 	var ret = [];

 	if (root) {
 		addPathVal(root, '', ret);
 	}
 	return ret;

 	function addPathVal(node, path, arr) {
		//  叶子节点，将 path push 到结果 arr 中
		if (!node.left && !node.right) {
			arr.push(path + node.val);
		}

		if (node.left) {
			addPathVal(node.left, path + node.val + '->', arr);
		}
		if (node.right) {
			addPathVal(node.right, path + node.val + '->', arr);
		}
 	}
};
var binaryTreePaths = function(root) {
	if (!root) {
		return [];
	}
	var res = [];
	var stack = [{
		node: root,
		path: ''
	}];
	while (stack.length) {
		var { node, path } = stack.pop();
		if (!node.left && !node.right) {
			res.push(path + node.val);
		}
		if (node.right) {
			stack.push({ 
				node: node.right,
				path: path + node.val + '->'
			});
		}
		if (node.left) {
			stack.push({ 
				node: node.left,
				path: path + node.val + '->'
			});
		}
	}
	return res;
}

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
}
// Input:

//    1
//  /   \
// 2     3
//  \
//   5

// Output: ["1->2->5", "1->3"]

// Explanation: All root-to-leaf paths are: 1->2->5, 1->3
