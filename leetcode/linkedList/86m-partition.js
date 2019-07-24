/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 比 X 小的移到前面,移到前面的自然顺序和原序列顺序一致
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function (head, x) {
    var node1 = new ListNode(0);
    var node2 = new ListNode(0);
    var p1 = node1;
    var p2 = node2;
    while (head) {
        if (head.val < x) {
            p1 = p1.next = head;
        } else {
            p2 = p2.next = head;
        }
        head = head.next;
    }
    p2.next = null;
    p1.next = node2.next;
    return node1.next;
};

// Input:
// [1,6,3,2,6,4,2,3,2,5,2,6]
// 4
// Output:
// [1,3,2,2,3,2,2,6,6,4,5,6]
