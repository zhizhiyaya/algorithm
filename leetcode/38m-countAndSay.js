/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function(n) {
	if (n == 1) {
		return '1';
	}
	var obj = {};
	n += '';
	var len = n.length;
	for(var i = 0; i < len; i++) {
		if (!obj[n[i]]) {
			obj[n[i]] = 1;
		} else {
			obj[n[i]]++;
		}
	}
	var key = '';
	var res = '';
	for(key in obj) {
		if (obj.hasOwnProperty(key)) {
			res += obj[key] + key;
		}
	}
	return res;
};
console.log(countAndSay(1));
