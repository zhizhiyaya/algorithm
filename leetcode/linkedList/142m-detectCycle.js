/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function(head) {
    if (!head || !head.next) {
        return null;
    }
    while (head) {
        if (head.isVisited) {
            return head;
        }
        head.isVisited = true;
        head = head.next;
    }
    return null;
};
