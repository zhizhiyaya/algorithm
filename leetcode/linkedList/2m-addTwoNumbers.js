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
var addTwoNumbers = function (l1, l2) {
    var resList = new ListNode(0);
    var newHead = resList;
    var carry = 0; // 进位

    while (l1 || l2) {
        var val1 = 0;
        var val2 = 0;
        if (l1) {
            val1 = l1.val || 0;
            l1 = l1.next;
        }
        if (l2) {
            val2 = l2.val || 0;
            l2 = l2.next;
        }
        carry += val1 + val2;
        var remainder = carry % 10;// 余数
        carry = (carry - remainder) / 10;
        resList.next = new ListNode(remainder);
        resList = resList.next;
    }
    if (carry) {
        resList.next = new ListNode(carry);
    }
    return newHead.next;
};

// Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
// Output: 7 -> 0 -> 8
// Explanation: 342 + 465 = 807.