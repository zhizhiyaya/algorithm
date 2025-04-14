// Vue3 与 Vue 2 的核心差异总结
// 对比维度	    Vue 2	             Vue 3
// 节点创建	    全量创建新节点	       静态提升 + 动态节点标记
// 属性比对     全量属性遍历	       按 dynamicProps 靶向更新动态属性
// 子节点对比   全量双端对比	       Block Tree 动态节点追踪
// 更新策略	    递归全量对比	       基于补丁标志的路径选择
// 内存占用	    存储完整 VNode 结构	   静态节点复用 + WeakMap 依赖存储
// 编译产物	    纯运行时逻辑	       携带补丁标志/dynamicProps 等编译时信息

/**
    // Vue 2 的 diff 过程
    for (let i = 0; i < 1000; i++) {
        // 全量对比每个元素的 class/style/content...
    } 
    
    // Vue 3 的优化过程
    for (let i = 0; i < 1000; i++) {
        if (hasPatchFlag(items[i])) {
        // 只处理标记的变更（如仅 text 变化）
        } else {
        // 跳过静态节点
        }
    }
*/
// graph TD
//   A[开始对比] --> B{是否有补丁标志?}
//   B -->|有| C[按标志位靶向更新]
//   B -->|无| D[全量对比（兼容模式）]
//   C --> E{具体标志类型}
//   E -->|TEXT| F[仅更新文本]
//   E -->|CLASS| G[仅更新 class]
//   E -->|PROPS| H[仅对比动态属性]

// VNode数据结构
interface VNode {
    type: string | Symbol       // 节点类型
    props: Record<string, any> // 属性（含动态标记）
    children: VNode[]          // 子节点
    patchFlag: number          // 补丁标志（二进制位掩码）
    dynamicProps: string[]     // 动态属性列表（仅需对比这些属性）
    el: HTMLElement | null      // 对应的真实 DOM
    key?: string | number       // 优化复用
    shapeFlag: number          // 节点类型标记（普通元素/组件/插槽等）
}


// 核心 Diff
function patch(n1: VNode | null, n2: VNode) {
    // 首次挂载
    if (!n1) {
        mountElement(n2)
        return
    }
  
    // 类型不同直接替换
    if (!isSameVNodeType(n1, n2)) {
        unmount(n1)
        mountElement(n2)
        return
    }
  
    // 复用 DOM 元素
    const el = (n2.el = n1.el!)
  
    // 根据 patchFlag 进行靶向更新
    const { patchFlag } = n2
  
    // 跳过静态节点（HOISTED 标记）
    if (patchFlag === PatchFlags.HOISTED) return
  
    // 处理动态内容
    if (patchFlag > 0) {
      // 文本内容变化（仅需更新文本）
        if (patchFlag & PatchFlags.TEXT) {
            if (n1.children !== n2.children) {
            setElementText(el, n2.children as string)
            }
        }
        // 动态 class
        else if (patchFlag & PatchFlags.CLASS) {
            updateClass(el, n2.props.class)
        }
        // 动态 props（非 class/style）
        else if (patchFlag & PatchFlags.PROPS) {
            updateProps(
            el,
            n1.props,
            n2.props,
            n2.dynamicProps! // 仅对比动态属性
            )
        }
        // 全量 props 比对（动态 key 情况）
        else if (patchFlag & PatchFlags.FULL_PROPS) {
            updateProps(el, n1.props, n2.props)
        }
    } 
    // 没有标记时执行全量对比（兼容模式）
    else {
        updateProps(el, n1.props, n2.props)
        if (n1.children !== n2.children) {
            setElementText(el, n2.children as string)
        }
    }
  
    // 处理子节点（Block Tree 优化）
    patchChildren(n1, n2, el)
}

/***
// 静态提升（Hoist Static）
*/
/**
 * 原始模板
<div>
  <h1>Static Title</h1>
  <p>{{ dynamicText }}</p>
</div>
*/
// 编译后生成的渲染函数
// const _hoisted_1 = /*#__PURE__*/_createVNode("h1", null, "Static Title", -1 /* HOISTED */)

// function render() {
//   return (_openBlock(), _createBlock("div", null, [
//     _hoisted_1, // 静态提升节点
//     _createVNode("p", null, _toDisplayString(dynamicText), 1 /* TEXT */)
//   ]))
// }

// Block Tree 优化
function patchChildren(n1: VNode, n2: VNode, container: HTMLElement) {
    // 新 children 是 Block Tree 结构
    if (n2.dynamicChildren) {
        // 仅对比动态子节点（跳过静态内容）
        patchBlockChildren(n1.dynamicChildren!, n2.dynamicChildren, container)
    } else {
        // 全量对比（兼容模式）
        patchChildrenFull(n1, n2, container)
    }
}
function patchBlockChildren(oldChildren, newChildren, container) {
    for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i]
        const newVNode = newChildren[i]
        patch(oldVNode, newVNode)
    }
}

// 靶向属性更新（基于 dynamicProps）
function updateProps(
    el: HTMLElement,
    oldProps: Record<string, any>,
    newProps: Record<string, any>,
    dynamicProps?: string[] // 动态属性列表（来自编译时）
  ) {
    // 全量对比模式
    if (!dynamicProps) {
        // Vue 2 风格的属性遍历...
        return
    }
  
    // 靶向更新模式（仅处理动态属性）
    for (const key of dynamicProps) {
        if (newProps[key] !== oldProps[key]) {
            setProp(el, key, newProps[key])
        }
    }
}