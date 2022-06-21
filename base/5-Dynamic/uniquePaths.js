/**
 * @desc 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
    机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
    问总共有多少条不同的路径？
 * @param {string} s
 * @param {string} p
 * @return max
 */
/**
    递归
    走到终点，实际只有 2 条路：
    如果是 m*n 的网格，目标就是 (m, n)
    （1）走到终点的左边 (m-1, n)
    （2）走到终点的上边 (m, n-1)
    不同的路径就是上面两条路的和。
 */
var uniquePaths = function(grid) {
    if(m == 1 || n == 1) {
        return 1;
    }
    return uniquePaths(m - 1, n) + uniquePaths(m , n -1);
};