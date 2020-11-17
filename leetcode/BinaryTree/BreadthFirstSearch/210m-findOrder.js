/**
 * @desc 前导课
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findOrder = function (numCourses, prerequisites) {
    var incLinkCounts = new Array(numCourses);
    var adjs = new Array(numCourses);
    initialiseGraph(incLinkCounts, adjs, prerequisites);
    return solveByDFS(adjs);
};

function initialiseGraph(incLinkCounts, adjs, prerequisites){
    var n = incLinkCounts.length;
    while (n-- > 0) adjs.add([]);
    for (var i = prerequisites.length; i--;) {
        var edge = prerequisites[i];
        if (!incLinkCounts[edge[0]]) {
            incLinkCounts[edge[0]] = 0;
        }
        incLinkCounts[edge[0]]++;
        adjs.get(edge[1]).add(edge[0]);
    }
}

function solveByBFS(incLinkCounts, adjs){
    var order = new Array(incLinkCounts.length);
    var toVisit = [];
    for (var i = 0; i < incLinkCounts.length; i++) {
        if (incLinkCounts[i] == 0) toVisit.push(i);
    }
    var visited = 0;
    while (toVisit.length) {
        var from = toVisit.shift();
        order[visited++] = from;
        for (int to : adjs.get(from)) {
            incLinkCounts[to]--;
            if (incLinkCounts[to] == 0) toVisit.push(to);
        }
    }
    return visited == incLinkCounts.length ? order : new int[0]; 
}

findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]);