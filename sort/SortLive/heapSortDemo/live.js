(function(){
	var arr = generateRandomArr(8);
	var originalArr = arr.slice();
	var len;

	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);
	
	console.log('Original array:', originalArr);
	heapSort();

	function heapSort() {
		var step = 0;
		var phase = 'building'; // 'building' or 'sorting'
		var buildIndex = Math.floor(arr.length / 2) - 1;
		var sortIndex = arr.length - 1;
		
		len = arr.length;
		
		var time = setInterval(function() {
			if (phase === 'building') {
				if (buildIndex >= 0) {
					heapify(buildIndex);
					buildIndex--;
				} else {
					phase = 'sorting';
				}
			} else if (phase === 'sorting') {
				if (sortIndex > 0) {
					// 将堆顶（最大值）与当前末尾交换
					swap(0, sortIndex);
					len--;
					sortIndex--;
					// 重新调整堆
					heapify(0);
				} else {
					console.log('Sorted array:', arr);
					clearInterval(time);
					return;
				}
			}
		}, 1500);
	}

	function heapify(i) {
		var left = 2 * i + 1;
		var right = 2 * i + 2;
		var largest = i;

		if (left < len && arr[left] > arr[largest]) {
			largest = left;
		}

		if (right < len && arr[right] > arr[largest]) {
			largest = right;
		}

		if (largest !== i) {
			swap(i, largest);
			// 递归调整受影响的子树
			setTimeout(function() {
				heapify(largest);
			}, 800);
		}
	}

	function swap(i, j) {
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
		
		if (sortDom) {
			sortDom(domArr, i, j);
		}
	}

})();