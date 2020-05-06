/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 最近一个比cur 大的值替换cur,否则0
 * @param {ListNode} head
 * @return {number[]}
 */
var nextLargerNodes = function(head) {
    var res = [];
    while(head && head.next) {
        var node = head.next;
        var flag = 0;
        while(node){
            if(node.val > head.val){
                flag = 1;
                break;
            }
            node = node.next;
        }
        res.push(flag ? node.val : 0);
        head = head.next;
    }
    res.push(0);
    return res;
};

// Input: [2,1,5]
// Output: [5,5,0]

// Input: [2,7,4,3,5]
// Output: [7,0,5,5,0]

// Input: [1,7,5,1,9,2,5,1]
// Output: [7,9,9,9,0,5,0,0]