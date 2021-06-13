/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @method
 * @param {TreeNode} root 对称二叉树
 * @return {boolean}
 */
var isSymmetric = function(root) {
	if(!root) {
		return true;
	}
	var stack = [];
	stack.push(root);
	stack.push(root);
	var left = null,
		right = null;
    while(stack.length > 0){
        right = stack.pop();
        left = stack.pop();
        if(right.val != left.val) {
			return false;
		}

        if(left.left) {
            if(right.right == null) {
				return false;
			}
            stack.push(left.left);
            stack.push(right.right);
        } else if(right.right) {
            return false;
        }

        if(left.right){
            if(right.left == null) {
				return false;
			}
            stack.push(left.right);
            stack.push(right.left);
        } else if(right.left){
            return false;
        }
    }

    return true;
};

/***
			1
		2		2
	  4	  3	  3	  4
	5               6
**/
