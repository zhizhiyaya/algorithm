/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/** 
 * 分治算法
 * 一个复杂的问题分成两个或更多的相同或相似的子问题，直到最后子问题可以简单求解,
 * 再将分解后的子解合并
 */
/**
 * @desc 
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
    var leng = lists.length;
    if (leng === 0) return null;
    if (leng === 1) return lists[0];
    if (leng === 2) return mergeTwoLists(lists[0], lists[1]);
    var mid = Math.floor(leng / 2);
    return mergeTwoLists(mergeKLists(lists.slice(0, mid)),
        mergeKLists(lists.slice(mid, leng)));
};

function mergeTwoLists(l1, l2) {
    if (!l1) return l2;
    if (!l2) return l1;

    var head = null;
    var former = null;
    while (l1 && l2) {
        if (l1.val > l2.val) {
            if (!former) former = l2;
            else former.next = l2;
            l2 = l2.next;
        } else {
            if (!former) former = l1;
            else former.next = l1;
            l1 = l1.next;
        }
        if (!head) head = former;
        else former = former.next;
    }
    if (l2 !== null) l1 = l2;
    former.next = l1;
    return head;
    
}