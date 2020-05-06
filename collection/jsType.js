// 浮点数的比较
console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);

// ES2015中 Array.prototype.fill()方法它可以用一个固定值填充数组中从起始索引到终止索引中的全部元素。
// 这个方法包含三个参数：value， start，end。
// value即该固定值，start与end分别为起始索引与终止索引，
new Array(20).fill('');
// fill 引用数据类型 !!!!!!!
var a = new Array(2).fill(new Array(2));
a[0][0] = 1;
a
// (2) [Array(2), Array(2)]
//     0: (2) [1, empty]
//     1: (2) [1, empty]
//     length: 2
//     __proto__: Array(0)

Number.MIN_VALUE > 0;