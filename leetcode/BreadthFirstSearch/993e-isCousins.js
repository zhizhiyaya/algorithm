/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @desc  x y same depth, but have different parents
 * @param {TreeNode} root
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
var isCousins = function (root, x, y) {
    if (!root) {
        return false;
    }
    var queue = [root];
    while (queue.length) {
		var isAexist = false;		
		var isBexist = false;		
		for (var i = queue.length; i--;) {
            var cur = queue.shift();
            if (cur.val === x) isAexist = true;
            if (cur.val === y) isBexist = true;
			if (cur.left && cur.right) { 
				if (cur.left.val === x && cur.right.val === y) { 
					return false;
				}
				if (cur.left.val === y && cur.right.val === x) { 
					return false;
				}
			}
			if (cur.left) {
				queue.push(cur.left);
			}
			if (cur.right) {
				queue.push(cur.right);
			}
		}
		if (isAexist && isBexist) return true;
    }
    return false;
};