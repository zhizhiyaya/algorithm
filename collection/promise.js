/**
 * @desc 符合 Promise/A
 *  支持链式调用 then
 *
 *
 **/
var global = window;

// ES5 基于原型的实现
function Promise(executor) {
    this.status = 'pending';
    this.queue = [];
    this.isPromise = true;
    this.fulfilledRes = undefined;
    this.rejectedRes = undefined;
    if (isFunction(executor)) {
        this.executor(executor); // 解决箭头函数的 this 指向
    }
}
var fn = Promise.prototype;
fn.executor = function(exec) {
    exec(this.resolve.bind(this), this.reject.bind(this));
}
fn.setFinalStatus = function setFinalStatus(status) {
    this.status = status;
    return this;
}

fn.resolve = function resolve() {
    var next,
        args,
        fulfilledRes;
    fulfilledRes = Array.prototype.slice.call(arguments);
    next = this.queue.shift();
    if (next && this.status === 'pending') {
        onFulfilled = next.onFulfilled;
        args = fulfilledRes.concat(this);
        fulfilledRes = onFulfilled.apply(global, args);
        if (fulfilledRes && fulfilledRes.isPromise) {
            fulfilledRes.then(res => {
                this.resolve(res);
            }, (err) => {
                this.reject(err);
            });
        } else {
            this.fulfilledRes = fulfilledRes;
            this.resolve(fulfilledRes);
        }
    }
    else if (!next) {
        this.fulfilledRes = fulfilledRes;
        this.setFinalStatus("fulfilled");
    } else {
        console.log('this promise has been resolved/rejected!');
    }
};

fn.reject = function resolve() {
    var next,
        args,
        rejectedRes;
    rejectedRes = Array.prototype.slice.call(arguments);
    next = this.queue.shift();
    if (this.status === 'pending') {
        if (next && next.onRejected) {
            args = rejectedRes.concat(this);
            rejectedRes = next.onRejected(args);
            this.rejectedRes = rejectedRes;
            if (this.queue.length === 0) {
                this.setFinalStatus('rejected');
                return rejectedRes || this;
            }
        }
        return this.resolve(rejectedRes);
    } else {
        console.log('this promise has been resolved/rejected!');
    }
    
};

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
                isFnForDone && onFulfilled(this.fulfilledRes);
                break;
            case 'rejected':
                isFnForFail && onRejected(this.rejectedRes);
                break;
            default:
                break;
        }
    }
    return this;
}
fn.catch = function catchExcep(onRejected) {
    this.then(null, onRejected);
}
Promise.allSettled = Promise.allSettled || function (promises) {
    return new Promise(resolve => {
        const data = [], len = promises.length;
        let count = len;
        for (let i = 0; i < len; i += 1) {
            const promise = promises[i];
            if (promise.isPromise) {
                promise.then(res => {
                    data[i] = { status: 'fulfilled', value: res };
                }, error => {
                    data[i] = { status: 'rejected', reason: error };
                }).finally(() => { // promise has been settled
                    if (!--count) {
                        resolve(data);
                    }
                });
            } else {
                if (!--count) {
                    data[i] = { status: 'fulfilled', value: res };
                    resolve(data);
                }
            }
        }
    });
}
function toString(obj) {
	return Object.prototype.toString.call(obj);
}

function isFunction(obj) {
	return toString(obj) === '[object Function]';
}

new Promise(function(resolve, reject){
    resolve({});
    // reject({});
}).then((r)=>{
    console.log(this, r);
}, (e) => {
    console.log('this', e);
}).catch(e=>{
    console.log('this, e');
})

new Promise((resolve, reject) => {
    reject({});
    console.log(1)
}).then((r)=>{
    console.log(2)
}, e=>{
    console.log(3)
}).then((r)=>{
    console.log(22)
}, e=>{
    console.log(33)
})

// Promise {<fulfilled></fulfilled>
// 1
// 3333 handleRejected 
// 222222
new Promise((resolve, reject) => {
    reject({});
    console.log(1)
}).then((r)=>{
    console.log(2)
}).then((r)=>{
    console.log(22)
}, e => {
    console.log(3333)
}).then((r)=>{
    console.log(222222)
}, e => {
    console.log(33333333)
}).catch(e => {
    console.log(33)
})

new Promise((resolve, reject) => {
    throw new Error({});
    reject({});
    console.log(1)
}).then((r)=>{
    console.log(222222)
    return r;
}, e => {
    console.log(33333333)
    throw new Error({});
})
 // 以 throw 终止则会创建一个"已拒绝" rejected 状态 , 没这行 则是 fulfilled 状态

var pro1 = new Promise((resolve, reject) => {
    // throw new Error({});
    resolve({});
    console.log(1)
}).then(async (r)=>{
    return await new Promise(() => {}); // pro1 会一直pending, 因为pro1 已变成当前 then 方法里这个返回的 promise 对象
}, e => {
    console.log(33333333)
})

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
