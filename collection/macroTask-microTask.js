process.nextTick(()=>{console.log(0)});
setTimeout(function(){console.log(4)},0);
new Promise(function(resolve){
    console.log(1)
    for( var i=0 ; i<10000 ; i++ ){
        i==9999 && resolve()
    }
    console.log(2)
}).then(function(){
    console.log(5)
});
process.nextTick(()=>{console.log(10)});
setTimeout(function(){console.log(40)},0);
console.log(3);

// 两个类别的具体分类如下：
// macro-task: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
// micro-task: process.nextTick, Promises（这里指浏览器实现的原生 Promise）, Object.observe, MutationObserver

// MutationObserver监听 DOM 树(childList、attributes、subtree)更改 ,https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver

// 全局代码相当于  macrotask
// promise 的 excutor 会立即执行
1
2
3
// microtask
0
10
5
// macrotask
4
40


for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i);
    })
}
console.log(i);
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i);
    })
}
console.log(i);
