// 等同于 116 尴尬
/**
 * Definition for binary tree with next pointer.
 * function TreeLinkNode(val) {
 *     this.val = val;
 *     this.left = this.right = this.next = null;
 * }
 */

/**
 * @param {TreeLinkNode} root
 * @return {void} Do not return anything, modify tree in-place instead.
 */
var connect = function(root) {
	if (root) {
		var parents = [root];
		var child = [];
		var cur = null;
		var next = null;
		while (parents.length > 0) {
			cur = parents.shift();
			if (cur.left) {
				child.push(cur.left);
			}
			if (cur.right) {
				child.push(cur.right);
			}

			while (parents.length > 0) {
				next = parents.shift();
				cur.next = next;
				if (next.left) {
					child.push(next.left);
				}
				if (next.right) {
					child.push(next.right);
				}
				cur = cur.next;
			}
			cur.next = null;
			cur = null;
			next = null;
			if (child.length > 0) {
				parents = child;
			}
			child = [];
		}
	}
};
