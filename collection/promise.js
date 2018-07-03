/**
 * @desc 符合 Promise/A
 *  支持链式调用 then
 *
 *
 **/

// ES5 基于原型的实现
function Promise(executor) {
    this.status = 'pending';
    this.queue = [];
    this.isPromise = true;
    if (isFunction(executor)) {
        executor.call(this, this.resolve, this.reject);
    }
}

var fn = Promise.prototype;

fn.setFinalStatus = function setFinalStatus(status) {
    this.status = status;
    return this;
}

fn.then = function then(onFulfilled, onRejected) {
    var isFnForDone = isFunction(onFulfilled);
    var isFnForFail = isFunction(onRejected);
    if (isFnForDone || isFnForFail) {
        switch (this.status) {
            case 'pending':
                var obj = {};
                if (isFnForDone) {
                    obj.onFulfilled = onFulfilled;
                }
                if (isFnForFail) {
                    obj.onRejected = onRejected;
                }
                this.queue.push(obj);
                break;
            case 'fulfilled':
                onFulfilled();
                break;
            case 'rejected':
                onRejected();
                break;
            default:
                break;
        }
    }
    return this;
}

fn.resolve = function resolve() {
    var next,
        nextDone,
        args,
        ret;

    next = this.queue.shift();
    // if (next && this.status === '')
};

fn.reject = function resolve() {
    var next,
        nextDone,
        args,
        ret;

    next = this.queue.shift();
    if (next && this.status === '')
};

function toString(obj) {
	return Object.prototype.toString.call(obj);
}

function isFunction(obj) {
	return toString(obj) === 'object Function';
}
