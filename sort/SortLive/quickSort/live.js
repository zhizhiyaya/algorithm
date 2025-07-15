(function(){
	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var arr = generateRandomArr(8);
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);
	
	var originalArr = arr.slice();
	console.log('Original array:', originalArr);
	
	quickSort(arr, 0, arr.length - 1);
	
	function quickSort(arr, left, right) {
		if (left < right) {
			// 高亮当前处理的子数组范围
			highlightActiveRange(left, right);
			
			partition(arr, left, right, function(pivotIndex) {
				setTimeout(function() {
					// 清除当前范围高亮
					clearActiveRange();
					
					// 递归处理左子数组
					quickSort(arr, left, pivotIndex - 1);
					
					setTimeout(function() {
						// 递归处理右子数组
						quickSort(arr, pivotIndex + 1, right);
					}, 1000);
				}, 1000);
			});
		} else {
			// 清除范围高亮
			clearActiveRange();
			
			// 检查是否整个数组已排序完成
			if (left === 0 && right === arr.length - 1) {
				console.log('Sorted array:', arr);
			}
		}
	}
	
	function highlightActiveRange(left, right) {
		// 首先将所有元素设为非活跃状态
		for (var k = 0; k < domArr.length; k++) {
			if (k < left || k > right) {
				if (!domArr[k].className.includes('placed')) {
					domArr[k].className = 'child inactive';
				}
			} else {
				// 为当前范围内的元素添加边框
				if (!domArr[k].className.includes('placed')) {
					domArr[k].className = 'child active-range';
				}
			}
		}
	}
	
	function clearActiveRange() {
		for (var k = 0; k < domArr.length; k++) {
			if (domArr[k].className.includes('active-range')) {
				domArr[k].className = 'child';
			}
			if (domArr[k].className.includes('inactive')) {
				domArr[k].className = 'child';
			}
		}
	}
	
	function partition(arr, left, right, callback) {
		var pivot = arr[right];
		var i = left - 1;
		var j = left;
		
		// 高亮基准元素
		domArr[right].className = 'child pivot';
		
		console.log('Partitioning from', left, 'to', right, 'with pivot:', pivot);
		
		function processNextElement() {
			if (j < right) {
				// 高亮当前比较的元素
				domArr[j].className = 'child comparing';
				
				setTimeout(function() {
					if (arr[j] < pivot) {
						i++;
						if (i !== j) {
							// 交换数组元素
							var temp = arr[i];
							arr[i] = arr[j];
							arr[j] = temp;
							
							// 高亮交换的元素
							domArr[i].className = 'child light';
							domArr[j].className = 'child light';
							
							// 执行DOM交换
							setTimeout(function() {
								var iTop = domArr[i].offsetTop;
								var jTop = domArr[j].offsetTop;
								
								domArr[i].style.top = jTop + 'px';
								domArr[j].style.top = iTop + 'px';
								
								// 交换domArr中的位置
								var tempDom = domArr[i];
								domArr[i] = domArr[j];
								domArr[j] = tempDom;
								
								setTimeout(function() {
									domArr[i].className = 'child';
									domArr[j].className = 'child';
									j++;
									setTimeout(processNextElement, 600);
								}, 500);
							}, 300);
						} else {
							// 不需要交换，直接继续
							domArr[j].className = 'child';
							j++;
							setTimeout(processNextElement, 600);
						}
					} else {
						// 元素大于等于pivot，恢复颜色
						domArr[j].className = 'child';
						j++;
						setTimeout(processNextElement, 600);
					}
				}, 500);
			} else {
				// 所有元素处理完毕，将基准元素放到正确位置
				var pivotFinalPos = i + 1;
				
				if (pivotFinalPos !== right) {
					var temp = arr[pivotFinalPos];
					arr[pivotFinalPos] = arr[right];
					arr[right] = temp;
					
					// 高亮最终交换
					domArr[pivotFinalPos].className = 'child light';
					domArr[right].className = 'child light';
					
					setTimeout(function() {
						var pivotTop = domArr[pivotFinalPos].offsetTop;
						var rightTop = domArr[right].offsetTop;
						
						domArr[pivotFinalPos].style.top = rightTop + 'px';
						domArr[right].style.top = pivotTop + 'px';
						
						// 交换domArr中的位置
						var tempDom = domArr[pivotFinalPos];
						domArr[pivotFinalPos] = domArr[right];
						domArr[right] = tempDom;
						
						setTimeout(function() {
							// 基准元素已找到正确位置
							domArr[pivotFinalPos].className = 'child placed';
							domArr[right].className = 'child';
							
							callback(pivotFinalPos);
						}, 500);
					}, 300);
				} else {
					// 基准元素已在正确位置
					domArr[pivotFinalPos].className = 'child placed';
					callback(pivotFinalPos);
				}
			}
		}
		
		processNextElement();
	}

})();
