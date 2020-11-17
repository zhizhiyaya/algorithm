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
    var dummy = new ListNode(0);
    var pre = dummy;
    var cur;
    dummy.next = head;
    var k = 1;
    while (pre.next && k !== m) {
        pre = pre.next;
        k++;
    }
    cur = pre.next;
    while (cur.next && k !== n) {
        var temp = pre.next;
        pre.next = cur.next;
        cur.next = cur.next.next;
        pre.next.next = temp;
        k++;
    }
    return dummy.next;
};
