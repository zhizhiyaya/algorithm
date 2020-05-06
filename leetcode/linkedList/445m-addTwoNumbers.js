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
var addTwoNumbers = function(l1, l2) {
    var head = null;
    var cur = null;
    var newL1 = revert(l1);
    var newL2 = revert(l2);
    var cin = 0;
    var sum = 0;
    while (newL1 || newL2 || cin) {
        sum = cin;
        if (newL1) {
            sum += newL1.val;
            newL1 = newL1.next;
        }
        if (newL2) {
            sum += newL2.val;
            newL2 = newL2.next;
        }
        cur = new ListNode(sum % 10);
        cin = (sum - cur.val) / 10;
        cur.next = head;
        head = cur;
    }
    return head;
};
function revert(head) {
    if (!head) {
        return;
    }
    var cur = head.next;
    while (head) {
        head.next = cur.next;
        cur.next = head;
    }
    return head;
};


// 这个方法简直太机智了
// 先变成数字相加 ，默认就 右对齐了 
var addTwoNumbers = function(l1, l2) {
    var num1 = num2 = 0
    while (l1) {
        num1 = num1 * 10 + l1.val;
        l1 = l1.next;
    }
        
    while (l2) {
        num2 = num2 * 10 + l2.val;
        l2 = l2.next;
    }
    num = num1 + num2 + '';
    dummy = new ListNode(0);
    var cur = dummy;
    for (var i = 0; i < num.length; i++) {
        cur.next = new ListNode(num[i]);
        cur = cur.next;
    }
    cur.next = null;
    return dummy.next;
}