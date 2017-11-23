(function(){
	var arr = generateRandomArr(16);
	var parentElem = getDomArr(arr);
	document.body.appendChild(parentElem);
	sort();

	function generateRandomArr(length) {
		var arr = [];
		var num = 0;
		for (var i = length - 1; i--; ) {
			num = parseInt(Math.random() * 100);
			arr.push(num);
		}
		return arr;
	}

	function getDomArr(arr) {
		var parentElem = document.createElement("div");
		parentElem.id = 'boxes';
		for (var i = 0; i < arr.length; i++) {
			var childElem = document.createElement("div");
			childElem.className = 'child';
			childElem.style.left = 0;
			childElem.style.width = arr[i] * 4 + 'px';
			childElem.style.top = i * 50 + 'px';
			childElem.innerHTML = arr[i];
			parentElem.appendChild(childElem);
		}
		return parentElem;
	}
	function sort(){
		var parentElem = document.getElementById("boxes");
		var i = 0, j = 0;
		var time = setInterval(function() {
			if (i < arr.length) {
				if (j < arr.length - i) {
					if (arr[j] > arr[j + 1]) {
						var temp = arr[j];
						arr[j] = arr[j + 1];
						arr[j + 1] = temp;
						var cloneParent = getDomArr(arr);
						parentElem.innerHTML = cloneParent.innerHTML;
					}
					j++;
				} else{
					i++;
					j = 0;
				}
			} else {
				clearInterval(time);
				return;
			}
		}, 400);
	}

})();
