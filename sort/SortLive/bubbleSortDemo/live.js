(function(){
	var arr = generateRandomArr(3);

	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);
	sort();

	function sort(){
		var parentElem = document.getElementById("boxes");
		var i = 0, j = 0;
		var time = setInterval(function() {
			if (i < arr.length) {
				if (j < arr.length - i) {
					if (arr[j] < arr[j + 1]) {
						var temp = arr[j];
						arr[j] = arr[j + 1];
						arr[j + 1] = temp;
						sortDom && sortDom(domArr, j, j+1);
					}
					j++;
				} else{
					i++;
					j = 0;
				}
			} else {
				console.log(arr);
				clearInterval(time);
				return;
			}
		}, 1200);
	}

})();
