/**
 * @desc 防抖，输入框类 。 防止过于频繁的请求 ，造成页面频繁渲染带来的抖动效果。
 * @desc 有timer 清除timer, 新创建settimeout , 除非 settimeout 内的方法执行
 * @desc 对于想控制一些触发频率较高的事件有帮助。（注：详见：javascript函数的throttle和debounce）
 */
// 防抖
function debounce(fn, waitTime) {
    let timer = null;
    var that = this;
    return function(...args) {
        if(timer) { // 有 timer,清除 再新起 settimeout，持续等待
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(that, args)
        }, waitTime)
    }
}
// 节流
function throttle(fn, waitTime) {
    let timer = null;
    let me = this;
    return function(...args) {
        if (timer) { return; } // 有 timer, 直接 return，每隔一段时间触发一次
        timer = setTimeout(function() {
            fn.apply(me, args);
            timer = null;
        }, waitTime);
    };
};
