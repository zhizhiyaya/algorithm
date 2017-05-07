// /**
//  * 实现一个isEqual函数
//  * @param x 一个变量
//  * @param y 另一个变量
//  * @return Boolean 是否相等的变量
//  * Tips: 考虑尽可能多的情况
//  */

var eq = function(a, b) {

	if (a === b) return true; // 0 -0 实际不等，1 / 0 正无穷， － 1/0 负无穷
	if (a == null || b == null) return a === b; // null == undefined

	var className = toString(a);
	if (className !== toString(b)) return false;
	switch (className) {
	  	case '[object Function]':
	  		return a.toString() === b.toString();
		case '[object RegExp]':
		case '[object String]':
	  		return '' + a === '' + b;
		case '[object Number]':
			if (+a !== +a) return +b !== +b; // NaN
	  		return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		case '[object Date]':
		case '[object Boolean]':
	  		return +a === +b;
	}

	if (typeof a != 'object' || typeof b != 'object') return false;

	var size, result;
	// 比较数组和对象
	if (className === '[object Array]') {
		size = a.length;
		result = size === b.length; // 数组长度相同是再继续 递归深diff
		if (result) {
			while (size--) {
			    if (!(result = eq(a[size], b[size]))) break;
		  	}
		}
	} else {
		// 对象转换成数组，比较长度，不同再递归深diff
		var keys = Object.keys(a), key;
		size = keys.length;
		result = Object.keys(b).length === size;
		if (result) {
			while (size--) {
				key = keys[size];
				if (!(result = b.hasOwnProperty(key) && eq(a[key], b[key]))) break;
			}
		}
	}
	return result;
};

function toString(obj) {
	return Object.prototype.toString.call(obj);
}
