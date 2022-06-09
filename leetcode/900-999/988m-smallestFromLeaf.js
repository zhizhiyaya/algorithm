/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {string}
 */
var smallestFromLeaf = function(root) {
    var ans = "";
    void dfs(root, curr = "") {
        if (!root) return;
        curr.insert(curr.begin(), 'a' + root.val);
        if (!root.left && !root.right) {
            if (ans.empty())
                ans = curr;
            else 
                ans = min(ans, curr);
        }
        dfs(root.left, curr);
        dfs(root.right, curr);
        curr.erase(curr.begin());
    }
    dfs(root);
    return ans;
};