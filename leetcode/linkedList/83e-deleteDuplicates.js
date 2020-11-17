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
// var deleteDuplicates = function(head) {
//     return Array.from(new Set(head))
// };
var deleteDuplicates = function (head) {
    if (!head || !head.next) {
        return head;
    }
    head.next = deleteDuplicates(head.next);
    return head.val === head.next.val ? head.next : head;
};