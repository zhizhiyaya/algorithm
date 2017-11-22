(function(){
	var arr = [19, 38, 11, 22, 44, 67, 55, 96];
	var domArr = getDomArr(arr);


	function getDomArr(arr) {
		var parentElem = document.createElement("div");
		parentElem.id = 'boxes';
		for (var i = 0; i < arr.length; i++) {
			var childElem = document.createElement("div");
			childElem.className = 'child';
			childElem.style.left = 0;
			childElem.style.width = arr[i] * 4 + 'px';
			childElem.style.top = i * 50 + 'px';
			parentElem.appendChild(childElem);
		}
		document.body.appendChild(parentElem);
		return domArr;
	}
	function sort(){
		debugger
		var numbers = random();
		var parentElem = document.getElementById("boxes");
		var i = 0, j = 0;
		var time = setInterval(function() {
			if (i < numbers.length) {
				if (j < numbers.length - i) {
					if (numbers[j] > numbers[j + 1]) {
						var temp = numbers[j];
						numbers[j] = numbers[j + 1];
						numbers[j + 1] = temp;
						parentElem.innerHTML = "";
						for (var k = 0; k < numbers.length; k++) {
							var textNode = document.createTextNode(numbers[k]);
							var childElem = document.createElement("div");
							childElem.appendChild(textNode);
							childElem.style.left = k * 20 + k * 2 + "px";
							childElem.style.top = 300 - 3 * numbers[k] + "px";
							childElem.style.height = 3 * numbers[k] + "px";
							childElem.setAttribute("class","box");
							parentElem.appendChild(childElem);
						}
					}
					j++;
				}
				else{
					i++;
					j = 0;
				}
			}
			else {
				clearInterval(time);
				return;
			}
		}, 100);
	}
	sort();
})();
