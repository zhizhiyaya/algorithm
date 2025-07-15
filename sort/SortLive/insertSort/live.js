(function(){
	var arr = generateRandomArr(8);
	var originalArr = arr.slice();
	
	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);
	
	console.log('Original array:', originalArr);
	
	insertSort(arr);

	function insertSort(arr) {
		var n = arr.length;
		var i = 1;
		
		// 第一个元素默认为已排序
		domArr[0].className = 'child light';
		
		setTimeout(function() {
			domArr[0].className = 'child';
			insertNextElement();
		}, 800);
		
		function insertNextElement() {
			if (i < n) {
				var current = arr[i];
				var currentDom = domArr[i];
				
				// 高亮当前要插入的元素
				currentDom.className = 'child light';
				
				setTimeout(function() {
					// 找到插入位置
					var insertPos = findInsertPosition(current, i);
					
					if (insertPos < i) {
						// 需要移动元素
						animateInsert(i, insertPos, function() {
							// 继续下一个元素
							i++;
							setTimeout(insertNextElement, 800);
						});
					} else {
						// 不需要移动，直接取消高亮
						currentDom.className = 'child';
						i++;
						setTimeout(insertNextElement, 800);
					}
				}, 600);
			} else {
				console.log('Sorted array:', arr);
			}
		}
		
		function findInsertPosition(value, currentIndex) {
			var left = 0;
			var right = currentIndex - 1;
			
			// 二分查找插入位置
			while (left <= right) {
				var mid = Math.floor((left + right) / 2);
				if (arr[mid] > value) {
					right = mid - 1;
				} else {
					left = mid + 1;
				}
			}
			
			return left;
		}
		
		function animateInsert(fromIndex, toIndex, callback) {
			// 保存要移动的元素
			var movingValue = arr[fromIndex];
			var movingDom = domArr[fromIndex];
			
			// 移动数组中的元素
			for (var j = fromIndex; j > toIndex; j--) {
				arr[j] = arr[j - 1];
			}
			arr[toIndex] = movingValue;
			
			// 动画移动DOM元素
			var steps = fromIndex - toIndex;
			var currentStep = 0;
			
			function moveStep() {
				if (currentStep < steps) {
					var targetIndex = fromIndex - currentStep - 1;
					var targetTop = domArr[targetIndex].offsetTop;
					
					// 移动当前元素到目标位置
					domArr[fromIndex - currentStep].style.top = targetTop + 'px';
					domArr[targetIndex].style.top = (targetTop + 50) + 'px';
					
					// 交换domArr中的位置
					var tempDom = domArr[fromIndex - currentStep];
					domArr[fromIndex - currentStep] = domArr[targetIndex];
					domArr[targetIndex] = tempDom;
					
					currentStep++;
					setTimeout(moveStep, 400);
				} else {
					// 移动完成，取消高亮
					movingDom.className = 'child';
					callback();
				}
			}
			
			moveStep();
		}
	}
})();
