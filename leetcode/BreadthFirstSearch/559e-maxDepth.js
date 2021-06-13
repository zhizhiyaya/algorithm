/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
/**
 * @param {Node} root
 * @return {number}
 */
var maxDepth = function (root) {
    if (!root) return 0;
    var queue = [root];
    var depth = 0;
    while (queue.length) {
        depth++;
        for (var i = queue.length; i--;) {
            var cur = queue.shift();
            if (cur.children) {
                queue = queue.concat(cur.children);
            }
        }
    }
    return depth;
};
var root = {"$id":"1","children":[{"$id":"2","children":[{"$id":"5","children":[],"val":5},{"$id":"6","children":[],"val":6}],"val":3},{"$id":"3","children":[],"val":2},{"$id":"4","children":[],"val":4}],"val":1};
maxDepth(root);