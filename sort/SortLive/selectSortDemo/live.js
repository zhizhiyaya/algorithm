(function(){
	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var arr = generateRandomArr(16);
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);

	var i = 0, j = 0;
	var length = arr.length;
	var minIndex = 0;
	var timer = null;
	sort();

	function sort(){
		timer = setTimeout(function() {
			if (i < length) {
				sortDataAndDom(sortDom, parentElem);
				sort();
				return;
			}
			console.log(arr);
			clearTimeout(timer);
		}, 1200);
	}

	function sortDataAndDom(sortDom, parentElem) {
		if (i < length) {
			minIndex = i;
			//找最小元素的位置
			for (j = i + 1; j < length; j++) {
				if (arr[j] < arr[minIndex]) {
					minIndex = j;
				}
			}
			//将这个元素放到无序区的开头
			if (minIndex !== i) {
				mid = arr[i];
				arr[i] = arr[minIndex];
				arr[minIndex] = mid;
				sortDom && sortDom(domArr, i, minIndex);
			}
			i++;
		}
		return;
	}

})();
