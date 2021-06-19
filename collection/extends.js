// 继承
function People(name){
    //属性
    this.name  = name || 'Annie';
    //实例方法
    this.sleep=function(){
      console.log(this.name + '正在睡觉')
    }
}
//原型方法
People.prototype.eat = function(food){
    console.log(this.name + '正在吃：' + food);
}
/**
 * 1、原型链继承
 */
function Woman(name){ 
    // 继承了People, 解决构造函数里的属性方法的继承
    People.call(this, name, age)
}
Woman.prototype = new People(); // 原型继承，因为是new 实例，会有多余的构造函数里的属性方法
Woman.prototype.name = 'haixia'; // 上一行继承了构造函数里的属性，这里可以覆盖掉
Woman.prototype.constructor = Woman; // 构造函数指回 Woman
let wonmanObj = new Woman('ren',27);
wonmanObj.eat();  


// es6 继承， 代码量少，易懂
// class 相当于es5中构造函数
// class 中定义方法时，前后不能加 function，全部定义在 class 的 protopyte 属性中
// class 中定义的所有方法是不可枚举的
// class 中只能定义方法，不能定义对象，变量等
// class 和方法内默认都是严格模式
// es5 中 constructor 为隐式属性
class People{
    constructor(name = 'wang', age = '27'){
        this.name = name;
        this.age = age;
    }
    eat(){
        console.log(`${this.name} ${this.age} eat food`)
    }
}
//继承父类
class Woman extends People{ 
    constructor(name = 'ren', age = '27'){ 
        // 继承父类属性
        super(name, age); 
    } 
    eat(){ 
        // 继承父类方法
        super.eat() 
    } 
} 
let wonmanObj=new Woman('xiaoxiami'); 
wonmanObj.eat();
