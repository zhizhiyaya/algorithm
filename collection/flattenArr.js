/**
 * @method 使深嵌套的数组扁平化
 * @param {Array} arr 数组
 * @return {Array} arr
 **/
function flattenArr(arr, temp) {

	for (var i = 0, len = arr.length; i < len; i++) {
		if (Array.isArray(arr[i])) {
			flattenArr(arr[i], temp);
		} else {
			temp.push(arr[i])
		}
	}
	return temp;

	// for (var i = arr.length - 1; i >= 0; i--) {
	// 	if (Array.isArray(arr[i])) {
	// 		flattenArr(arr[i]);
	// 	} else {
	// 		a.push(arr[i])
	// 	}
	// }
	// return temp;

	// return arr.reduce((a, b) => {
	// 	[].concat(
	// 		Array.isArray(a) && a ? flattenArr(a) : a,
	// 		Array.isArray(b) && b ? flattenArr(b) : b,
	// 		[]);
	// });

	// return [].concat(...arr);
	// return Array.prototype.concat.apply([], arr);
}

console.log(flattenArr(['c', ['a', 'b', ['a', 'b', ['a', 'b', ['a', 'b', ]]]]], []));
