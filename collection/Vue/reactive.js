/**
 * 执行过程解析：
 * 1、effect 立即执行传入的函数
 * 2、读取 data.count 触发 Proxy 的 get 拦截
 * 3、track 将当前 effect 记录到 targetMap
 * 4、修改 data.count 触发 Proxy 的 set 拦截
 * 5、trigger 查找并执行所有关联的 effect
 */

// 通过 reactive() 函数创建响应式对象
function reactive(target) {
// Proxy 拦截读写
    return new Proxy(target, { // Proxy 拦截读写
        get(target, key, receiver) { // 拦截读取操作
            track(target, key) // 依赖收集
            return Reflect.get(...arguments)
        },
        set(target, key, value, receiver) { // 拦截写入操作
            const result = Reflect.set(...arguments)
            trigger(target, key) // 触发更新
            return result
        }
    })
}

let activeEffect = null
// 和 Watch 类似，effect() 函数用来执行副作用函数
function effect(fn) {
    const _effect = () => {
        activeEffect = _effect
        fn() // 执行副作用函数
        activeEffect = null
    }
    _effect() // 立即执行以触发依赖收集
    return _effect
}

const targetMap = new WeakMap() // 存储对象-键-依赖关系

// 依赖收集, 等同于 Dep 的 depend
function track(target, key) {
    if (!activeEffect) return

    // 获取对象对应的依赖Map
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    // 获取属性对应的依赖Set
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    dep.add(activeEffect) // 将当前effect加入依赖
}
// 触发更新机制, 等同于 Dep 的 notify
function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
  
    const effects = depsMap.get(key)
    effects && effects.forEach(effect => effect()) // 重新执行所有关联的effect
}

// 创建响应式对象
const data = reactive({ count: 0 })

// 定义副作用
effect(() => {
  console.log('count changed:', data.count)
})

// 测试
data.count = 1 // 控制台输出 "count changed: 1"