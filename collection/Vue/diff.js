// graph TD:
//     A[开始对比] --> B{节点类型相同?}
//     B -->|否| C[直接替换节点]
//     B -->|是| D[对比属性]
//     D --> E{是否有子节点?}
//     E -->|都有子节点| F[updateChildren 对比子节点]
//     E -->|新节点有子节点| G[添加新子节点]
//     E -->|旧节点有子节点| H[删除旧子节点]
//     E -->|文本节点| I[对比文本内容]
// 特点：
// 全量递归对比：从根节点开始逐层对比所有子节点
// 双端对比策略：在子节点对比时使用头尾指针优化
// Key 的重要性：通过 key 识别可复用的节点
// 就地更新原则：尽可能复用现有 DOM 节点

// VNode
class VNode {
    constructor(tag, data, children, text) {
        this.tag = tag         // 标签名
        this.data = data       // 属性对象（包含 class/style 等）
        this.children = children // 子节点数组
        this.text = text       // 文本内容
        this.elm = null        // 对应的真实 DOM
    }
}

// 核心 Diff
function patch(oldVnode, newVnode) {
    // 1. 如果旧节点不存在，直接创建新节点
    if (!oldVnode) {
        createElm(newVnode)
        return
    }

    // 2. 节点类型不同，直接替换
    if (!sameVnode(oldVnode, newVnode)) {
        const parent = oldVnode.elm.parentNode
        const newElm = createElm(newVnode)
        parent.insertBefore(newElm, oldVnode.elm)
        parent.removeChild(oldVnode.elm)
        return
    }

    // 3. 类型相同，开始详细对比
    const elm = (newVnode.elm = oldVnode.elm)
    const oldCh = oldVnode.children
    const newCh = newVnode.children

    // 4. 更新属性
    updateAttrs(oldVnode, newVnode)

    // 5. 处理子节点
    if (!newVnode.text) {
        if (oldCh && newCh) {
            // 都有子节点：全量对比子节点
            updateChildren(elm, oldCh, newCh)
        } else if (newCh) {
            // 新增子节点
            addVnodes(elm, null, newCh, 0, newCh.length - 1)
        } else if (oldCh) {
            // 删除旧子节点
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        }
    } else if (oldVnode.text !== newVnode.text) {
        // 文本内容更新
        elm.textContent = newVnode.text
    }
}
// 判断是否相同节点
function sameVnode(a, b) {
    return (
        a.tag === b.tag &&
        a.data?.key === b.data?.key // Vue 2 的 key 对比逻辑
    )
}
function updateAttrs() {}

// 子节点对比（核心算法）
function updateChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let newEndIdx = newCh.length - 1
    let oldStartVnode = oldCh[0]
    let newStartVnode = newCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndVnode = newCh[newEndIdx]
  
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 头头对比
        if (sameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }
        // 尾尾对比
        else if (sameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }
        // 头尾交叉对比
        else if (sameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode)
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }
        // 尾头交叉对比
        else if (sameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode)
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }
        // 使用 key 的查找
        else {
            // 创建旧节点 key 到 index 的映射表
            const keyMap = {}
            for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                const key = oldCh[i].data?.key
                if (key) keyMap[key] = i
            }
    
            // 查找新节点是否存在于旧节点中
            const idxInOld = keyMap[newStartVnode.data?.key]
            if (idxInOld) {
                const vnodeToMove = oldCh[idxInOld]
                patch(vnodeToMove, newStartVnode)
                parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm)
                oldCh[idxInOld] = undefined // 标记已处理
            } else {
                // 新增节点
                createElm(newStartVnode, parentElm, oldStartVnode.elm)
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    
    // 处理剩余节点
    if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, null, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

// 旧虚拟 DOM
const oldVnode = new VNode('div', {}, [
    new VNode('p', { key: 'a' }, [], 'A'),
    new VNode('p', { key: 'b' }, [], 'B')
]);

// 新虚拟 DOM
const newVnode = new VNode('div', {}, [
    new VNode('p', { key: 'b' }, [], 'B Updated'),
    new VNode('p', { key: 'c' }, [], 'C')
]);