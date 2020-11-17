/**
 * @param {number[][]} heightMap
 * @return {number}
 */
var trapRainWater = function (heightMap) {
    if (!heightMap.length || !heightMap[0]) {
        return 0;
    }
    var m = heightMap.length;
    var n = heightMap[0].length;
    var res = 0;
    var mx = 0;
    var q = new PriorityQueue();
    var visited = [];

    for (let i = 0; i < m; ++i) {
        if (!visited[i]) {
            visited[i] = new Array(n);
        }
        for (let j = 0; j < n; ++j) {
            if (i === 0 || i === m - 1 || j === 0 || j === n - 1) { // 边界
                q.push(i * n + j, heightMap[i][j]); // 以高度为优先级
                visited[i][j] = true;
            }
        }
    }

    var dir = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // 上下左右索引操作
    while (!q.isEmpty()) {
        const t = q.shift();
        const h = t.priority;
        const r = Math.floor(t.element / n);
        const c = Math.floor(t.element % n);

        mx = Math.max(mx, h);
        for (let i = 0; i < dir.length; ++i) {
            const x = r + dir[i][0];
            const y = c + dir[i][1];

            if (x < 0 || x >= m || y < 0 || y >= n || visited[x][y]) {
                continue;
            }

            visited[x][y] = true;
            if (heightMap[x][y] < mx) {
                res += mx - heightMap[x][y];
            }
            q.push(x * n + y, heightMap[x][y]);
        }
    }
    return res;
};

// 优先级队列
function PriorityQueue() {
    this.queue = [];
    this.push = function (element, priority) {
        // 需要插入队列的元素
        var queueElement = {
            element,
            priority
        };
        if (this.isEmpty()) {
            this.queue.push(queueElement);
        } else {
            for (var i = 0; i < this.queue.length; i++) {
                if (queueElement.priority < this.queue[i].priority) {
                    break;
                }
            }
            this.queue.splice(i, 0, queueElement);
        }
    };
    this.shift = function () {
        return this.queue.shift();
    };
    this.isEmpty = function () {
        return !this.queue.length;
    };
}
