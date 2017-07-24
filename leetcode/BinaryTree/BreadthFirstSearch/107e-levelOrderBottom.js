/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function(root) {
	if (!root) {
		return [];
	}
	var result = [];
	var queue = [];
	var levelQueue = [];
	queue.push(root);
	var node = null;
	var sum = 1;
	var levelSum = 0;
	while(queue.length) {
		for(var i = 0; i < sum; i++) {
			node = queue.shift();
			levelQueue.push(node.val);
			if(node.left) {
				levelSum++;
				queue.push(node.left);  //先将左子树入队
			}
			if(node.right) {
				levelSum++;
				queue.push(node.right); //再将右子树入队
			}
		}
		result.unshift(levelQueue);
		levelQueue = [];
		sum = levelSum;
		levelSum = 0;
	}
	return result;
};
