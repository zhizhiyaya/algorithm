/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @desc 一个奇数指针，一个偶数指针
 * @param {ListNode} head
 * @return {ListNode}
 */
var oddEvenList = function(head) {
    if (!head || !head.next) {
        return head;
    }
    var evenHead = head.next;
    var curOdd = head;
	var curEven = curOdd.next;

	var prevOdd = null;
	var prevEven = null;
	while(curOdd && curEven){
		curEven = curOdd.next;
		if(prevEven) {
			prevEven.next = curEven;
		}

		if(prevOdd) {
			prevOdd.next = curOdd;
		}

		prevEven = curEven;
		prevOdd = curOdd;

		if(curEven && curEven.next === null) {
			break;
		}
		if(curEven) {
			curOdd = curEven.next;
		}
    }
    prevOdd.next = evenHead;
    return head;
};

// Example 1:
// Input:  1->2->3->4->5->NULL
// Output: 1->3->5->2->4->NULL

// Example 2:
// Input:  2->1->3->5->6->4->7->NULL
// Output: 2->3->6->7->1->5->4->NULL
