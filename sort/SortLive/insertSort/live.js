(function(){
	var sourElem = document.getElementById("sourceDom");
	var arr = generateRandomArr(6);
	// var arr = [76, 56, 56, 39, 99, 52];
	var domArr = generateDomArr(arr, sourElem);
	binInsertSort(arr);

	function binInsertSort(arr, n) {
		var timer = null;
		var cur = null;
		var left = 0;
		var right = 0;
		var mid = 0;
		n = n || arr.length;
		var i = 1;
		domArr[0].className = 'child light';
		timer = setTimeout(_insertSort, 1200);
		function _insertSort() {
			if (i < n) {
				cur = arr[i];
				domArr[i].className = 'child light';
				if (arr[i] < arr[i - 1]) { // 当前元素 比 有序区最大的小时才需要调整，否则不需要
					left = 0;
					right = i - 1;
					while (left < right) {
						mid = Math.ceil((left + right) / 2);
						if (arr[mid] > cur) {
							right = mid - 1;
						} else {
							left = mid;
						}
					}
					if (arr[left] < cur) {
						left++;
					}
					arr.splice(i, 1);
					arr.splice(left, 0, cur);
					domArr[left].before(domArr[i]);
					(function(i) {
						setTimeout(function() {
							var removeDom = domArr.splice(i, 1);
							domArr.splice(left, 0, removeDom[0]);
						}, 50)
					})(i);
				}
				i++;
				setTimeout(_insertSort, 1200);
			} else {
				clearTimeout(timer);
			}
		}
	}

	function generateDomArr(arr, wrapDom) {
		var domArr = [];
		for (var i = 0; i < arr.length; i++) {
			var childElem = document.createElement("div");
			childElem.className = 'child';
			childElem.style.height = arr[i] * 2 + 'px';
			childElem.innerHTML = arr[i];
			domArr.push(childElem);
			wrapDom.appendChild(childElem);
		}
		return domArr;
	}
})();
