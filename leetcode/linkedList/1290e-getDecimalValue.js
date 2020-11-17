/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 二进制转10进制
 * @param {ListNode} head
 * @return {number}
 */
var getDecimalValue = function(head) {
    var res = 0;
    while(head) {
        res *= 2;
        if(head.val == 1) res++;
        head = head.next;
    }
    return res;
};

// 
var getDecimalValue = function(head) {
    var res = 0;
    while (head != null) {
        res = (res << 1) | head.val; // 左移一位 相当于*2，按位或， 0001 即 + 1
        head = head.next;
    }
    return res;
};


// Example 1:
// Input: head = [1,0,1]
// Output: 5
// Explanation: (101) in base 2 = (5) in base 10

// Example 2:

// Input: head = [0]
// Output: 0
// Example 3:

// Input: head = [1]
// Output: 1
// Example 4:

// Input: head = [1,0,0,1,0,0,1,1,1,0,0,0,0,0,0]
// Output: 18880
// Example 5:

// Input: head = [0,0]
// Output: 0
