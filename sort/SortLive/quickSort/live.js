(function(){
	var parentElem = document.createElement("div");
	parentElem.id = 'boxes';
	var arr = generateRandomArr(16);
	var domArr = generateDomArr(arr, parentElem);
	document.body.appendChild(parentElem);



})();
