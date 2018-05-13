// 质数
function isPrime(n) {
  return !(/^.?$|^(..+?)\1+$/).test('1'.repeat(n))
}

// 生成6位的数字验证码
console.log(('000000' + Math.floor(Math.random() *  999999)).slice(-6));
console.log(Math.random().toString().slice(-6));
console.log(Math.random().toFixed(6).slice(-6));
console.log('' + Math.floor(Math.random() * 999999));
// 16进制颜色代码生成
(function(){return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);})()


// 大/小驼峰命名转下划线/连接符命名
'componentMapModelRegistry'.match(/^[a-z][a-z0-9]+|[A-Z][a-z0-9]*/g).join('_').toLowerCase();

// 数组去重 ,
// Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。
function dedupe(array){
    return Array.from(new Set(array));
}
console.log(dedupe([1,1,2,3])); //[1,2,3]
