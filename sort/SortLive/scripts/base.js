function generateRandomArr(length) {
	var arr = [];
	var num = 0;
	for (var i = length; i--; ) {
		num = parseInt(Math.random() * 99 + 1);
		arr.push(num);
	}
	return arr;
}
