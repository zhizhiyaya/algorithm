/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @desc 返回AB的交叉点
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
    if (!headA || !headB) return null;
    var a = headA;
    var b = headB;
    while (a !== b) { // 第二轮后，ab 的步调就一致了 ，因为他们一个在走 a+b，另一个在走 b+a
        a = a === null ? headB : a.next;
        b = b === null ? headA : b.next;
    }
    return a;
};

// 栗子
// 8
// [4,1,8,4,5]
// [5,0,1,8,4,5]
// 2
// 3
