/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 分割成两段再拼接
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
    if (!head || k === 0) {
        return head;
    }
    var cur = head;
    var foot = new ListNode(0);
    var len = 1; // 多加了个长度取余 由 3876 ms 提到60 ms 😂
    while (cur.next) {
        len++;
        cur.next.prev = cur;
        cur = cur.next;
    }
    foot = cur;
    k = k % len;
    while (k--) {
        cur = cur.prev || foot;
    }
    foot.next = head;
    head = cur.next;
    cur.next = null;
    return head;
};

// Input: 0->1->2->NULL, k = 4
// Output: 2->0->1->NULL
// Explanation:
// rotate 1 steps to the right: 2->0->1->NULL
// rotate 2 steps to the right: 1->2->0->NULL
// rotate 3 steps to the right: 0->1->2->NULL
// rotate 4 steps to the right: 2->0->1->NULL