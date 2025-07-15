(function(){
	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var arr = generateRandomArr(8);
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);

	var i = 0;
	var length = arr.length;
	var originalArr = arr.slice();
	
	console.log('Original array:', originalArr);
	
	selectionSort();

	function selectionSort() {
		if (i < length - 1) {
			// 标记已排序区域
			markSortedArea();
			
			// 开始寻找最小元素
			setTimeout(function() {
				findMinimumElement();
			}, 800);
		} else {
			// 排序完成，标记最后一个元素
			domArr[length - 1].className = 'child sorted';
			console.log('Sorted array:', arr);
		}
	}

	function markSortedArea() {
		// 标记已排序的区域为蓝色
		for (var k = 0; k < i; k++) {
			domArr[k].className = 'child sorted';
		}
	}

	function findMinimumElement() {
		var minIndex = i;
		var j = i + 1;
		
		// 高亮当前最小元素候选
		domArr[minIndex].className = 'child minimum';
		
		function searchNext() {
			if (j < length) {
				// 高亮当前正在检查的元素
				domArr[j].className = 'child searching';
				
				setTimeout(function() {
					if (arr[j] < arr[minIndex]) {
						// 找到更小的元素，更新最小元素
						domArr[minIndex].className = 'child';
						minIndex = j;
						domArr[minIndex].className = 'child minimum';
					} else {
						// 恢复原色
						domArr[j].className = 'child';
					}
					
					j++;
					setTimeout(searchNext, 600);
				}, 400);
			} else {
				// 搜索完毕，执行交换
				setTimeout(function() {
					swapElements(i, minIndex);
				}, 400);
			}
		}
		
		searchNext();
	}

	function swapElements(pos1, pos2) {
		if (pos1 !== pos2) {
			// 交换数组中的数据
			var temp = arr[pos1];
			arr[pos1] = arr[pos2];
			arr[pos2] = temp;
			
			// 高亮要交换的元素
			domArr[pos1].className = 'child light';
			domArr[pos2].className = 'child light';
			
			// 执行DOM交换动画
			setTimeout(function() {
				var pos1Top = domArr[pos1].offsetTop;
				var pos2Top = domArr[pos2].offsetTop;
				
				domArr[pos1].style.top = pos2Top + 'px';
				domArr[pos2].style.top = pos1Top + 'px';
				
				// 交换domArr中的位置
				var tempDom = domArr[pos1];
				domArr[pos1] = domArr[pos2];
				domArr[pos2] = tempDom;
				
				setTimeout(function() {
					// 恢复颜色
					domArr[pos1].className = 'child';
					domArr[pos2].className = 'child';
					
					// 继续下一轮
					i++;
					setTimeout(selectionSort, 800);
				}, 500);
			}, 200);
		} else {
			// 不需要交换，直接继续
			domArr[pos1].className = 'child';
			i++;
			setTimeout(selectionSort, 800);
		}
	}

})();
