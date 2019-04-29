/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
/**
 * @param {Node} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
    if (!root) return [];
    var queue = [root];
    var res = [];
    while (queue.length) {
        var levelVal = [];
        for (var i = queue.length; i--;) {
            var cur = queue.shift();
            levelVal.push(cur.val);
            if (cur.children) {
                queue = queue.concat(cur.children);
            }
        }
        res.push(levelVal);
    }
    return res;
};
// var root = {"$id":"1","children":[{"$id":"2","children":[{"$id":"5","children":[],"val":5},{"$id":"6","children":[],"val":6}],"val":3},{"$id":"3","children":[],"val":2},{"$id":"4","children":[],"val":4}],"val":1};
// levelOrder(root);