/**
 * @desc Directed acyclic graph(有向无环图)
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
/**
 * 拓扑序列要求的序列必然是开始于一系列入度为０的节点。如果 没有入度为０ 的节点，则表示这个图不是DAG，这样连遍历都没有必要了。
 * 当然，如果只是因为这个图里有入度为０的节点，并不代表这个图就一定是DAG。
 * 只是有了这么一个特征之后有一个好处，我们判断图是否为DAG时还是要检查是否存在环。
 * 但是，一旦判断出图里没有存在环，剩下的给出拓扑排序序列可以更加简化。我们只要去取这些入度为０的节点，然后从这些节点遍历图。
 * 然后给出的序列就是拓扑排序的序列。
 *
 * 对于DAG的拓扑排序( Topological sort DFS)的办法：
 *        找出图中 0 入度的顶点；
 *        依次在图中删除这些顶点，删除后再找出0入度的顶点；
 *        然后再删除……再找出……
 *        直至删除所有顶点，即完成拓扑排序
 */
var canFinish = function(numCourses, prerequisites) {
    if (prerequisites.length === 0 || numCourses < 2) {
        return true;
    }
    var graph = new Array(numCourses);
    var indegree = new Array(numCourses);
    for (var i = numCourses - 1; i > -1; i--) {
        indegree[i] = 0;
    }
    for (var i = prerequisites.length - 1; i > -1; i--) {
        var [cur, prv] = prerequisites[i];
        if (!graph[prv]) {
            graph[prv] = [];
        }
        graph[prv].push(cur);
        if (!indegree[cur]) {
            indegree[cur] = 0;
        }
        ++indegree[cur];
    }
    var queue = [];
    for (var i = indegree.length - 1; i > -1; i--) {
        if (!indegree[i]) { 
            queue.push(i);
        }
    }
    if (!queue.length) {
        return false;
    }
    while (queue.length) {
        var cur = queue.pop();
        var next = graph[cur];
        if (!next || next.length === 0) {
            continue;
        }
        graph[cur] = null;
        for (var i = next.length; i > -1; i--) {
            --indegree[next[i]]
            if (!indegree[next[i]]) {
                queue.push(next[i]);
            }
        }
    }
    for (var i = 0; i < graph.length; i++) {
        if (graph[i]) {
            return false;
        }
    }
    return true;
};

console.log(canFinish(4, [[1,0],[2,0],[3,1],[3,2]]));
// console.log(canFinish(3, [[0,2],[1,2],[2,0]]));

console.log(canFinish(100, [[6,27],[83,9],[10,95],[48,67],[5,71],[18,72],[7,10],[92,4],[68,84],[6,41],[82,41],[18,54],[0,2],[1,2],[8,65],[47,85],[39,51],[13,78],[77,50],[70,56],[5,61],[26,56],[18,19],[35,49],[79,53],[40,22],[8,19],[60,56],[48,50],[20,70],[35,12],[99,85],[12,75],[2,36],[36,22],[21,15],[98,1],[34,94],[25,41],[65,17],[1,56],[43,96],[74,57],[19,62],[62,78],[50,86],[46,22],[10,13],[47,18],[20,66],[83,66],[51,47],[23,66],[87,42],[25,81],[60,81],[25,93],[35,89],[65,92],[87,39],[12,43],[75,73],[28,96],[47,55],[18,11],[29,58],[78,61],[62,75],[60,77],[13,46],[97,92],[4,64],[91,47],[58,66],[72,74],[28,17],[29,98],[53,66],[37,5],[38,12],[44,98],[24,31],[68,23],[86,52],[79,49],[32,25],[90,18],[16,57],[60,74],[81,73],[26,10],[54,26],[57,58],[46,47],[66,54],[52,25],[62,91],[6,72],[81,72],[50,35],[59,87],[21,3],[4,92],[70,12],[48,4],[9,23],[52,55],[43,59],[49,26],[25,90],[52,0],[55,8],[7,23],[97,41],[0,40],[69,47],[73,68],[10,6],[47,9],[64,24],[95,93],[79,66],[77,21],[80,69],[85,5],[24,48],[74,31],[80,76],[81,27],[71,94],[47,82],[3,24],[66,61],[52,13],[18,38],[1,35],[32,78],[7,58],[26,58],[64,47],[60,6],[62,5],[5,22],[60,54],[49,40],[11,56],[19,85],[65,58],[88,44],[86,58]]));

// Line 26: RangeError: Maximum call stack size exceeded
// var canFinish = function(numCourses, prerequisites) {
//     var graph = {};
//     var indegree = new Array(numCourses);
//     var len = prerequisites.length;
//     for (var i = 0; i < len; i++) {
//         var [first, second] = prerequisites[i];
//         if (!graph[second]) {
//             graph[second] = {
//                 isVisited: false,
//                 next: []
//             };
//         }
//         graph[second].next.push(first);
//     }
//     var stack = [];
//     for (var key in graph) {
//         stack = [+key];
//         if (!graph[key].isVisited && !visit(graph[key].next, stack)) {
//             return false;
//         }
//     }
//     return true;
//     function visit(next, stack) {
//         if (!next || next.length === 0) {
//             return true;
//         }
//         for (var i = next.length - 1; i > -1; i--) {
//             if (stack.indexOf(next[i]) > -1) {
//                 return false;
//             }
//             stack.push(next[i]);
//             if (graph[next[i]] && !graph[next[i]].isVisited) {
//                 if (visit(graph[next[i]].next, stack)) {
//                     stack = [stack[0]];
//                 } else {
//                     return false;
//                 }
//             }
//         }
//         return true;
//     }
// };
