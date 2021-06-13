/**
 * Definition for undirected graph.
 * function UndirectedGraphNode(label) {
 *     this.label = label;
 *     this.neighbors = [];   // Array of UndirectedGraphNode
 * }
 */

/**
 * @param {UndirectedGraphNode} graph
 * @return {UndirectedGraphNode}
 */
var cloneGraph = function(graph) {
    var map = {};
    var clone = {};
    cloneNode(graph, map, clone);
};
function cloneNode(node, map, clone) {
    if (node == null) {
        return null;
    }
    var label = node.label;
    if (map[label]) {
        return map[label];
    }
    clone.label = label;
    map[label] = label;
    for (var i = node.neighbors.length; i > -1; i--) {
        clone.neighbors.push(cloneNode(node.neighbors[i]));
    }
    return clone;
}
