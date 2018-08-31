/**
 * @method 求最大矩形面积
 * @desc 左右两个下标，以当前遍历到的数值为基准，向外扩展，包含当前值的符合条件
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
    var ret = 0;
    var len = heights.length;

    for(var i = 0; i < len; i++) {
        var l = r = i;
        var area = 0;
        while (r + 1 < len && heights[i] <= heights[r + 1]) {
            r++;
        }
        while (l - 1 > -1 && heights[i] <= heights[l - 1]) {
            l--;
        }
        area = (r - l + 1) * heights[i];
        if (area > ret) {
            ret = area;
        }
    }
    return ret;
};
