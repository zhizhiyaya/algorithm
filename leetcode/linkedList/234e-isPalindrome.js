/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
    var dummy = new ListNode(0);
    dummy.next = head;
    var fast = dummy;
    var slow = dummy;
    while (fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
    }
    var start = slow.next;
    slow.next = null;
    // 反转后半段
    var reverse = reverseList(start);

    // 反转后比对
    while (reverse) {
        if (reverse.val != head.val) return false;
        reverse = reverse.next;
        head = head.next;
    }
    return true;
};

// 206
function reverseList(head) {
    var prev = null;
    while (head) {
        var temp = head.next;
        head.next = prev;
        prev = head;
        head = temp;
    }
    return prev;
};
