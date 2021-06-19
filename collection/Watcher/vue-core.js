import Watcher from './Watcher.js';
import Dep from './Dep.js';

function defineReactive(data, key, val) {
    const dep = new Dep()
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal
            dep.notify()
        },
    })
}

export function computed(data, computed) {
    let keys = Object.keys(computed)
    keys.reduce((ret, key) => {
        const watcher = new Watcher(data, key, computed[key])
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                if (Dep.target) {
                    watcher.depend()
                }
                return watcher.value
            },
            set: function () {
            },
        })
        return ret

    }, {})
}

export function watch(data, watch) {
    Object.keys(watch).forEach(key => {
        const handler = watch[key]
        new Watcher(data, key, key, handler, true)
    })
}

export function initData(data) {
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
}