/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
    if (!head) {
        return head;
    }
    var prev = new ListNode(0);
    var fakeHead = prev;
    prev.next = head;
    while (head) {
        if (head.val === val) {
            prev.next = head.next;
        } else {
            prev = head;
        }
        head = head.next;
    }
    return fakeHead.next;
};
