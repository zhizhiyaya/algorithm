/**
 * @method 给定一个二维数组，找到垂直或水平方向连续1最多的个数，也就是岛的面积
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {
	var maxArea = 0;
    for (var i=0;i<grid.length;i++){
        for (var j=0;j<grid[0].length;j++) {
            if (grid[i][j] == 1) {
				maxArea = Math.max(maxArea,AreaOfIsland(grid,i,j));
			}
        }
	}
   return maxArea;
};

function AreaOfIsland(grid, i, j){
    if (i>=0 && i<grid.length && j>=0 && j<grid[0].length && grid[i][j] == 1){
　　　　　//周围四个节点的面积，加上本节点的面积1
        grid[i][j]=0;
        return AreaOfIsland(grid,i-1,j) + AreaOfIsland(grid,i+1,j) + AreaOfIsland(grid,i,j-1) + AreaOfIsland(grid,i,j+1) + 1;
    }
    return 0;
}

/**

[[0,0,1,0,0,0,0,1,0,0,0,0,0],
 [0,0,0,0,0,0,0,1,1,1,0,0,0],
 [0,1,1,0,1,0,0,0,0,0,0,0,0],
 [0,1,0,0,1,1,0,0,1,0,1,0,0],
 [0,1,0,0,1,1,0,0,1,1,1,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,0,0],
 [0,0,0,0,0,0,0,1,1,1,0,0,0],
 [0,0,0,0,0,0,0,1,1,0,0,0,0]]

 return 6;

 [[0,0,0,0,0,0,0,0]]
 return 0;

**/
