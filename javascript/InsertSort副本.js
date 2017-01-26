function InfiniteArr(car, Fn) {
	
	this.initValue = car;

	this.getItem = function(index) {

		return ff.call(this, index, Fn);
	}
}


function ff (index, Fn) {
	if (index === 0) {
		return this.initValue;
	}

	return ff(index-1, Fn(index - 1));
}