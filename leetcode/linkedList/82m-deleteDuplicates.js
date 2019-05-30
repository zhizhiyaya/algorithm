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
var deleteDuplicates = function (head) {
    if (!head) {
        return head;
    }
    var fakeHead = new ListNode(0);
    fakeHead.next = head;
    var prev = fakeHead;
    var cur = fakeHead;
    while (cur) {
        while (cur.next && cur.val === cur.next.val) {
            cur = cur.next;
        }
        if (prev.next === cur) {
            prev = prev.next;
        } else {
            prev.next = cur.next;
        }
        cur = cur.next;
    }
    return fakeHead.next;
};

var deleteDuplicates = function (head) {
    if (!head) {
        return head;
    }
    if (head.next && head.val === head.next.val) {
        while (head.next && head.val === head.next.val) {
            head = head.next;
        }
        return deleteDuplicates(head.next);
    } else {
        head.next = deleteDuplicates(head.next);
    }
    return head;
};