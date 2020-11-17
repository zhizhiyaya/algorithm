/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc Given a singly linked list L: L0→L1→…→Ln-1→Ln,
        reorder it to: L0→Ln→L1→Ln-1→L2→Ln-2→…
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function(head) {
    if (!head) {
        return head;
    }
    var length = 1;
    var cur = head;
    while (cur.next) {
        cur.next.prev = cur;
        cur = cur.next;
        length++;
    }
    var fake = head;
    var step = Math.ceil(length / 2);
    while (step > 1) {
        var next = fake.next;
        var prev = cur.prev;
        prev.next = null;
        cur.next = fake.next;
        fake.next = cur;
        cur = prev;
        fake = next;
        step--;
    }
};
