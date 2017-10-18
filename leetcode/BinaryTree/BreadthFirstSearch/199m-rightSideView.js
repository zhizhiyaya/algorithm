/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
	if (root) {
		var parents = [root];
		var child = [];
		var ret = [];
		var cur = null;
		while (parents.length > 0) {
			cur = parents.shift();
			ret.push(cur);
			if (cur.right) {
				child.push(cur.right);
			}
			if (cur.left) {
				child.push(cur.left);
			}
			while (parents.length > 0) {
				cur = parents.shift();
				if (cur.right) {
					child.push(cur.right);
				}
				if (cur.left) {
					child.push(cur.left);
				}
			}

			parents = child.length > 0 ? child : [];
			child = [];
		}
		return ret;
	}
	return [];
};
