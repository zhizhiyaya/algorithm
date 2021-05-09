/**
 * @method 使深嵌套的数组扁平化
 * @param {Array} arr 数组
 * @return {Array} arr
 **/
function flattenArr(arr) {
	return arr.reduce((a, cur) => {
		return a.concat(Array.isArray(cur) ? flattenArr(cur) : cur);
	}, []);
}

function* iterTree(tree) {
	if (Array.isArray(tree)) {
		for(let i=0; i < tree.length; i++) {
			yield* iterTree(tree[i]); // 还是递归了
		}
	} else {
		yield tree;
	}
}

function flattenArr() {
	return [...iterTree(arr)];
}


function flattenArr(arr, temp) {
	var temp = arguments[1] || [];
	for (var i = 0, len = arr.length; i < len; i++) {
		if (Array.isArray(arr[i])) {
			flattenArr(arr[i], temp);
		} else {
			temp.push(arr[i])
		}
	}
	return temp;
}
// 浅拷贝
// function flattenArr(arr) {
	// return [].concat(...arr);
	// return Array.prototype.concat.apply([], arr);
// }
var arr = ['c', ['a', 'b', ['a', 'b', ['a', 'b', ['a', 'b', ]]]]];
flattenArr(arr, []);
// ["c", "a", "b", "a", "b", "a", "b", "a", "b"]
