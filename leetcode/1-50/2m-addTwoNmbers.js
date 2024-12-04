/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
 var addTwoNumbers = function(l1, l2) {
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
// 非 ListNode ，leetcode 运行出错，纯数学运算上是OK的
var addTwoNumbers = function(l1, l2) {
	var length1 = l1.length;
	var length2 = l2.length;
	var i = 0, j = 0;
	var carry = 0;
	var sum = 0;
	var bSum = '';
	while (i < length1 || j < length2) {
		sum = carry + (l1[i++] || 0) + (l2[j++] || 0);
		bSum += (sum % 10);
		carry = (sum / 10);
	}
	if (carry) {
		bSum += carry;
	}
	return bSum.split('').map(i => +i);
}
// Input: l1 = [2,4,3], l2 = [5,6,4]
// Output: [7,0,8]
// Explanation: 342 + 465 = 807
console.log(addTwoNumbers([2,4,3], [5,6,4]));


/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    var resList = new ListNode(0);
    var newHead = resList;
    var carry = 0;
    var remainder = 0;
    
    while(l1 || l2) {
        var val1 = 0;
        var val2 = 0;
        if (l1) {
            val1 = l1.val;
            l1 = l1.next;
        }
        if (l2) {
            val2 = l2.val;
            l2 = l2.next
        }

        var sum = carry + val1 + val2;
        carry = sum / 10; // 进位
        remainder= sum % 10; // 当前位
        resList.next = new ListNode(remainder);
        resList = resList.next;
    }
    return newHead.next;
};