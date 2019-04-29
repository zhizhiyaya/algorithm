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
var largestValues = function (root) {
    if (!root) {
        return [];
    }
    var res = [];
    var queue = [root];
    var curRowLargestVal = -Number.MAX_VALUE;
    while (queue.length) {
        for (var i = queue.length; i--;) {
            var curNode = queue.shift();
            if (curNode.val > curRowLargestVal) {
                curRowLargestVal = curNode.val;
            }
            if (curNode.left) {
                queue.push(curNode.left);
            }
            if (curNode.right) {
                queue.push(curNode.right);
            }
        }
        res.push(curRowLargestVal);
        curRowLargestVal = -Number.MAX_VALUE;
    }
    return res;
};

var largestValues = function (root) {
    if (!root) {
        return [];
    }
    var res = [];
    var queue = [root];
    var childQueue = [];
    var curRowLargestVal = -Number.MAX_VALUE;
    while (queue.length) {
        var curNode = queue.shift();
        if (curNode.val > curRowLargestVal) {
            curRowLargestVal = curNode.val;
        }
        if (curNode.left) {
            childQueue.push(curNode.left);
        }
        if (curNode.right) {
            childQueue.push(curNode.right);
        }
        if (!queue.length) {
            queue = childQueue;
            childQueue = [];
            res.push(curRowLargestVal);
            curRowLargestVal = -Number.MAX_VALUE;
        }
    }
    return res;
};

// Input:
//           1
//          / \
//         3   2
//        / \   \
//       5   3   9

// Output: [1, 3, 9]