function generateDomArr(arr, wrapDom) {
	var domArr = [];
	for (var i = 0; i < arr.length; i++) {
		var childElem = document.createElement("div");
		childElem.className = 'child';
		childElem.style.left = 0;
		childElem.style.width = arr[i] * 4 + 'px';
		childElem.style.top = i * 50 + 'px';
		childElem.innerHTML = arr[i];
		domArr.push(childElem);
		wrapDom.appendChild(childElem);
	}
	return domArr;
}

function sortDom(domArr, i, j) {
    // 修改 CSS 属性
	var iTop = domArr[i].offsetTop + 'px';
	domArr[i].style.top = domArr[j].offsetTop + 'px';
	domArr[j].style.top = iTop;
	domArr[i].className = 'child light';
	domArr[j].className = 'child light';
	setTimeout(function() {
		domArr[i].className = 'child';
		domArr[j].className = 'child';
	}, 500);
	// 交换在 domArr 中的位置，和 数据 arr 保持同步
	var iDom = domArr[i];
	domArr[i] = domArr[j];
	domArr[j] = iDom;
}

// function generateDomArrParent(arr) {
// 	var parentElem = document.createElement("div");
// 	parentElem.id = 'boxes';
// 	for (var i = 0; i < arr.length; i++) {
// 		var childElem = document.createElement("div");
// 		childElem.className = 'child';
// 		childElem.style.left = 0;
// 		childElem.style.width = arr[i] * 4 + 'px';
// 		childElem.style.top = i * 50 + 'px';
// 		childElem.innerHTML = arr[i];
// 		parentElem.appendChild(childElem);
// 	}
// 	return parentElem;
// }
