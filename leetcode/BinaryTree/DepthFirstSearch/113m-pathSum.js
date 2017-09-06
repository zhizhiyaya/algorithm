/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {number[][]}
 */
var pathSum = function(root, sum) {
    var result = [];
    _pathSum(root, sum, []);
    return result;

    function _pathSum(root, sum, curArrPath) {
    	if (root == null)
    		return;
    	curArrPath.push(root.val);
    	if (root.left == null && root.right == null && sum == root.val) {
            var res = curArrPath.concat();
    		result.push(curArrPath);
    		curArrPath.pop();
    		return;
    	} else {
    		_pathSum(root.left, sum - root.val, curArrPath);
    		_pathSum(root.right, sum - root.val, curArrPath);
    	}
    	curArrPath.pop();
    }
};
