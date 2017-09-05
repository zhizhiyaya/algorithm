/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function(head) {
	if (!head) {
		return null;
	}
	return subChildTree(head, null);
};

// 通过fast，slow 来解决，
// fast每次走两步，slow每次走一步，
// fast走到结尾，那么slow就是中间节点了
function subChildTree(startNode, endNode) {
    if(startNode == endNode) {
        return null;
    }
	var fast = startNode;
	var slow = startNode;

    while(fast != endNode && fast.next != endNode) {
        slow = slow.next;
        fast = fast.next.next;
    }

    var node = new TreeNode(slow.val);
    node.left = subChildTree(startNode, slow);
    node.right = subChildTree(slow.next, endNode);

    return node;
}
