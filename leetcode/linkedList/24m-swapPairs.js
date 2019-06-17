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
var swapPairs = function (head) {
    if (!head) {
        return head;
    }
    var odd = head;
    var even = odd.next;
    var prev = new ListNode(0);
    prev.next = odd;
    head = even || odd;
    while (odd && even) {
        // 交换
        odd.next = even.next;
        even.next = odd;
        prev.next = even;
        // 移动
        prev = odd;
        odd = odd.next;
        even = odd && odd.next || null;
    }
    return head;
};