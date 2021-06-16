/**
 * node {
 *      id: string, 
 *      score: null || num,
 *      children: [] || null
 * }
 */
/**
 * 查找平均分前三的 team 
 */
/**
 *       英语
        /   \
 * 北京英语  上海英语
             /   \
 *        老师A  黄浦区Team
                 /   |   \
               老师B 老师C 老师D
 */


function find(root) {
    if (!root) {
        return [];
    }
    var topThree = [];
    root = setNodeProps(root, topThree);
    return {topThree, root};
}

function setNodeProps(node, topThree) {
    if (!node.children) {
        var node = {
            ...node,
            averScore: node.score,
            nodeSum: 1
        };
        setTopThree(topThree, node);
        return node;
    }
    let averScore = 0;
    const child = node.children;
    const childLength = child.length;
    for (var i = childLength; i--; ) {
        child[i] = this.setNodeProps(child[i], topThree);
        averScore += child[i].averScore / childLength;
        
    }
    var node = {
        ...node,
        averScore,
        nodeSum: childLength
    };
    setTopThree(topThree, node);
    return node;
}
function setTopThree(topThree, node) {
    if (topThree.length < 3) {
        topThree.push(node);
    } else if (node.averScore > topThree[topThree.length - 1].averScore) {
        topThree.splice(2, 1, node);
    }
    topThree = topThree.sort((a, b) => b.averScore - a.averScore);
    return topThree;
}
var root = {
    id: 1,
    children: [{
        id: 2,
        score: 90,
        children: null
    }, {
        id: 7,
        score: 85,
        children: null
    }, {
        id: 3,
        children: [{
            id: 4,
            score: 90,
            children: null
        }, {
            id: 5,
            score: 80,
            children: null
        }, {
            id: 6,
            score: 70,
            children: null
        }]
    }]
};
// output
// root: {id: 1, children: Array(3), averScore: 85, nodeSum: 3}
// topThree: Array(3)
// 0: {id: 4, score: 90, children: null, averScore: 90, nodeSum: 1}
// 1: {id: 2, score: 90, children: null, averScore: 90, nodeSum: 1}
// 2: {id: 7, score: 85, children: null, averScore: 85, nodeSum: 1}

