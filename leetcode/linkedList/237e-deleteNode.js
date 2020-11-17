/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc node 即 List 中的某各节点，把跟当前节点val 相同的节点删除
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function(node) {
    var pre = node;
    while(node.next){
        node.val = node.next.val;
        pre = node;
        node = node.next;
    }
    pre.next = null;
};
