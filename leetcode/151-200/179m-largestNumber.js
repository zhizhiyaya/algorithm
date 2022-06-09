/**
 * @param {number[]} nums
 * @return {string}
 */
 var largestNumber = function(nums) {
    if(nums === null || nums.length === 0) {
        return "";
    }
    sort(nums, (a, b) => { return `${b}${a}` - `${a}${b}` < 0});
    var res = nums.join('');
    return res == 0 ? '0' : res;
};


function sort(arr, fn){
    var index = 0
    for(var i = 1;i < arr.length; i++){
        index = i
        for(var j = i-1; j>=0; j--){
            if(fn(arr[i], arr[j])){
                index = j
            }
        }
        arr.splice(index,0,arr[i])
        arr.splice(i+1,1)
    }
    return arr
}