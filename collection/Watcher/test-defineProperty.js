// defineProperty 是可以监测到数组每项的变化（length 修改监听不到）,  
// 是vue 没有做数组和索引的响应式，所以 a[index] = newVal 时不被监听
let data = [{id: 1}, {id:2}]; // 我是数组
function defineReactive (obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            console.log('我被 get 了');
            return val;
        },
        set: newVal => {
            if (val === newVal) {
                return;
            }
            val = newVal;
            console.log("数据被 set 了，我要渲染到页面上去!");
        }
    })
}
defineReactive(data, length, 3)
defineReactive(data, 0, 1);
console.log(data[0]);
data[0] = {id: 5};

VM1024:7 我被 get 了 
VM1024:21 1
VM1024:15 数据被 set 了，我要渲染到页面上去!
{id: 5}


// 这里需要递归的 defineReactive ，
// 否则引用数据被 set 监听不到
data[0].id = 9 
VM1024:7 我被 get 了
9

data[0].id
VM1024:7 我被 get 了
9
data[0]
VM1024:7 我被 get 了
{id: 9}


const dinner = {
    meal: 'tacos'
}

const handler = {
get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
},
set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
}
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)
  

var dinner = {
    meal: 'tacos'
}

var handler = {
    get(target, property, receiver) {
        console.log('get')
        return Reflect.get(...arguments)
    },
    set(target, property, receiver) {
        console.log('set')
        return Reflect.set(...arguments)
    }
}

var proxy = new Proxy(dinner, handler)
// console.log(proxy.meal)