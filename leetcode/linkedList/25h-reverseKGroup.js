/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function (head, k) {
    if (!head || k === 0) {
        return head;
    }
    var dummy = new ListNode(0);
    dummy.next = head;
    var cur = dummy, next = dummy, pre = dummy;
    var count = 0;
    while (cur.next) {
        cur = cur.next;
        count++;
    }
    while (count >= k) {
        cur = pre.next;
        next = cur.next;
        for (var i = 1; i < k; i++) {
            cur.next = next.next;
            next.next = pre.next;
            pre.next = next;
            next = cur.next;
        }
        pre = cur;
        count -= k;
    }
    return dummy.next;
};
// var reverseKGroup = function (head, k) {
//     if (!head || k === 0) {
//         return head;
//     }
//     var step = k;
//     var newHead = null;
//     var next = new ListNode(0);
//     var prevFoot = new ListNode(0);
//     var perHead = head;
//     var cur = head.next;
//     while (step--) {
//         if (step === 0) {
//             if (!newHead) {
//                 newHead = perHead;
//                 prevFoot = cur;
//             }
//             if (cur) { // 下一轮
//                 perHead = cur.next;
//                 if (!perHead) {
//                     break;
//                 }
//                 cur = perHead.next;
//                 step = k;
//             }
//         } else if (cur) {
//             perHead.next = cur.next;
//             next = cur.next;
//             cur.next = perHead;
//             perHead = cur;
//             cur = next;
//         } else { // 不足k 就已经结尾时再将尾巴重置回来
//             break;
//         }
//     }
//     var lastList = reverseList(perHead);
//     prevFoot.next = lastList;
//     return newHead;
// };
// function reverseList(head) {
//     if (!head) {
//         return head;
//     }
//     var next = head.next;
//     while (head) {
//         if (next) {
//             next.prev = head;
//         } else {
//             break;
//         }
//         head = head.next;
//         next = head && head.next || null;
//     }
//     var cur = head;
//     while (cur) {
//         cur.next = cur.prev;
//         cur = cur.prev;
//     }
//     return head;
// }