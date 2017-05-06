/**
 * Definition for singly-linked list.
 **/
// function ListNode(val) {
// 	this.val = val;
// 	this.next = null;
// }

/**
 * @method 相同索引相加，求和
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
	var _sum = 0;
	var _res = [];
	var len = l1.length > l2.length ? l1.length : l2.length;
	if (len) {
		for (var i = 0; i < len; i++) {
			_sum = (_sum / 10).toString().split('.')[0];
			if (l1[i]) {
				_sum += l1[i];
			}
			if (l2[i]) {
				_sum += l2[i];
			}
			_res.push(_sum % 10);
		}
		if (_sum / 10 === 1) {
			_res.push(1);
		}
	}
	return _res;
};

console.log(addTwoNumbers([2,4,3], [5,6,4]));
