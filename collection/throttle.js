/**
 * @desc 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数。
 * @desc 对于想控制一些触发频率较高的事件有帮助。（注：详见：javascript函数的throttle和debounce）
 * @param {Object} options
 *          禁用第一次首先执行的话，传递{leading: false}，
 *          还有如果你想禁用最后一次执行的话，传递{trailing: false}。
 */
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var _now = function() {
        return new Date().getTime();
    }

    var later = function() {
        previous = options.leading === false ? 0 : _now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = _now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
};

var a = throttle(() => {console.log(1)}, 10000);
var n = 5;
var timer = setInterval(() => {
    n--;
    if (n > 0) {
        a();
    } else {
        clearInterval(timer);
    }
}, 1000)
