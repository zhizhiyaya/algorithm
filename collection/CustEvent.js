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
	on: function(name, callback, context) {
		this.events = this.events || {};
		this.events[name] = this.events[name] || [];
		var events = this.events[name];
		events.push({
			callback: callback,
			context: context,
			ctx: context || this
		});
		return this;
	},
	once: function(name, callback, context) {
		var me = this;
		var _once = once(function() {
			self.off(name, _once);
			callback.apply(this, arguments);
		});
		once._callback = callback;
		return this.on(name, once, context);
	},
	off: function(name, callback, context) {
		if (!this.events) return this;
		var retain,
			evt,
			events,
			names,
			i, l, j, k;
		if (!name && !callback && !context) {
			this.events = null;
			return this;
		}
		names = name ? [name] : Object.keys(this.events);
		names.forEach((name, index) => {
			events = this.events[name];
			if (events) {
				this.events[name] = retain = [];
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
				if (!retain.length) delete this.events[name];
			}
		});
		return this;
	},
	trigger: function(name) {
		if (!this.events) return this;
		var args = Array.prototype.slice.call(arguments, 1),
			events = this.events[name],
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
