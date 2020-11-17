/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
    if (!l1) return l2;
    if (!l2) return l1;

    var head = null;
    var former = null;
    while (l1 && l2) {
        if (l1.val > l2.val) {
            if (!former) former = l2;
            else former.next = l2;
            l2 = l2.next;
        } else {
            if (!former) former = l1;
            else former.next = l1;
            l1 = l1.next;
        }
        if (!head) head = former;
        else former = former.next;
    }
    if (l2 !== null) l1 = l2;
    former.next = l1;
    return head;
};

// Input: 1->2->4, 1->3->4
// Output: 1->1->2->3->4->4