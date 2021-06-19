let depId = 0

export default class Dep {
    static target
    id
    subs

    constructor() {
        this.subs = []
        this.id = ++depId
        Dep.target = null
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if (index > -1) this.subs.splice(index, 1)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify() {
        const subs = this.subs.slice()
        subs.sort((a, b) => a.id - b.id)
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}