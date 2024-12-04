/** 维护一个存储当前窗口中最大值下标的双端队列
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    const deque = []; // 双端队列存储下标
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // 移除队列中不在当前窗口范围的元素
        if (deque.length && deque[0] === i - k) {
            deque.shift();
        }
        
        // 移除队列中小于当前元素的所有元素
        while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        // 将当前元素下标添加到队列
        deque.push(i);
        
        // 当窗口大小达到 k 时，开始记录最大值
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
};


/** TLE
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    let left = 0;
    let right = 0;
    let sildingWindow = [];
    const numsLength = nums.length;
    let res = [];
    while(right < numsLength) {
        const rightNum = nums[right];
        sildingWindow.push(rightNum);
        if (sildingWindow.length === k) { // 达到窗口长度
            let temp = left;
            let maxNumIndex = temp;
            while(temp <= right) {
                if (nums[temp] > nums[maxNumIndex]) {
                    maxNumIndex = temp;
                }
                temp++;
            }
            res.push(nums[maxNumIndex]);
        }
       
        if (sildingWindow.length === k) {
            left++;
            sildingWindow.shift();
        }
        right++;
    }
    return res;
};