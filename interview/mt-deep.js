function deep(root) {
    if(!root) {
        return 0;
    }
    return getLeafDeep(root, 1)
}

function getLeafDeep(node, deep) {
    if (!node.left && !node.right) {
        return deep;
    }
    var min = Number.MAX_SAFE_INTEGER;
    if (node.left) {
        min = Math.min(getLeafDeep(node.left, deep + 1), min);
    }
    if (node.right) {
        min = Math.min(getLeafDeep(node.right, deep + 1), min);
    }
    return min;
}
var root = {
    val: 0,
    left: {
        val: 1,
        left: {
            val: 2
        },
        right: {
            val: 3
        }
    },
    right: {
        val: 4
    }
};
console.log(deep(root));