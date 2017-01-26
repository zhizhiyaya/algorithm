function infiniteArr(car, Fn) {
	
	this.initValue = car;

	this.getItem = function(index) {

		return (Fn(me, i) {

			if (index === 0) {
				return me.initValue;
			}
			return Fn(me, index - 1);
		})(this, index);
	}
}