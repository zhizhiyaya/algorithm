/**
 * @method 找到满足最小高度树的根结点
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
var findMinHeightTrees = function(n, edges) {
    var graph = {};

    for (var i = 0; i < edges.length; i++) {
        const [first, second] = edges[i];
        if (!graph[first]) {
            graph[first] = [];
        }
        if (graph[first].indexOf(second) === -1) {
            graph[first].push(second);
        }
        if (!graph[second]) {
            graph[second] = [];
        }
        if (graph[second].indexOf(first) === -1) {
            graph[second].push(first);
        }
    }
    var nodeNum = n;
    delLeafs(graph, nodeNum);
    var ret = [];
    for (var key in graph) {
        ret.push(+key);
    }
    return ret;
};

function delLeafs(graph, nodeNum) {
    if (nodeNum <= 2) {
        return;
    }
    var leafs = [];
    for(var key in graph) {
        if (graph[key].length === 1) { // 叶子节点
            leafs.push(+key);
        }
    }

    for(var key in graph) { // 剥洋葱， 将外层叶子节点剥掉
        leafs.forEach(leaf => {
            var index = graph[key].indexOf(leaf);
            if (index > -1) { // 叶子节点
                graph[key].splice(index, 1);
            }
        });
    }
    nodeNum = nodeNum - leafs.length;
    if (nodeNum > 2) {
        delLeafs(graph, nodeNum);
    }
}
/**
 *
 *
 *      1
 *      |
 *  2 - 0 - 3    剥去叶子节点---->     0
 *      |                            |
 *      4                            4
 *      |
 *      5
 *
 **/


/**
 * @desc 建立一个图g，是一个二维数组，其中g[i]是一个一维数组，保存了i节点可以到达的所有节点。
 *          我们开始将所有只有一个连接边的节点(叶节点)都存入到一个队列queue中，然后我们遍历每一个叶节点，
 *          通过图来找到和其相连的节点，并且在其相连节点的集合中将该叶节点删去，
 *          如果删完后此节点也也变成一个叶节点了，加入队列中，再下一轮删除。
 *          当节点数小于等于2时候停止，此时剩下的一个或两个节点就是我们要求的最小高度树的根节点啦
 */
