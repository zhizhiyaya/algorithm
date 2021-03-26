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
    this.parentPromise = null;
    if (isFunction(executor)) {
        executor.call(this, this.resolve, this.reject);
    }
}

var fn = Promise.prototype;

fn.setFinalStatus = function setFinalStatus(status) {
    var rootPromise = this;
    while (rootPromise.parentPromise) {
        rootPromise = rootPromise.parentPromise;
    }
    this.status = status;
    rootPromise.status = status;

    return rootPromise;
}

fn.then = function then(onFulfilled, onRejected) {
    var isFnForDone = isFunction(onFulfilled);
    var isFnForFail = isFunction(onRejected);
    if (isFnForDone || isFnForFail) {
        switch (this.status) {
            case 'pending':
                this.queue.push({
                    onFulfilled,
                    onRejected
                });
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
        args
        ret;
    args = Array.prototype.slice.call(arguments).concat(this);
    if (this.status === 'pending') {
        next = this.queue.shift();
        while(next && next.onFulfilled) {
            try {
                args = next.onFulfilled(args);
                if (args && args.isPromise) {
                    args.queue = args.queue.concat(this.queue);
                    args.parentPromise = this; 
                    return;
                }
            } catch(e) {
                this.reject(e);
            }
            next = this.queue.shift();
        }
        this.status = 'fulfilled';
    } else {
        console.log('this promise has been resolved/rejected!');
    }
};

fn.reject = function resolve() {
    var next,
        args;
    next = this.queue.shift();
    if (next && next.onRejected) {
        args = Array.prototype.slice.call(arguments).concat(this);
        next.onRejected(args);
    }
    this.queue = [];
    rootPromise = this.setFinalStatus('rejected');
    rootPromise && (rootPromise.queue = []);
};

function toString(obj) {
	return Object.prototype.toString.call(obj);
}

function isFunction(obj) {
	return toString(obj) === 'object Function';
}



// var a = new Promise((resolve, reject) => {
//     console.log(111);
//     resolve();
// }).then(res=> {
//     return new Promise(() => {
//         console.log(222);
//     });
// }).then(() => {
//     console.log(333);
// })
// // 111
// // 222
// // undefined
// // a pending


function p(type){
    return new Promise((resolve,reject)=>{
        if (type=='yes') {
            setTimeout(()=>{
                resolve('resolved');
            },5000);
        }else{
            setTimeout(()=>{
                reject('rejected');
            },5000);
        }
    })
}

function resolve(){
    console.log('before:',this)
    return p('yes').then(res=>{
        console.log('res',this);
        console.log(res);
    }).catch(err=>{
        console.log('err',this);
        console.log(err);
    })
}
function Aa() {
    this.p = resolve();
    // Pormise this 指向 window
}
