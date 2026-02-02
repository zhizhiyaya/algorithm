/**
 * 1、数据代理（ reactive 通过 Proxy 拦截读写）
 * 2、依赖收集（effect 中用的值会被“订阅”）
 * 3、依赖触发（当数据被修改时，重新运行对应的副作用函数）
 */

// 通过 reactive() 函数创建响应式对象
function reactive(target) {
    // Proxy 拦截读写
    return new Proxy(target, {
      get(obj, key, receiver) { // 拦截读取操作
        const result = Reflect.get(...arguments);
        track(obj, key); // 收集依赖
        return result;
      },
      set(obj, key, value, receiver) { // 拦截写入操作
        const oldValue = obj[key];
        const result = Reflect.set(...arguments);
        if (oldValue !== value) {
          trigger(obj, key); // 触发依赖更新
        }
        return result;
      }
    });
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

// 全局依赖桶 targetMap，存储对象-键-依赖关系
const targetMap = new WeakMap()

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