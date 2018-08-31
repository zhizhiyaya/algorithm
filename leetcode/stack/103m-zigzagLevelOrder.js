/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @desc ie, from left to right, then right to left for the next level and alternate between
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function(root) {
    if (!root) {
        return [];
    }
    var stack = [];
    var ret = [[]];
    var dir = true; // true: left to right,false: right to left
    var levelStack = [];
    stack.push(root);

    while (stack.length > 0) {
        var cur = null;
        // 锯齿状吐出数据
        if (dir) {
            cur = stack.shift();
        } else {
            cur = stack.pop();
        }

        ret[ret.length - 1].push(cur.val);
        // 存储时保证正向顺序
        if (dir) {
            if (cur.left) {
                levelStack.push(cur.left);
            }
            if (cur.right) {
                levelStack.push(cur.right);
            }
        } else {
            if (cur.right) {
                levelStack.unshift(cur.right);
            }
            if (cur.left) {
                levelStack.unshift(cur.left);
            }
        }
        if (stack.length === 0) {
            stack = levelStack;
            levelStack = [];
            ret[ret.length] = [];
            dir = !dir;
        }
    }
    ret.pop();
    return ret;
};


//     ->
//      1

//     <-
//    2   5

//  3   4   6
