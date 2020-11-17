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
        map[sum] = pointer; // sum 出现相同的，后面的pointer 会覆盖掉前面的
    }
    
    sum = 0;
    for(var pointer = head; pointer != null;  pointer = pointer.next){
        sum+= pointer.val;
        var node = map[sum];
        if(sum == 0) head = node.next;
        // 因为map[sum] 存在覆盖，而覆盖 是因为不同节点下sum为 0导致的，所以 节点不同时 则节点之间的节点和为 0，则修改next 把中间和为0 的去掉即可 
        if(node != pointer) pointer.next = node.next; // 关键的这步，
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
