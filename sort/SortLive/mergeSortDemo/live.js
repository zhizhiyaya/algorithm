(function(){
	var arr = generateRandomArr(8);
	var originalArr = arr.slice();

	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);
	
	console.log('Original array:', originalArr);
	
	// 存储所有需要执行的合并操作
	var mergeOperations = [];
	var currentStep = 0;
	
	// 预先计算所有合并操作
	prepareMergeOperations(0, arr.length - 1);
	
	// 开始执行动画
	executeNextMerge();

	function prepareMergeOperations(first, last) {
		if (first < last) {
			var mid = Math.floor((first + last) / 2);
			prepareMergeOperations(first, mid);
			prepareMergeOperations(mid + 1, last);
			mergeOperations.push({first: first, mid: mid, last: last});
		}
	}

	function executeNextMerge() {
		if (currentStep < mergeOperations.length) {
			var operation = mergeOperations[currentStep];
			console.log('Merging:', operation.first, 'to', operation.mid, 'and', operation.mid + 1, 'to', operation.last);
			
			// 高亮合并范围
			highlightMergeRange(operation.first, operation.mid, operation.last);
			
			setTimeout(function() {
				mergeArrayAnimated(operation.first, operation.mid, operation.last, function() {
					// 合并完成，标记为已合并
					markAsMerged(operation.first, operation.last);
					
					currentStep++;
					setTimeout(executeNextMerge, 1200);
				});
			}, 800);
		} else {
			console.log('Sorted array:', arr);
			// 最终全部标记为已合并
			for (var i = 0; i < domArr.length; i++) {
				domArr[i].className = 'child merged';
			}
		}
	}

	function highlightMergeRange(first, mid, last) {
		// 清除之前的样式
		for (var i = 0; i < domArr.length; i++) {
			if (!domArr[i].className.includes('merged')) {
				domArr[i].className = 'child';
			}
		}
		
		// 高亮合并范围
		for (var i = first; i <= last; i++) {
			if (!domArr[i].className.includes('merged')) {
				domArr[i].className = 'child merging-range';
			}
		}
		
		// 区分左右子数组
		setTimeout(function() {
			for (var i = first; i <= mid; i++) {
				if (!domArr[i].className.includes('merged')) {
					domArr[i].className = 'child left-array';
				}
			}
			for (var i = mid + 1; i <= last; i++) {
				if (!domArr[i].className.includes('merged')) {
					domArr[i].className = 'child right-array';
				}
			}
		}, 500);
	}

	function markAsMerged(first, last) {
		for (var i = first; i <= last; i++) {
			domArr[i].className = 'child merged';
		}
	}

	function mergeArrayAnimated(first, mid, last, callback) {
		var leftArr = [], rightArr = [];
		var i, j, k;
		
		// 复制左右子数组
		for (i = first; i <= mid; i++) {
			leftArr.push(arr[i]);
		}
		for (j = mid + 1; j <= last; j++) {
			rightArr.push(arr[j]);
		}
		
		// 开始合并动画
		i = 0; j = 0; k = first;
		
		function mergeStep() {
			if (i < leftArr.length && j < rightArr.length) {
				// 高亮正在比较的元素
				var leftIndex = findDomIndex(leftArr[i]);
				var rightIndex = findDomIndex(rightArr[j]);
				
				if (leftIndex !== -1) domArr[leftIndex].className = 'child comparing';
				if (rightIndex !== -1) domArr[rightIndex].className = 'child comparing';
				
				setTimeout(function() {
					if (leftArr[i] <= rightArr[j]) {
						// 选择左边的元素
						arr[k] = leftArr[i];
						moveElementToPosition(findDomIndex(leftArr[i]), k, function() {
							i++;
							k++;
							setTimeout(mergeStep, 600);
						});
					} else {
						// 选择右边的元素
						arr[k] = rightArr[j];
						moveElementToPosition(findDomIndex(rightArr[j]), k, function() {
							j++;
							k++;
							setTimeout(mergeStep, 600);
						});
					}
				}, 800);
			} else if (i < leftArr.length) {
				// 处理剩余的左子数组
				arr[k] = leftArr[i];
				moveElementToPosition(findDomIndex(leftArr[i]), k, function() {
					i++;
					k++;
					if (i < leftArr.length) {
						setTimeout(mergeStep, 600);
					} else {
						setTimeout(mergeStep, 600);
					}
				});
			} else if (j < rightArr.length) {
				// 处理剩余的右子数组
				arr[k] = rightArr[j];
				moveElementToPosition(findDomIndex(rightArr[j]), k, function() {
					j++;
					k++;
					if (j < rightArr.length) {
						setTimeout(mergeStep, 600);
					} else {
						callback();
					}
				});
			} else {
				// 合并完成
				callback();
			}
		}
		
		mergeStep();
	}
	
	function findDomIndex(value) {
		for (var i = 0; i < domArr.length; i++) {
			if (parseInt(domArr[i].innerHTML) === value) {
				return i;
			}
		}
		return -1;
	}
	
	function moveElementToPosition(fromIndex, toPosition, callback) {
		if (fromIndex === -1) {
			callback();
			return;
		}
		
		// 计算目标位置
		var targetTop = toPosition * 50;
		
		// 如果已经在正确位置，直接返回
		if (domArr[fromIndex].offsetTop === targetTop) {
			domArr[fromIndex].className = 'child';
			callback();
			return;
		}
		
		// 执行移动动画
		domArr[fromIndex].style.top = targetTop + 'px';
		
		// 更新domArr顺序以保持与视觉位置一致
		var movingElement = domArr[fromIndex];
		domArr.splice(fromIndex, 1);
		domArr.splice(toPosition, 0, movingElement);
		
		setTimeout(function() {
			movingElement.className = 'child';
			callback();
		}, 500);
	}

})();