/**
 * @method 异步串行, 因为是串行，其中一个阻塞掉后面就无法执行了，
 *			比方一个 Promise 没有 resolve 或 reject 这种终态，后面的就不会执行了
 * 			所以 ，一定要有终态
 * 			暂不支持动态添加
 * @param {Array<Promise>} list Promise 列表
 * @param {Array<String>} keys 结果映射
 * @return {Promise} 异步对象
 */
 export function queue(list, keys) {

	 return new Promise(function(resolve, reject){
		 var queue = list.slice(0),
			 ret = [],
			 index = -1,
			 next = function () {
				 index++;
				 var pro = queue.shift();
				 if (pro) { // 任务队列是否还有未做的任务
					 if (isFunction(pro)) { // 未做的任务是否是 Fn
						 var p = pro(ret[index - 1], ret);
						 if (p && isFunction(p.then)) { // pro 返回对象是否是 Promise 对象
							 p.then((data) => {
								 ret[index] = data;
								 next();
							 }, (data) => {
								 ret[index] = data;
								 next();
							 });
						 } else {
							 ret[index] = p;
							 next();
						 }
					 } else {
						 ret[index] = pro;
						 next();
					 }
				 } else {
					if (keys && keys.length) {
						ret = _associate(ret, keys);
					}
					 resolve.call(null, ret);
				 }
			 };
			 next();
	 });
 };

export function _associate(arrVal, arrKey) {
    var obj = {}, i = 0;
    for (; i < arrKey.length; i++) {
        obj[arrKey[i]] = arrVal[i];
    }
    return obj;
}

function isFunction (fn) {
	return typeof fn === 'function';
}
