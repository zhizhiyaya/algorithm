// add方法为例

var add = function(num1, num2) {
    return num1 + num2;
}

// 假设 sum 函数调用时，传入参数都是标准的数字
function curry(add, n) {
   var count = 0,
       arr = [];
       
   return function reply(arg) {
       arr.push(arg);
       
       if ( ++count >= n) {
           //这里也可以在外面定义变量，保存每次计算后结果
           return arr.reduce(function(p, c) {
               return p = add(p, c);
           }, 0) 
       } else {
           return reply;
       }
   }
}
var sum = curry(add, 4);
function add() {

}
add(1)
add(1)(2)
add(1, 2, 3)(1)
sum(4)(3)(2)(1) 
 // 10


function curry(add) {
    var arr = [];
    return function reply() {
        var arg = Array.prototype.slice.call(arguments);
        arr = arr.concat(arg);
        if (arg.length === 0) { // 递归结束条件，修改为 传入空参数
            return arr.reduce(function(p, c) {
                return p = add(p, c);
            }, 0)
        } else {
            return reply;
        }
    }
}

// 红宝书实现
function curry(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(null, finalArgs);
    };
}

function add(num1, num2) {
    return num1 + num2;
}
var curriedAdd = curry(add, 5);

var curriedAdd2 = curry(add, 5, 12);

alert(curriedAdd(3))    // 8
alert(curriedAdd2())    // 17



// 设计function add() {}


add(2, 3, 4) // 9

add(2, 3)(4) // 9

add(2)(3, 4) // 9

add(2)(3)(4) // 9