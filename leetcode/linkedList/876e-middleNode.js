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
var middleNode = function(head) {
    if (!head || !head.next) {
        return head;
    }
    var fast = head;
    var slow = head;
    while (fast) {
        if (!fast.next) {
            return slow;
        } if (!fast.next.next) {
            return slow.next;
        } else {
            fast = fast.next.next;
            slow = slow.next;
        }
    }
};