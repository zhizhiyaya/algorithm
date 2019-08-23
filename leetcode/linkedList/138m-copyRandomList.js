/**
 * // Definition for a Node.
 * function Node(val,next,random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */
/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function (head) {
    var map = {};
    return copyNode(head, map);
};

function copyNode(head, map) {
    if (!head) {
        return head;
    }
    if (map.hasOwnProperty(head)) {
        return map[head];
    }
    var newHead = new Node(head.val);
    map.put(head, newHead);
    newHead.next = copyRandomList(head.next, map);
    newHead.random = copyRandomList(head.random, map);
    return newHead;
}

var copyRandomList = function () {
    if (head == null) return null;
    Node cur = head;
    while (cur != null) {
        Node next = cur.next;
        cur.next = new Node(cur.val, next, null);
        cur = next;
    }
    cur = head;
    while (cur != null) {
        if (cur.random != null)
            cur.next.random = cur.random.next;
        cur = cur.next.next;
    }
    cur = head;
    Node copyHead = head.next;
    while (cur != null) {
        Node next = cur.next.next;
        Node copy = cur.next;
        cur.next = next;
        if (next != null)
            copy.next = next.next;
        cur = next;
    }
    return copyHead;
}