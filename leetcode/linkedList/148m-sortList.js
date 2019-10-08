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
var insertionSortList = function(head) {
    if (!head) {
        return head;
    }
    var helper = new ListNode(0);
    var cur = head;
    var pre = helper;
    var next = null;
    while (cur != null) {
        next = cur.next;
        while (pre.next != null && pre.next.val < cur.val) {
            pre = pre.next;
        }
        cur.next = pre.next;
        pre.next = cur;
        pre = helper; // pre 重置为有序数列的head 
        cur = next;
    }
    
    return helper.next;
};

// Sort a linked list in O(n log n) time using constant space complexity.

// Example 1:

// Input: 4->2->1->3
// Output: 1->2->3->4
// Example 2:

// Input: -1->5->3->4->0
// Output: -1->0->3->4->5
