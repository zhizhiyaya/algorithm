function once(func) {
	var run = false,
		memo;
	return function() {
		if (run) return memo;
		run = true;
		memo = func.apply(this, arguments);
		func = null;
		return memo;
	}
}
function triggerEvents(events, args) {
	var evt,
		i = -1,
		l = events.length,
		ret = 1;
	while (++i < l && ret) {
		evt = events[i];
		ret &= (evt.callback.apply(evt.ctx, args) !== false);
	}
	return !!ret;
}

var CustEvent = {
	events: {},
	on: function(event, callback, context) {
		this.events[event] = this.events[event] || [];
		var events = this.events[event];
		events.push({
			callback: callback,
			context: context,
			ctx: context || this
		});
		return this;
	},
	once: function(event, callback, context) {
		var me = this;
		function on () {
			me.off(event, on);
			callback.apply(me, arguments)
		}
		on.callback = callback
		return this.on(event, on, context);
	},
	off: function(event, callback, context) {
		if (!this.events) return this;
		var retain,
			evt,
			events,
			events,
			i, l, j, k;
		if (!event && !callback && !context) {
			this.events = null;
			return this;
		}
		events = event ? [event] : Object.keys(this.events);
		events.forEach((event, index) => {
			events = this.events[event];
			if (events) {
				this.events[event] = retain = [];
				if (callback || context) {
					events.forEach(() => {
						evt = events[j];
						if (
							(callback && callback !== evt.callback) ||
							(context && context !== evt.context)
						) {
							retain.push(evt);
						}
					});
				}
				if (!retain.length) delete this.events[event];
			}
		});
		return this;
	},
	trigger: function(event) {
		if (!this.events) return this;
		var args = Array.prototype.slice.call(arguments, 1),
			events = this.events[event],
			allEvents = this.events.all,
			ret = 1;
		if (events) {
   			 ret &= triggerEvents(events, args);
   		 }
   		 if (allEvents && ret) {
   			 ret &= triggerEvents(allEvents, args);
   		 }
   		 return !!ret;
	}
};

// exports CustEvent;
