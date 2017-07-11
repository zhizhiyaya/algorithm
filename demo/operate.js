var a = 0;
++a; // return 0, a -> 1 前置 ++ 操作 , 返回值是操作前的值
a++; // return 2, a -> 2 后置 ++ 操作 , 返回的是操作后的值
var c = ++a; // c = 2, a -> 3
d = a++; // c = 4, a -> 4


// ES6 Class private Props

var People = (function() {
    var p = new WeakMap();
    class People {
        constructor(name) { //构造函数
            var privateProperties = {
                name: name
            };
            p.set(this, privateProperties);
        }
        sayName() {
            console.log(this.name);
        }

        get name() {
            return p.get(this).name;
        }
    }
    return People;
})();

var p = new People("tom");
console.log(p.name);
p.sayName();

var p2 = new People("bob");
console.log(p2.name);
p2.sayName();
