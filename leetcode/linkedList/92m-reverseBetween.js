/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 交换 m 位置和 n 位置的节点
 * @param {ListNode} head
 * @param {number} m
 * @param {number} n
 * @return {ListNode}
 */
var reverseBetween = function (head, m, n) {
    if (!head) {
        return head;
    }
    var dummy = new ListNode(0);
    dummy.next = head;
    var pre = dummy, cur = head;
    var k = 1;
    while (cur.next && k !== m) {
        cur = cur.next;
        pre = pre.next;
        k++;
    }
    while (cur.next && k !== n) {
        var preNext = pre.next;
        pre.next = cur.next;
        var next = cur.next;
        cur.next = next.next;
        next.next = preNext;
        k++;
    }
    return dummy.next;
};