/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @method 按 k 的长度依次反转
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
	var len = head.length;
	var tem = [];
	var ret = [];
	for (var i = 0; i < len; i = end) {
		end = len - i > k ? i + k : len;
		tem = head.slice(i, end);
		for (var j = tem.length - 1; j >= 0; j--){
			ret.push(tem[j]);
		}
	}
	return ret;
};
console.log(reverseKGroup([1, 2, 3, 4, 5], 3));
