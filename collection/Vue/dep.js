class Dep {
    constructor() {
        this.subscribers = new Set()  // 用 Set 避免重复订阅
    }
  
    // 收集依赖
    depend() {
        if (Dep.target) {
            this.subscribers.add(Dep.target)
        }
    }
  
    // 触发更新
    notify() {
        this.subscribers.forEach(sub => sub.update())
    }
}
  
  // 静态属性，用于指向当前正在计算的观察者
  Dep.target = null
  
  // 观察者类（简单版）
  class Watcher {
    constructor(updateCallback) {
        this.update = () => {
            Dep.target = this
            updateCallback()
            Dep.target = null
        }
        this.update() // 立即执行以触发依赖收集
    }
  }
  
  // 使用示例
  const dep = new Dep()
  
  // 模拟响应式数据
  const data = {
    value: 0,
    get value() {
        dep.depend()  // 收集依赖
        return this._value
    },
    set value(newVal) {
        this._value = newVal
        dep.notify()  // 触发更新
    }
  }
  
  // 创建观察者
new Watcher((newVal, oldVal) => {
    console.log('数据变化:', data.value)
})
  
// 测试
data.value = 1  // 输出 "数据变化: 1"
data.value = 2  // 输出 "数据变化: 2"