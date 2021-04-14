/**
 * @method Map实现
 * @param {number} capacity
 */
 var LRUCache = function(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (this.cache.has(key)) {
        let val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }
    // 找不到返回-1
    return -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    // key已经存在
    if (this.cache.has(key)) {
        // 提升 - 先删掉
        this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
        // 若已经到达最大限制，先淘汰一个最久没有使用的(队头)
        // this.cache.keys()每次会返回一个新的Iterator, next()指向map第一个元素
        this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */




/**
 * @method 数组模拟队列实现
 * @param {number} capacity
 */
 var LRUCache = function(capacity) {
    this.cache = new Array();
    this.capacity = capacity;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (this.cache.length === 0) {
        return -1;
    }
    let length = this.cache.length;
    const cache = this.cache;
    for(let i = length; i--; ) {
        if (cache[i] && cache[i].key === key) { // 有缓存, 提升优先级，放队尾
            const cur = cache.splice(i, 1);
            cache.push(cur[0]);
            this.cache = cache;
            return cur[0].value;
        }
    }
    return -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    const cache = this.cache;
    let length = cache.length;
    let matchIndex = -1;
    for(let i = length; i--; ) {
        if (cache[i] && cache[i].key === key) {
            matchIndex = i;
            break;
        }
    }
    if (matchIndex > -1) { // 已有缓存，用新数据覆盖，并放到队尾
        cache.splice(matchIndex, 1);
    } else if (length >= this.capacity) { // 无缓存，缓存已满，队头出队。缓存未满直接存储
        cache.shift();
    }
    cache.push({
        key,
        value
    });
    this.cache = cache;
};


/**
 * @ !!!!!  TLE 了 .....
 * @method 数组 + hashMap
 * @param {number} capacity
 */
 var LRUCache = function(capacity) {
    this.cache = new Array();
    this.capacity = capacity;
    this.map = {};
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    const cache = this.cache;
    if (this.cache.length === 0) {
        return -1;
    }
    if (this.map[key] > -1) { // 有缓存, 提升优先级，放队尾
        const curIndex = this.map[key];
        const prioItem = cache.splice(curIndex, 1);
        cache.push(prioItem[0]);
        this.cache = cache;
        for (let i = curIndex; i < cache.length; i++) {
            this.map[cache[i].key] = i;
        }
        return prioItem[0].value;
    }
    return -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    const cache = this.cache;
    let length = cache.length;
    let matchIndex = -1;
    // 换成 map ， key: index 可省个遍历
    if (this.map[key] > -1) {
        matchIndex = this.map[key];
    }
    if (matchIndex > -1) { // 已有缓存，用新数据覆盖，并放到队尾
        cache.splice(matchIndex, 1);
    } else if (length >= this.capacity) { // 无缓存，缓存已满，队头出队。缓存未满直接存储
        cache.shift();
    }
    cache.push({
        key,
        value
    });
    this.map = {};
    cache.forEach((i, index)=> {
        this.map[key] = index;
    });
    this.cache = cache;
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// ["LRUCache","put","put","get","put","get","put","get","get","get"]
var a = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
var lruIns = new LRUCache(2);
var b = a.map(i => {
    switch(i.length) {
        case 1: 
            return lruIns.get(i[0]);
        case 2: 
            lruIns.put(i[0], i[1]);
            return null;
    }
})
// Output
// [null, null, null, 1, null, -1, null, -1, 3, 4]
//  [-1, null, null, -1, null, 3, null, -1, 4, 4]
