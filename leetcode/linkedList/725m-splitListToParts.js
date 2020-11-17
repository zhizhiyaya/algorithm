/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} root
 * @param {number} k
 * @return {ListNode[]}
 */
var splitListToParts = function(root, k) {
    if (!root || k === 0) {
        return [];
    }
    var leng = 0;
    var node = root;
    while (node) {
        leng++;
        node = node.next;
    }
    var res = [];
    var remainder = 0;
    var splitLength = 1;
    if (k < leng) {
        remainder = leng % k;
        splitLength = (leng - leng % k) / k;    
    }
    
    var perLength = splitLength + remainder;
    for (var i = 0; i < k; i++) {
        res[i] = [];
        while (root && perLength) {
            console.log(perLength, root.val);
            res[i].push(root.val);
            root = root.next;
            perLength--;
        }
        perLength = splitLength;
    }
    return res;
};


vector<ListNode*> res;
int size = 0;
if(k == 0) return res;

for(ListNode* temp = root;temp;inc(temp)) // find number of elements
    size++;

if(size <= k){
    /*
    when 1,2,3,4 needs to be split into 5 parts
    return k=4 non null element seperately and k - size= 1 nullptr elements
    */
    res = vector<ListNode*>(size); // number of non null elements
    int rem = k - size, i = 0;
    
    for(auto temp = root;temp;i++){
        res[i] = temp;
        inc(temp);
        res[i]->next = nullptr;
    }
    vector<ListNode*> pad(rem,nullptr); // null elements padding
    res.insert(res.end(),pad.begin(), pad.end());
    return res;
}


/*
    
    if 1,2,3,4,5,6,7,8,9 is to be split into 5 parts
    return 1,2... 3,4... 5,6... 7,8... 9
    
    in other words, return [2,2,2,2,1] elements respectively where [].size == size
    
    First find the constant value that divides size perfectly ie. size/k = 9/5 = 1
    Then find the remainder ie. size%k = 9%5 = 4
    Then distribute the remainder one at a time for the first few elements until remainder becomes zero
    [1,1,1,1,1] -> [2,1,1,1,1] -> [2,2,1,1,1] ... [2,2,2,2,1] <- final result
    
    manipulate linked list ptrs to reflect those values and return final res;
    
    */


int div = size/k , rem = size%k, i = 0;
res = vector<ListNode*>(k);

for(auto temp = root;temp;i++){
    int currPartSize = div;
    
    if(rem > 0){
        currPartSize++;
        rem--;
    }
    
    auto head = temp, tail = temp;
    for(;currPartSize>1;inc(tail),currPartSize--);
    res[i] = head;
    
    temp = tail ? tail->next : tail;
    
    if(tail != nullptr){
    tail->next = nullptr;
    }
}


return res;