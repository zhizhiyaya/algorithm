/**
 * Definition for singly-linked list.
 * function var(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 移除和为0 的
 * @param {var} head
 * @return {var}
 */
var removeZeroSumSublists = function(head) {
    var map = {};
    var sum = 0;
    for(var pointer = head; pointer != null; pointer = pointer.next){
        sum += pointer.val;
        map[sum] = pointer;
    }
    
    sum = 0;
    for(var pointer = head; pointer != null;  pointer = pointer.next){
        sum+= pointer.val;
        var node = map[sum];
        if(sum == 0) head = node.next;
        if(node != pointer) pointer.next = node.next;
    }
    return head;
};

// Example 1:
// Input: head = [1,2,-3,3,1]
// Output: [3,1]
// Note: The answer [1,2,1] would also be accepted.

// Example 2:
// Input: head = [1,2,3,-3,4]
// Output: [1,2,4]

// Example 3:
// Input: head = [1,2,3,-3,-2]
// Output: [1]