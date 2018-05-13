function generateDomArr(arr, wrapDom) {
	var domArr = [];
	for (var i = 0; i < arr.length; i++) {
		var childElem = document.createElement("div");
		childElem.className = 'child';
		childElem.style.height = arr[i] * 6 + 'px';
		childElem.style.left = i * 50 + 'px';
		childElem.innerHTML = arr[i];
		domArr.push(childElem);
		wrapDom.appendChild(childElem);
	}
	return domArr;
}

function sortDom(domArr, i, j) {
    // 修改 CSS 属性
	var iTop = domArr[i].offsetLeft + 'px';
	domArr[i].style.left = domArr[j].offsetLeft + 'px';
	domArr[j].style.left = iTop;
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
