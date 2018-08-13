/**
 * @param {number[]} height
 * @return {number}
 */
 var maxArea = function(height) {
 	var low = 0;
     var high = height.length - 1;
 	var maxArea = 0;
 	while (low < high) {
 		maxArea = Math.max(maxArea, (high - low) * Math.min(height[low], height[high]));
 		if (height[low] < height[high]) {
 			low++;
 		} else {
 			high--;
 		}
 	}
 	return maxArea;
 };
console.log(maxArea([1, 1]));
