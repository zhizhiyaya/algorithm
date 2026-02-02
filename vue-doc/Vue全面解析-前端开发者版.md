# Vue 全面解析 - 前端开发者版

> Vue.js 从入门到精通,深入理解Vue 2.0/3.0核心原理与设计思想

## 📚 目录导航

### 第一部分:Vue核心概念
- [Vue简介](#vue简介)
- [Vue的设计哲学](#vue的设计哲学)
- [渐进式框架的理解](#渐进式框架的理解)

### 第二部分:Vue 2.0核心解析
- [响应式系统](#vue-20-响应式系统)
- [虚拟DOM与Diff算法](#虚拟dom与diff算法)
- [组件系统](#vue-20-组件系统)
- [生命周期](#vue-20-生命周期)

### 第三部分:Vue 3.0核心解析
- [Composition API](#composition-api)
- [响应式系统重构](#vue-30-响应式系统)
- [性能优化](#vue-30-性能优化)
- [TypeScript支持](#typescript支持)

### 第四部分:Vue 2.0 vs 3.0 对比
- [核心差异对比](#核心差异对比)
- [API变更](#api变更)
- [性能对比](#性能对比)
- [迁移指南](#迁移指南)

### 第五部分:Vue特色功能
- [模板语法](#模板语法)
- [指令系统](#指令系统)
- [插槽机制](#插槽机制)
- [混入与插件](#混入与插件)

### 第六部分:实战应用
- [状态管理(Vuex/Pinia)](#状态管理)
- [路由管理(Vue Router)](#路由管理)
- [服务端渲染(SSR)](#服务端渲染)
- [最佳实践](#最佳实践)

---

## Vue简介

### 什么是Vue.js?

Vue (读音 /vjuː/,类似于 view) 是一套用于构建用户界面的**渐进式JavaScript框架**。

**核心特点:**
- **易学易用**: API设计简洁,上手快
- **渐进式**: 可以只用核心库,也可以结合完整生态
- **响应式**: 数据驱动视图自动更新
- **组件化**: 可复用的组件系统
- **高性能**: 虚拟DOM + 智能优化

### Vue的发展历程

| 版本 | 发布时间 | 重大特性 |
|------|---------|----------|
| Vue 0.x | 2013年 | 项目初期,探索阶段 |
| Vue 1.0 | 2015年10月 | 正式版发布 |
| Vue 2.0 | 2016年9月 | 虚拟DOM,服务端渲染 |
| Vue 2.6 | 2019年2月 | 插槽语法优化,异步错误处理 |
| Vue 3.0 | 2020年9月 | Composition API,性能提升 |
| Vue 3.5 | 2024年 | Vapor Mode探索,持续优化 |

---

## Vue的设计哲学

### 1. 渐进式框架的理解

**渐进式**意味着可以根据项目需求逐步采用Vue的功能:

```
最小使用:
只用Vue核心库 → 操作DOM,绑定数据

中等规模:
Vue核心 + Vue Router → 单页应用(SPA)

大型应用:
Vue核心 + Vue Router + Vuex/Pinia + 构建工具 → 完整解决方案
```

**示例:从简单到复杂**

```html
<!-- 1. 最简单使用:直接引入CDN -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
<div id="app">{{ message }}</div>
<script>
  const { createApp } = Vue;
  createApp({
    data() {
      return { message: 'Hello Vue!' }
    }
  }).mount('#app');
</script>

<!-- 2. 进阶:使用单文件组件 + 构建工具 -->
<!-- App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
</script>
```

### 2. 声明式渲染

**声明式 vs 命令式**

```javascript
// 命令式(原生JS)
const div = document.querySelector('#app');
div.innerHTML = '<p>' + message + '</p>';
div.querySelector('p').style.color = 'red';

// 声明式(Vue)
<template>
  <p :style="{ color: 'red' }">{{ message }}</p>
</template>
```

**优势:**
- 代码更简洁易读
- 关注"是什么"而非"怎么做"
- 框架自动处理DOM操作优化

### 3. 响应式数据驱动

**核心思想:数据变化 → 视图自动更新**

```javascript
// Vue会自动追踪依赖并更新视图
const state = reactive({
  count: 0
});

// 修改数据
state.count++; // 视图自动更新,无需手动操作DOM
```

---

## Vue 2.0 响应式系统

### 核心原理:Object.defineProperty

Vue 2.0使用`Object.defineProperty`实现响应式:

```javascript
/**
 * Vue 2.0响应式核心实现(简化版)
 */
function defineReactive(obj, key, val) {
  const dep = new Dep(); // 依赖收集器

  Object.defineProperty(obj, key, {
    get() {
      console.log(`获取${key}: ${val}`);
      // 收集依赖
      if (Dep.target) {
        dep.depend();
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      console.log(`设置${key}: ${val} → ${newVal}`);
      val = newVal;
      // 通知更新
      dep.notify();
    }
  });
}

/**
 * 依赖收集器
 */
class Dep {
  constructor() {
    this.subs = []; // 订阅者列表
  }

  // 添加订阅者
  depend() {
    if (Dep.target) {
      this.subs.push(Dep.target);
    }
  }

  // 通知所有订阅者
  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

Dep.target = null;

/**
 * 观察者(Watcher)
 */
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;

    // 触发getter,收集依赖
    Dep.target = this;
    this.value = vm[key];
    Dep.target = null;
  }

  update() {
    const newValue = this.vm[this.key];
    if (newValue !== this.value) {
      this.value = newValue;
      this.callback(newValue);
    }
  }
}

// 使用示例
const data = { count: 0 };
defineReactive(data, 'count', 0);

new Watcher(data, 'count', (val) => {
  console.log(`视图更新: count = ${val}`);
});

data.count = 1; // 输出: 设置count: 0 → 1
                // 输出: 视图更新: count = 1
```

### 响应式工作流程

```
1. 初始化阶段
   ↓
data对象 → Observer遍历属性 → defineProperty劫持get/set
   ↓
创建Dep依赖收集器

2. 依赖收集阶段
   ↓
组件渲染 → 触发getter → Dep.target = Watcher → dep.depend()
   ↓
Watcher被添加到Dep.subs

3. 派发更新阶段
   ↓
数据修改 → 触发setter → dep.notify() → Watcher.update()
   ↓
触发组件重新渲染
```

### Vue 2.0响应式的局限性

**1. 无法检测对象属性的添加或删除**

```javascript
const vm = new Vue({
  data: {
    user: {
      name: 'Alice'
    }
  }
});

// ❌ 无法检测
vm.user.age = 18; // 不会触发更新

// ✅ 需要使用Vue.set
Vue.set(vm.user, 'age', 18);
// 或
vm.$set(vm.user, 'age', 18);
```

**2. 无法检测数组索引和length的变化**

```javascript
const vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
});

// ❌ 无法检测
vm.items[1] = 'x'; // 不会触发更新
vm.items.length = 0; // 不会触发更新

// ✅ 需要使用数组方法或Vue.set
vm.items.splice(1, 1, 'x');
vm.$set(vm.items, 1, 'x');
```

**3. 初始化时必须声明所有属性**

```javascript
// 必须在data中预先声明
data() {
  return {
    user: {
      name: '',
      age: null, // 即使初始值为null也要声明
      email: ''
    }
  }
}
```

---

## 虚拟DOM与Diff算法

### 什么是虚拟DOM(Virtual DOM)?

**虚拟DOM是用JavaScript对象描述真实DOM结构:**

```javascript
// 真实DOM
<div id="app" class="container">
  <p>Hello</p>
  <span>World</span>
</div>

// 虚拟DOM(VNode)
{
  tag: 'div',
  props: {
    id: 'app',
    class: 'container'
  },
  children: [
    {
      tag: 'p',
      children: 'Hello'
    },
    {
      tag: 'span',
      children: 'World'
    }
  ]
}
```

### 为什么需要虚拟DOM?

**优势:**

1. **性能优化**: 批量更新,减少DOM操作
2. **跨平台**: 可以渲染到非浏览器环境(SSR,小程序)
3. **开发体验**: 声明式编程,数据驱动

**虚拟DOM工作流程:**

```
数据变化
  ↓
生成新的VNode树
  ↓
与旧VNode树进行Diff对比
  ↓
计算出最小变更
  ↓
批量更新真实DOM
```

### Diff算法核心

**Vue 2.0的Diff算法(双端对比)**

```javascript
/**
 * Diff算法核心逻辑(简化版)
 *
 * 策略:
 * 1. 同层比较,不跨层级
 * 2. 不同类型节点直接替换
 * 3. 同类型节点对比属性和子节点
 * 4. 列表使用key优化
 */
function patch(oldVNode, newVNode) {
  // 1. 新节点不存在,删除旧节点
  if (!newVNode) {
    return removeVNode(oldVNode);
  }

  // 2. 旧节点不存在,创建新节点
  if (!oldVNode) {
    return createElm(newVNode);
  }

  // 3. 节点类型不同,直接替换
  if (oldVNode.tag !== newVNode.tag) {
    return replaceVNode(oldVNode, newVNode);
  }

  // 4. 相同节点,对比属性
  patchProps(oldVNode, newVNode);

  // 5. 对比子节点
  patchChildren(oldVNode, newVNode);
}

/**
 * 对比子节点(双端对比算法)
 */
function patchChildren(oldVNode, newVNode) {
  const oldCh = oldVNode.children;
  const newCh = newVNode.children;

  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;

  let oldStartVNode = oldCh[0];
  let oldEndVNode = oldCh[oldEndIdx];
  let newStartVNode = newCh[0];
  let newEndVNode = newCh[newEndIdx];

  // 双端对比
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVNode(oldStartVNode, newStartVNode)) {
      // 头头对比
      patch(oldStartVNode, newStartVNode);
      oldStartVNode = oldCh[++oldStartIdx];
      newStartVNode = newCh[++newStartIdx];
    } else if (sameVNode(oldEndVNode, newEndVNode)) {
      // 尾尾对比
      patch(oldEndVNode, newEndVNode);
      oldEndVNode = oldCh[--oldEndIdx];
      newEndVNode = newCh[--newEndIdx];
    } else if (sameVNode(oldStartVNode, newEndVNode)) {
      // 头尾对比
      patch(oldStartVNode, newEndVNode);
      // 移动节点
      insertBefore(oldStartVNode.elm, oldEndVNode.elm.nextSibling);
      oldStartVNode = oldCh[++oldStartIdx];
      newEndVNode = newCh[--newEndIdx];
    } else if (sameVNode(oldEndVNode, newStartVNode)) {
      // 尾头对比
      patch(oldEndVNode, newStartVNode);
      insertBefore(oldEndVNode.elm, oldStartVNode.elm);
      oldEndVNode = oldCh[--oldEndIdx];
      newStartVNode = newCh[++newStartIdx];
    } else {
      // 乱序对比,使用key查找
      const idxInOld = findIdxInOld(newStartVNode, oldCh);
      if (idxInOld) {
        patch(oldCh[idxInOld], newStartVNode);
        oldCh[idxInOld] = undefined;
      } else {
        createElm(newStartVNode);
      }
      newStartVNode = newCh[++newStartIdx];
    }
  }

  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 新增节点
    addVNodes(newCh, newStartIdx, newEndIdx);
  } else {
    // 删除节点
    removeVNodes(oldCh, oldStartIdx, oldEndIdx);
  }
}
```

**Diff示例:列表更新**

```javascript
// 旧列表
[A, B, C, D]

// 新列表
[B, A, D, E]

// Diff过程:
1. 头头对比: A ≠ B (失败)
2. 尾尾对比: D = D (成功) → patch(D, D)
3. 头尾对比: A ≠ D (失败)
4. 尾头对比: D ≠ B (失败)
5. 使用key查找: B在旧列表的index 1 → 移动B
6. 继续对比: A = A (成功)
7. 新增节点E

结果:
- 复用: A, B, D
- 移动: B
- 新增: E
- 删除: C
```

### Key的重要性

**❌ 不使用key(使用index)**

```vue
<li v-for="(item, index) in items" :key="index">
  {{ item.name }}
</li>
```

问题:
- 列表顺序改变时,会导致大量不必要的更新
- 状态(如input值)可能错乱

**✅ 使用唯一key**

```vue
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>
```

优势:
- 准确追踪节点身份
- 最大化复用DOM
- 避免状态错乱

---

## Vue 2.0 组件系统

### 组件定义方式

**1. 全局注册**

```javascript
// 全局组件
Vue.component('my-button', {
  props: ['label'],
  template: '<button>{{ label }}</button>'
});
```

**2. 局部注册**

```javascript
// 局部组件
export default {
  components: {
    MyButton: {
      props: ['label'],
      template: '<button>{{ label }}</button>'
    }
  }
}
```

**3. 单文件组件(SFC)**

```vue
<!-- MyButton.vue -->
<template>
  <button class="btn" @click="handleClick">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    label: {
      type: String,
      default: 'Click me'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  border-radius: 4px;
}
</style>
```

### 组件通信方式

**1. Props Down(父→子)**

```vue
<!-- Parent.vue -->
<template>
  <child-component :message="parentMsg" :count="10" />
</template>

<script>
export default {
  data() {
    return {
      parentMsg: 'Hello from parent'
    }
  }
}
</script>

<!-- Child.vue -->
<script>
export default {
  props: {
    message: String,
    count: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 0;
      }
    }
  }
}
</script>
```

**2. Events Up(子→父)**

```vue
<!-- Child.vue -->
<template>
  <button @click="$emit('update', newValue)">
    Update
  </button>
</template>

<!-- Parent.vue -->
<template>
  <child-component @update="handleUpdate" />
</template>

<script>
export default {
  methods: {
    handleUpdate(value) {
      console.log('收到更新:', value);
    }
  }
}
</script>
```

**3. Event Bus(兄弟组件)**

```javascript
// event-bus.js
export const EventBus = new Vue();

// ComponentA.vue
import { EventBus } from './event-bus';

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message', 'Hello from A');
    }
  }
}

// ComponentB.vue
import { EventBus } from './event-bus';

export default {
  mounted() {
    EventBus.$on('message', (msg) => {
      console.log('收到消息:', msg);
    });
  },
  beforeDestroy() {
    EventBus.$off('message'); // 记得解绑
  }
}
```

**4. Provide/Inject(跨层级)**

```vue
<!-- Ancestor.vue -->
<script>
export default {
  provide() {
    return {
      theme: 'dark',
      user: this.currentUser
    }
  },
  data() {
    return {
      currentUser: { name: 'Alice' }
    }
  }
}
</script>

<!-- Descendant.vue (多层后代) -->
<script>
export default {
  inject: ['theme', 'user'],
  mounted() {
    console.log(this.theme); // 'dark'
    console.log(this.user); // { name: 'Alice' }
  }
}
</script>
```

**5. Vuex(全局状态管理)**

```javascript
// store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    async fetchUser({ commit }) {
      const user = await api.getUser();
      commit('SET_USER', user);
    }
  },
  getters: {
    isLoggedIn: state => !!state.user
  }
});

// Component.vue
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    increment() {
      this.$store.commit('INCREMENT');
    },
    login() {
      this.$store.dispatch('fetchUser');
    }
  }
}
```

### 组件通信方式对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| Props/Events | 父子组件 | 简单直接,单向数据流 | 多层传递繁琐 |
| Event Bus | 兄弟/任意组件 | 灵活 | 难以追踪,易造成混乱 |
| Provide/Inject | 跨层级组件 | 避免逐层传递 | 非响应式(默认) |
| Vuex | 全局状态 | 集中管理,可追踪 | 小应用过重 |

---

## Vue 2.0 生命周期

### 生命周期图解

```
创建阶段:
beforeCreate  → 初始化事件和生命周期
                ↓
created       → 初始化注入和响应式
                ↓ (有el选项?)
                ↓
挂载阶段:
beforeMount   → 编译模板,创建VNode
                ↓
mounted       → 创建vm.$el并挂载
                ↓
更新阶段:
beforeUpdate  → 数据变化,虚拟DOM重新渲染前
                ↓
updated       → 虚拟DOM重新渲染和打补丁后
                ↓
销毁阶段:
beforeDestroy → 实例销毁前,仍可访问实例
                ↓
destroyed     → 实例销毁,事件监听和子组件已移除
```

### 生命周期详解与应用场景

```vue
<script>
export default {
  // 1️⃣ beforeCreate
  // 时机: 实例初始化后,数据观测和事件配置之前
  // 特点: 无法访问data、computed、methods
  // 使用: 很少使用,可用于全局loading等
  beforeCreate() {
    console.log('beforeCreate');
    console.log(this.message); // undefined
  },

  // 2️⃣ created ⭐⭐⭐⭐⭐
  // 时机: 实例创建完成,数据观测、属性计算、方法配置完成
  // 特点: 可访问data、methods,但DOM未生成
  // 使用: 发起异步请求、初始化数据
  created() {
    console.log('created');
    console.log(this.message); // 可访问

    // ✅ 适合做的事:
    this.fetchData(); // 发起API请求
    this.initForm(); // 初始化表单数据
    this.setupEventBus(); // 设置事件监听
  },

  // 3️⃣ beforeMount
  // 时机: 挂载开始前,render函数首次调用
  // 特点: 模板已编译,但未挂载到DOM
  // 使用: 较少使用
  beforeMount() {
    console.log('beforeMount');
    console.log(this.$el); // undefined
  },

  // 4️⃣ mounted ⭐⭐⭐⭐⭐
  // 时机: 实例挂载到DOM后
  // 特点: 可访问DOM元素,子组件也已挂载
  // 使用: DOM操作、第三方库初始化、图表渲染
  mounted() {
    console.log('mounted');
    console.log(this.$el); // 可访问DOM

    // ✅ 适合做的事:
    this.initChart(); // 初始化图表
    this.initSwiper(); // 初始化轮播
    this.$refs.input.focus(); // 操作DOM

    // 监听window事件
    window.addEventListener('resize', this.handleResize);
  },

  // 5️⃣ beforeUpdate
  // 时机: 数据更新时,DOM更新前
  // 特点: 数据已变,DOM未变
  // 使用: 访问更新前的DOM状态
  beforeUpdate() {
    console.log('beforeUpdate');
    console.log('旧值:', this.$el.textContent);
  },

  // 6️⃣ updated ⭐⭐⭐
  // 时机: DOM更新完成后
  // 特点: 数据和DOM都已更新
  // 使用: 需要根据DOM更新执行操作
  // ⚠️ 注意: 避免在此修改数据,可能导致无限循环
  updated() {
    console.log('updated');
    console.log('新值:', this.$el.textContent);

    // ✅ 适合做的事:
    this.updateChartSize(); // 更新图表

    // ❌ 避免:
    // this.count++; // 会触发新的更新,导致无限循环
  },

  // 7️⃣ beforeDestroy ⭐⭐⭐⭐
  // 时机: 实例销毁前
  // 特点: 实例仍完全可用
  // 使用: 清理工作(事件监听、定时器、订阅)
  beforeDestroy() {
    console.log('beforeDestroy');

    // ✅ 必须做的清理:
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.timer);
    EventBus.$off('custom-event');
    this.chart.dispose(); // 销毁图表实例
  },

  // 8️⃣ destroyed
  // 时机: 实例销毁后
  // 特点: 所有指令解绑,事件监听移除,子组件销毁
  // 使用: 很少使用
  destroyed() {
    console.log('destroyed');
  },

  // 数据
  data() {
    return {
      message: 'Hello',
      timer: null,
      chart: null
    }
  },

  // 方法
  methods: {
    async fetchData() {
      const data = await api.getData();
      this.items = data;
    },
    handleResize() {
      // 处理窗口大小变化
    }
  }
}
</script>
```

### 父子组件生命周期执行顺序

```
挂载阶段:
Parent beforeCreate
Parent created
Parent beforeMount
  ↓
Child beforeCreate
Child created
Child beforeMount
Child mounted
  ↓
Parent mounted

更新阶段(父组件数据变化影响子组件):
Parent beforeUpdate
  ↓
Child beforeUpdate
Child updated
  ↓
Parent updated

销毁阶段:
Parent beforeDestroy
  ↓
Child beforeDestroy
Child destroyed
  ↓
Parent destroyed
```

### 常见应用场景总结

| 生命周期 | 常见用途 |
|---------|---------|
| **created** | 发起API请求、初始化数据、设置事件监听 |
| **mounted** | DOM操作、初始化第三方库(图表、地图)、获取DOM尺寸 |
| **updated** | 响应DOM更新(谨慎使用,避免无限循环) |
| **beforeDestroy** | 清理定时器、解绑事件、销毁第三方库实例 |

---

## Vue 3.0 核心特性

### Composition API

**为什么需要Composition API?**

Vue 2.0的Options API在大型组件中存在的问题:
1. **逻辑分散**: 相关逻辑被拆分到data、methods、computed等选项
2. **代码复用**: mixins容易命名冲突,来源不清晰
3. **类型推导**: TypeScript支持不够友好

**Composition API的优势:**
- ✅ 逻辑组织: 相关代码聚合在一起
- ✅ 代码复用: 通过组合函数(composables)实现
- ✅ 类型推导: 对TypeScript更友好
- ✅ Tree-shaking: 按需引入,减小包体积

### Options API vs Composition API

**同一个功能的两种实现对比:**

```vue
<!-- Options API (Vue 2.0) -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>

    <p>User: {{ user.name }}</p>
    <button @click="fetchUser">Fetch User</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 计数器相关
      count: 0,
      // 用户相关
      user: null,
      loading: false
    }
  },
  computed: {
    // 计数器相关
    doubleCount() {
      return this.count * 2;
    }
  },
  methods: {
    // 计数器相关
    increment() {
      this.count++;
    },
    // 用户相关
    async fetchUser() {
      this.loading = true;
      this.user = await api.getUser();
      this.loading = false;
    }
  },
  mounted() {
    // 初始化
    this.fetchUser();
  }
}
</script>
```

```vue
<!-- Composition API (Vue 3.0) -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>

    <p>User: {{ user?.name }}</p>
    <button @click="fetchUser">Fetch User</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUser } from '@/composables/useUser';

// 计数器逻辑(聚合在一起)
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 用户逻辑(聚合在一起,且可提取为composable)
const { user, loading, fetchUser } = useUser();

// 生命周期
onMounted(() => {
  fetchUser();
});
</script>
```

**提取为可复用的Composable:**

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubleCount = computed(() => count.value * 2);

  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => count.value = initialValue;

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  };
}

// composables/useUser.js
import { ref } from 'vue';
import api from '@/api';

export function useUser() {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      user.value = await api.getUser();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    fetchUser
  };
}

// 在组件中使用
<script setup>
import { useCounter } from '@/composables/useCounter';
import { useUser } from '@/composables/useUser';

const { count, increment } = useCounter(10);
const { user, fetchUser } = useUser();
</script>
```

### Composition API核心函数

#### 1. ref - 基本类型响应式

```javascript
import { ref, isRef, unref } from 'vue';

// 创建响应式引用
const count = ref(0);
const message = ref('hello');

// 访问和修改(需要.value)
console.log(count.value); // 0
count.value++;

// 在template中自动解包,无需.value
<template>
  <p>{{ count }}</p>  <!-- 不需要count.value -->
</template>

// 判断是否是ref
console.log(isRef(count)); // true

// 解包ref(是ref返回.value,否则返回原值)
console.log(unref(count)); // 1
```

#### 2. reactive - 对象响应式

```javascript
import { reactive, toRefs, toRef } from 'vue';

// 创建响应式对象
const state = reactive({
  count: 0,
  user: {
    name: 'Alice',
    age: 18
  }
});

// 直接访问和修改(无需.value)
console.log(state.count); // 0
state.count++;
state.user.name = 'Bob';

// reactive的限制:
// ❌ 不能替换整个对象
state = { count: 10 }; // 失去响应式!

// ✅ 应该修改属性
state.count = 10;

// 解构会失去响应式
const { count } = state; // ❌ count不再响应式

// ✅ 使用toRefs保持响应式
const { count, user } = toRefs(state);
console.log(count.value); // 需要.value

// 单个属性转ref
const count = toRef(state, 'count');
```

#### 3. computed - 计算属性

```javascript
import { ref, computed } from 'vue';

const count = ref(1);

// 只读计算属性
const doubleCount = computed(() => count.value * 2);
console.log(doubleCount.value); // 2

// 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ');
  }
});

fullName.value = 'John Doe'; // 触发setter
```

#### 4. watch / watchEffect - 侦听器

```javascript
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);
const user = reactive({ name: 'Alice', age: 18 });

// watch - 需要明确指定侦听源
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`);
});

// 侦听多个源
watch([count, () => user.name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('count或name变化了');
});

// 侦听reactive对象(深度侦听)
watch(user, (newVal, oldVal) => {
  console.log('user变化了');
}, { deep: true });

// 立即执行
watch(count, (val) => {
  console.log(val);
}, { immediate: true });

// watchEffect - 自动追踪依赖
watchEffect(() => {
  // 自动追踪count和user.name
  console.log(`Count: ${count.value}, Name: ${user.name}`);
});

// watchEffect会立即执行一次,watch默认不会

// 停止侦听
const stop = watchEffect(() => {
  console.log(count.value);
});

stop(); // 停止侦听
```

#### 5. 生命周期钩子

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,    // keep-alive
  onDeactivated   // keep-alive
} from 'vue';

// beforeCreate和created由setup()替代

onBeforeMount(() => {
  console.log('组件挂载前');
});

onMounted(() => {
  console.log('组件已挂载');
  // DOM操作、第三方库初始化
});

onBeforeUpdate(() => {
  console.log('组件更新前');
});

onUpdated(() => {
  console.log('组件已更新');
});

onBeforeUnmount(() => {
  console.log('组件卸载前');
  // 清理工作:定时器、事件监听
});

onUnmounted(() => {
  console.log('组件已卸载');
});
</script>
```

---

## Vue 3.0 响应式系统

### 核心原理:Proxy

Vue 3.0使用ES6的`Proxy`代替`Object.defineProperty`:

```javascript
/**
 * Vue 3.0响应式核心实现(简化版)
 */

// 依赖收集
let activeEffect = null;

class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach(effect => effect());
  }
}

// WeakMap存储对象的依赖关系
// WeakMap { target -> Map { key -> Dep } }
const targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  dep.depend();
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (dep) {
    dep.notify();
  }
}

/**
 * reactive: 创建响应式对象
 */
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);

      // 收集依赖
      track(target, key);

      // 如果属性值是对象,递归代理
      if (typeof result === 'object' && result !== null) {
        return reactive(result);
      }

      return result;
    },

    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);

      // 值确实改变才触发更新
      if (oldValue !== value) {
        trigger(target, key);
      }

      return result;
    },

    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        trigger(target, key);
      }

      return result;
    }
  };

  return new Proxy(target, handler);
}

/**
 * ref: 创建基本类型的响应式
 */
function ref(value) {
  return {
    _value: value,
    get value() {
      track(this, 'value');
      return this._value;
    },
    set value(newValue) {
      if (newValue !== this._value) {
        this._value = newValue;
        trigger(this, 'value');
      }
    }
  };
}

/**
 * watchEffect: 自动追踪依赖并执行
 */
function watchEffect(effect) {
  activeEffect = effect;
  effect(); // 立即执行,收集依赖
  activeEffect = null;
}

// 使用示例
const state = reactive({
  count: 0,
  user: {
    name: 'Alice'
  }
});

watchEffect(() => {
  console.log(`Count: ${state.count}`);
});

state.count++; // 输出: Count: 1

// 新增属性也能响应
state.newProp = 'hello';
watchEffect(() => {
  console.log(state.newProp); // 输出: hello
});

// 嵌套对象
watchEffect(() => {
  console.log(state.user.name);
});
state.user.name = 'Bob'; // 输出: Bob
```

### Proxy vs Object.defineProperty

| 特性 | Object.defineProperty (Vue 2) | Proxy (Vue 3) |
|------|------------------------------|---------------|
| **新增属性** | ❌ 无法检测,需Vue.set | ✅ 可以检测 |
| **删除属性** | ❌ 无法检测,需Vue.delete | ✅ 可以检测 |
| **数组索引** | ❌ 无法检测 | ✅ 可以检测 |
| **数组length** | ❌ 无法检测 | ✅ 可以检测 |
| **Map/Set** | ❌ 不支持 | ✅ 支持 |
| **性能** | 初始化时递归遍历 | 懒代理,访问时才代理 |
| **兼容性** | IE9+ | IE不支持,现代浏览器 |

**Vue 3.0的优势示例:**

```javascript
import { reactive } from 'vue';

const state = reactive({
  items: [1, 2, 3],
  map: new Map()
});

// ✅ 新增属性 - 可响应
state.newProp = 'hello';

// ✅ 删除属性 - 可响应
delete state.newProp;

// ✅ 数组索引 - 可响应
state.items[0] = 100;

// ✅ 数组length - 可响应
state.items.length = 0;

// ✅ Map/Set - 可响应
state.map.set('key', 'value');
```

### 响应式丢失陷阱

**❌ 错误示例:**

```javascript
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// ❌ 解构丢失响应式
const { count } = state;
count++; // 不会触发更新

// ❌ 展开丢失响应式
const newState = { ...state };
newState.count++; // 不会触发更新

// ❌ 赋值丢失响应式
let state = reactive({ count: 0 });
state = { count: 10 }; // 失去响应式
```

**✅ 正确方法:**

```javascript
import { reactive, toRefs, ref } from 'vue';

// 方法1: 使用toRefs
const state = reactive({ count: 0 });
const { count } = toRefs(state);
count.value++; // ✅ 响应式

// 方法2: 直接使用ref
const count = ref(0);
count.value++; // ✅ 响应式

// 方法3: 保持对象引用
const state = reactive({ count: 0 });
state.count++; // ✅ 响应式
```

---

## Vue 3.0 性能优化

### 1. 编译优化

**静态提升(Static Hoisting)**

Vue 3.0在编译时会识别静态内容并提升:

```vue
<!-- 源代码 -->
<template>
  <div>
    <p>静态文本</p>
    <p>{{ message }}</p>
  </div>
</template>

<!-- Vue 2.0编译结果(简化) -->
render() {
  return h('div', [
    h('p', '静态文本'),  // 每次渲染都创建
    h('p', this.message)
  ])
}

<!-- Vue 3.0编译结果(简化) -->
const hoisted1 = h('p', '静态文本') // ✅ 提升到外部,只创建一次

render() {
  return h('div', [
    hoisted1,  // 复用
    h('p', this.message)
  ])
}
```

**补丁标记(Patch Flags)**

Vue 3.0标记动态节点类型,减少Diff开销:

```vue
<template>
  <div>
    <p>{{ message }}</p>  <!-- 动态文本 -->
    <p :class="className">Text</p>  <!-- 动态class -->
  </div>
</template>

<!-- 编译结果 -->
render() {
  return h('div', [
    h('p', this.message, 1 /* TEXT */),  // 只需检查文本
    h('p', 'Text', 2 /* CLASS */)        // 只需检查class
  ])
}

// Diff时根据flag跳过不必要的检查
```

**事件监听缓存**

```vue
<!-- 源代码 -->
<button @click="handleClick">Click</button>

<!-- Vue 2.0: 每次渲染创建新函数 -->
render() {
  return h('button', {
    onClick: this.handleClick  // 新引用
  })
}

<!-- Vue 3.0: 缓存事件处理函数 -->
render() {
  return h('button', {
    onClick: cache[0] || (cache[0] = (...args) => this.handleClick(...args))
  })
}
```

### 2. Tree-shaking支持

Vue 3.0的API按需引入,减小包体积:

```javascript
// Vue 2.0: 全局API,全部打包
import Vue from 'vue';
Vue.nextTick(() => {});

// Vue 3.0: 按需引入,未使用的不打包
import { nextTick, ref, computed } from 'vue';
nextTick(() => {});

// 如果没用computed,不会打包computed相关代码
```

### 3. 性能对比

| 指标 | Vue 2.0 | Vue 3.0 | 提升 |
|------|---------|---------|------|
| 渲染速度 | 基准 | 1.3-2x | **30-100%** |
| 更新速度 | 基准 | 1.3-1.5x | **30-50%** |
| 内存占用 | 基准 | 0.5-0.6x | **减少40-50%** |
| 包体积(min+gzip) | 22.5kb | 13.5kb | **减少40%** |

### 4. 组件级性能优化技巧

**使用v-once**

```vue
<!-- 只渲染一次,后续不更新 -->
<p v-once>{{ initialMessage }}</p>
```

**使用v-memo (Vue 3.2+)**

```vue
<!-- 依赖项未变化时跳过更新 -->
<div v-memo="[user.id, user.name]">
  <p>{{ user.name }}</p>
  <p>{{ user.email }}</p>
</div>
```

**异步组件**

```javascript
// 路由级别代码分割
const UserProfile = () => import('./UserProfile.vue');

// 组件懒加载
<script setup>
import { defineAsyncComponent } from 'vue';

const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
);
</script>
```

**虚拟滚动**

```vue
<!-- 大列表优化 -->
<RecycleScroller
  :items="items"
  :item-size="50"
  key-field="id"
  v-slot="{ item }"
>
  <div>{{ item.name }}</div>
</RecycleScroller>
```

---

## 核心差异对比

### Vue 2.0 vs Vue 3.0 完整对比表

| 特性 | Vue 2.0 | Vue 3.0 | 说明 |
|------|---------|---------|------|
| **响应式** | Object.defineProperty | Proxy | Vue 3性能更好,支持更多场景 |
| **API风格** | Options API | Composition API | Vue 3向下兼容Options API |
| **生命周期** | beforeCreate/created等 | onMounted/onUnmounted等 | setup替代beforeCreate/created |
| **根节点** | 必须单根节点 | 支持多根节点(Fragment) | Vue 3更灵活 |
| **TypeScript** | 部分支持 | 完整支持 | Vue 3用TS重写 |
| **性能** | 基准 | 快1.3-2倍 | 编译优化+Proxy |
| **包体积** | 22.5kb (min+gzip) | 13.5kb | 减少40% |
| **Tree-shaking** | 不支持 | 支持 | 按需引入 |
| **Teleport** | ❌ | ✅ | 组件渲染到DOM其他位置 |
| **Suspense** | ❌ | ✅ (实验性) | 异步组件loading状态 |
| **自定义渲染器** | 困难 | 简单 | createRenderer API |
| **v-model** | 单个 | 多个v-model | Vue 3支持多个 |
| **过滤器(filters)** | ✅ | ❌ (移除) | 用methods/computed替代 |

### API变更详解

#### 1. 创建应用实例

```javascript
// Vue 2.0
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.component('MyComponent', MyComponent);
Vue.use(VueRouter);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

// Vue 3.0
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.config.globalProperties.$http = axios;
app.component('MyComponent', MyComponent);
app.use(router);
app.use(store);

app.mount('#app');
```

**变化:**
- ✅ 多应用实例互不影响
- ✅ 配置作用域隔离
- ✅ 更好的TypeScript类型推导

#### 2. v-model变化

```vue
<!-- Vue 2.0 -->
<Child v-model="value" />
<!-- 等价于 -->
<Child :value="value" @input="value = $event" />

<!-- 自定义prop/event -->
<Child v-model="value" model="checked" event="change" />

<!-- Vue 3.0 -->
<Child v-model="value" />
<!-- 等价于 -->
<Child :modelValue="value" @update:modelValue="value = $event" />

<!-- 多个v-model -->
<Child
  v-model:title="title"
  v-model:content="content"
/>
```

**组件实现:**

```vue
<!-- Vue 2.0 -->
<script>
export default {
  props: ['value'],
  methods: {
    updateValue(newValue) {
      this.$emit('input', newValue);
    }
  }
}
</script>

<!-- Vue 3.0 -->
<script setup>
defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const updateValue = (newValue) => {
  emit('update:modelValue', newValue);
};
</script>
```

#### 3. 生命周期映射

| Vue 2.0 | Vue 3.0 Composition API |
|---------|------------------------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |
| errorCaptured | onErrorCaptured |
| - | onRenderTracked (新增) |
| - | onRenderTriggered (新增) |

#### 4. 移除的API

```javascript
// ❌ Vue 3.0移除的API

// 1. 过滤器(filters)
{{ message | capitalize }}  // ❌ 移除
{{ capitalize(message) }}   // ✅ 使用函数

// 2. $on/$off/$once
this.$on('event', handler);  // ❌ 移除
// ✅ 使用mitt或event bus替代

// 3. $children
this.$children;  // ❌ 移除
// ✅ 使用ref或provide/inject

// 4. inline-template
<my-component inline-template>  // ❌ 移除
```

### Vue 3.0新特性

#### 1. Fragment(多根节点)

```vue
<!-- Vue 2.0: 必须单根 -->
<template>
  <div>  <!-- 额外的包裹元素 -->
    <h1>Title</h1>
    <p>Content</p>
  </div>
</template>

<!-- Vue 3.0: 支持多根 -->
<template>
  <h1>Title</h1>
  <p>Content</p>
</template>
```

#### 2. Teleport(传送门)

```vue
<!-- 将组件渲染到DOM的其他位置 -->
<template>
  <div>
    <h1>My App</h1>

    <!-- 渲染到body下 -->
    <Teleport to="body">
      <div class="modal">
        <p>Modal content</p>
      </div>
    </Teleport>
  </div>
</template>

<!-- 实际DOM结构 -->
<body>
  <div id="app">
    <div>
      <h1>My App</h1>
    </div>
  </div>

  <!-- modal在body下,而非app内 -->
  <div class="modal">
    <p>Modal content</p>
  </div>
</body>
```

**应用场景:**
- 模态框(Modal)
- 通知(Notification)
- 全屏组件

#### 3. Suspense(异步组件)

```vue
<template>
  <Suspense>
    <!-- 异步组件 -->
    <template #default>
      <AsyncComponent />
    </template>

    <!-- loading状态 -->
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

// 异步组件支持async setup
const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>

<!-- AsyncComponent.vue -->
<script setup>
// async setup
const data = await fetch('/api/data');
</script>
```

---

## TypeScript支持

### Vue 2.0的TypeScript问题

```typescript
// Vue 2.0: this类型推导困难
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++;  // this类型推导不准确
    }
  }
}
```

### Vue 3.0完美支持TypeScript

```typescript
// Vue 3.0: 完整的类型推导
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  setup() {
    // 自动类型推导
    const count = ref(0);        // Ref<number>
    const message = ref('hello'); // Ref<string>

    const doubleCount = computed(() => count.value * 2); // ComputedRef<number>

    const increment = () => {
      count.value++;  // ✅ 类型安全
    };

    return {
      count,
      message,
      doubleCount,
      increment
    };
  }
});
```

**script setup + TypeScript**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

// 类型注解
const count = ref<number>(0);
const message = ref<string>('hello');

// Props类型
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// Emits类型
interface Emits {
  (e: 'update', value: number): void;
  (e: 'delete', id: string): void;
}

const emit = defineEmits<Emits>();

// 复杂类型
interface User {
  id: number;
  name: string;
  email: string;
}

const user = ref<User>({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

// Computed类型自动推导
const userName = computed(() => user.value.name); // ComputedRef<string>
</script>
```

---

## 迁移指南

### 从Vue 2.0迁移到Vue 3.0

**1. 评估项目**

- ✅ 适合迁移: 使用Vue 2.6+,代码规范,测试覆盖好
- ⚠️ 谨慎迁移: Vue 2.6以下,大量使用已废弃API
- ❌ 暂缓迁移: 依赖不兼容的第三方库

**2. 升级步骤**

```bash
# 1. 升级到Vue 2.7(过渡版本,支持部分Vue 3特性)
npm install vue@2.7

# 2. 使用@vue/compat(兼容模式)
npm install vue@3 @vue/compat

# 3. 配置构建工具
# vite.config.js
export default {
  resolve: {
    alias: {
      vue: '@vue/compat'
    }
  }
}

# 4. 启用兼容模式
import { createApp } from 'vue';

const app = createApp(App);

// 全局配置兼容行为
app.config.compilerOptions.compatConfig = {
  MODE: 2  // Vue 2模式
};
```

**3. 逐步迁移**

```javascript
// 按组件配置兼容性
export default {
  compatConfig: {
    MODE: 3,  // Vue 3模式
    COMPONENT_V_MODEL: false  // 使用Vue 2的v-model
  }
}
```

**4. 常见修改**

```javascript
// ❌ Vue 2.0
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

// ✅ Vue 3.0
import { createApp } from 'vue';
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');

// ❌ Vue 2.0
Vue.filter('capitalize', fn);
Vue.component('MyComponent', {});

// ✅ Vue 3.0
app.config.globalProperties.$filters = { capitalize: fn };
app.component('MyComponent', {});

// ❌ Vue 2.0
this.$on('event', handler);

// ✅ Vue 3.0
import mitt from 'mitt';
const emitter = mitt();
emitter.on('event', handler);
```

**5. 官方迁移工具**

```bash
# 安装迁移辅助工具
npm install -g @vue/cli-plugin-vue-next

# 运行迁移
vue migrate
```

---

## 模板语法

### 插值

```vue
<template>
  <!-- 文本插值 -->
  <p>{{ message }}</p>

  <!-- HTML插值(危险,慎用) -->
  <div v-html="rawHtml"></div>

  <!-- 属性绑定 -->
  <div :id="dynamicId"></div>
  <button :disabled="isDisabled">Button</button>

  <!-- JavaScript表达式 -->
  <p>{{ count + 1 }}</p>
  <p>{{ ok ? 'YES' : 'NO' }}</p>
  <p>{{ message.split('').reverse().join('') }}</p>

  <!-- ❌ 不支持语句 -->
  <!-- {{ var a = 1 }} -->
  <!-- {{ if (ok) { return message } }} -->
</template>
```

### 指令缩写

```vue
<!-- v-bind缩写 -->
<a v-bind:href="url">Link</a>
<a :href="url">Link</a>

<!-- v-on缩写 -->
<button v-on:click="doSomething">Click</button>
<button @click="doSomething">Click</button>

<!-- v-slot缩写 -->
<template v-slot:header>
  <h1>Header</h1>
</template>
<template #header>
  <h1>Header</h1>
</template>
```

### 动态参数

```vue
<!-- 动态属性名 -->
<a :[attributeName]="url">Link</a>

<!-- 动态事件名 -->
<button @[eventName]="handler">Click</button>

<!-- 示例 -->
<script setup>
import { ref } from 'vue';

const attributeName = ref('href');
const eventName = ref('click');
</script>
```

---

## 指令系统

### 内置指令详解

#### v-if / v-else-if / v-else

```vue
<template>
  <!-- 条件渲染 -->
  <div v-if="type === 'A'">
    Type A
  </div>
  <div v-else-if="type === 'B'">
    Type B
  </div>
  <div v-else>
    Other
  </div>

  <!-- template包装多个元素 -->
  <template v-if="ok">
    <h1>Title</h1>
    <p>Content</p>
  </template>
</template>
```

**v-if vs v-show:**

| 特性 | v-if | v-show |
|------|------|--------|
| 编译 | 真正的条件渲染 | 始终渲染,CSS切换 |
| 性能 | 切换开销大 | 初始渲染开销大 |
| 适用 | 不频繁切换 | 频繁切换 |

```vue
<!-- v-if: DOM不存在 -->
<div v-if="show">Content</div>

<!-- v-show: display:none -->
<div v-show="show">Content</div>
```

#### v-for

```vue
<template>
  <!-- 数组 -->
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }}: {{ item.name }}
  </li>

  <!-- 对象 -->
  <div v-for="(value, key, index) in object" :key="key">
    {{ index }}. {{ key }}: {{ value }}
  </div>

  <!-- 数字范围 -->
  <span v-for="n in 10" :key="n">{{ n }}</span>

  <!-- ✅ 必须使用key -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
]);

const object = ref({
  name: 'Alice',
  age: 18,
  city: 'Beijing'
});
</script>
```

**v-if + v-for (不推荐同时使用)**

```vue
<!-- ❌ Vue 2: v-for优先级更高 -->
<li v-for="item in items" v-if="item.isActive" :key="item.id">
  {{ item.name }}
</li>

<!-- ❌ Vue 3: v-if优先级更高,访问不到item -->
<li v-for="item in items" v-if="item.isActive" :key="item.id">
  {{ item.name }}
</li>

<!-- ✅ 正确写法:使用computed过滤 -->
<li v-for="item in activeItems" :key="item.id">
  {{ item.name }}
</li>

<script setup>
import { computed } from 'vue';

const activeItems = computed(() =>
  items.value.filter(item => item.isActive)
);
</script>
```

#### v-on

```vue
<template>
  <!-- 基本用法 -->
  <button @click="handleClick">Click</button>

  <!-- 内联语句 -->
  <button @click="count++">+1</button>

  <!-- 传递参数 -->
  <button @click="handleClick(item, $event)">Click</button>

  <!-- 修饰符 -->
  <button @click.stop="handleClick">Stop</button>
  <button @click.prevent="handleClick">Prevent</button>
  <button @click.stop.prevent="handleClick">Stop & Prevent</button>

  <!-- 键盘修饰符 -->
  <input @keyup.enter="submit">
  <input @keyup.esc="cancel">
  <input @keyup.ctrl.enter="send">

  <!-- 鼠标修饰符 -->
  <button @click.left="handleLeft">Left</button>
  <button @click.right="handleRight">Right</button>

  <!-- 系统修饰符 -->
  <input @keyup.ctrl="onCtrl">
  <button @click.ctrl="onClick">Ctrl+Click</button>

  <!-- .exact修饰符(精确匹配) -->
  <button @click.ctrl.exact="onCtrlClick">只有Ctrl</button>

  <!-- 多个事件 -->
  <button @click="handleClick" @mouseenter="handleEnter">
    Hover or Click
  </button>
</template>

<script setup>
const handleClick = (item, event) => {
  event.stopPropagation();
  console.log(item);
};
</script>
```

**事件修饰符:**

| 修饰符 | 说明 | 等价于 |
|--------|------|--------|
| .stop | 阻止冒泡 | event.stopPropagation() |
| .prevent | 阻止默认 | event.preventDefault() |
| .capture | 捕获模式 | addEventListener第三参数 |
| .self | 只在元素本身触发 | event.target === event.currentTarget |
| .once | 只触发一次 | addEventListener once选项 |
| .passive | 滚动性能优化 | addEventListener passive选项 |

#### v-model

```vue
<template>
  <!-- 文本 -->
  <input v-model="text" />

  <!-- 多行文本 -->
  <textarea v-model="message"></textarea>

  <!-- 复选框(单个) -->
  <input type="checkbox" v-model="checked" />

  <!-- 复选框(多个) -->
  <input type="checkbox" value="Apple" v-model="fruits" />
  <input type="checkbox" value="Banana" v-model="fruits" />

  <!-- 单选框 -->
  <input type="radio" value="A" v-model="picked" />
  <input type="radio" value="B" v-model="picked" />

  <!-- 下拉框 -->
  <select v-model="selected">
    <option value="A">A</option>
    <option value="B">B</option>
  </select>

  <!-- 修饰符 -->
  <input v-model.lazy="text" />      <!-- change事件触发 -->
  <input v-model.number="age" />     <!-- 转为数字 -->
  <input v-model.trim="message" />   <!-- 去除首尾空格 -->
</template>

<script setup>
import { ref } from 'vue';

const text = ref('');
const message = ref('');
const checked = ref(false);
const fruits = ref([]);
const picked = ref('');
const selected = ref('');
const age = ref(0);
</script>
```

### 自定义指令

```vue
<script setup>
import { ref } from 'vue';

// 局部指令
const vFocus = {
  mounted(el) {
    el.focus();
  }
};

// 带参数的指令
const vColor = {
  mounted(el, binding) {
    el.style.color = binding.value;
  },
  updated(el, binding) {
    el.style.color = binding.value;
  }
};
</script>

<template>
  <!-- 使用自定义指令 -->
  <input v-focus />
  <p v-color="'red'">Red Text</p>
</template>

<!-- 全局指令 -->
<script>
// main.js
const app = createApp(App);

app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

app.directive('color', {
  mounted(el, binding) {
    el.style.color = binding.value;
  },
  updated(el, binding) {
    el.style.color = binding.value;
  }
});
</script>
```

**指令钩子:**

```javascript
const myDirective = {
  // 指令绑定到元素前
  created(el, binding, vnode, prevVnode) {},

  // 元素插入DOM前
  beforeMount(el, binding, vnode, prevVnode) {},

  // 元素插入DOM后
  mounted(el, binding, vnode, prevVnode) {},

  // 组件更新前
  beforeUpdate(el, binding, vnode, prevVnode) {},

  // 组件更新后
  updated(el, binding, vnode, prevVnode) {},

  // 组件卸载前
  beforeUnmount(el, binding, vnode, prevVnode) {},

  // 组件卸载后
  unmounted(el, binding, vnode, prevVnode) {}
};

// binding对象包含:
{
  value: '', // 指令的值
  oldValue: '', // 旧值(仅updated/beforeUpdate)
  arg: '', // 指令参数 v-my-directive:arg
  modifiers: {}, // 修饰符对象 v-my-directive.foo.bar
  instance: {}, // 组件实例
  dir: {} // 指令定义对象
}
```

**实用指令示例:**

```javascript
// 1. v-lazy: 图片懒加载
app.directive('lazy', {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = binding.value;
        observer.disconnect();
      }
    });
    observer.observe(el);
  }
});

// 使用
<img v-lazy="imageUrl" />

// 2. v-debounce: 防抖
app.directive('debounce', {
  mounted(el, binding) {
    let timer;
    el.addEventListener('click', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        binding.value();
      }, 300);
    });
  }
});

// 使用
<button v-debounce="handleClick">Click</button>

// 3. v-permission: 权限控制
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding;
    const userPermissions = store.state.permissions;

    if (!userPermissions.includes(value)) {
      el.parentNode?.removeChild(el);
    }
  }
});

// 使用
<button v-permission="'admin'">删除</button>
```

---

## 插槽机制

### 基础插槽

```vue
<!-- 父组件 -->
<template>
  <MyButton>
    Click me
  </MyButton>
</template>

<!-- MyButton.vue -->
<template>
  <button class="btn">
    <slot></slot>  <!-- 插槽出口 -->
  </button>
</template>

<!-- 渲染结果 -->
<button class="btn">
  Click me
</button>
```

### 默认内容

```vue
<!-- MyButton.vue -->
<template>
  <button>
    <slot>默认文本</slot>
  </button>
</template>

<!-- 使用 -->
<MyButton></MyButton>  <!-- 显示: 默认文本 -->
<MyButton>自定义</MyButton>  <!-- 显示: 自定义 -->
```

### 具名插槽

```vue
<!-- 父组件 -->
<template>
  <Card>
    <template #header>
      <h1>标题</h1>
    </template>

    <template #default>
      <p>内容</p>
    </template>

    <template #footer>
      <button>确定</button>
    </template>
  </Card>
</template>

<!-- Card.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header"></slot>
    </header>

    <main>
      <slot></slot>  <!-- 默认插槽 -->
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

### 作用域插槽

```vue
<!-- 父组件 -->
<template>
  <UserList>
    <!-- 接收子组件传递的数据 -->
    <template #default="{ user, index }">
      <div>
        {{ index + 1 }}. {{ user.name }} ({{ user.age }}岁)
      </div>
    </template>
  </UserList>
</template>

<!-- UserList.vue -->
<template>
  <div>
    <div v-for="(user, index) in users" :key="user.id">
      <!-- 向插槽传递数据 -->
      <slot :user="user" :index="index"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const users = ref([
  { id: 1, name: 'Alice', age: 18 },
  { id: 2, name: 'Bob', age: 20 }
]);
</script>
```

**作用域插槽的解构:**

```vue
<!-- 解构prop -->
<UserList>
  <template #default="{ user }">
    {{ user.name }}
  </template>
</UserList>

<!-- 重命名 -->
<UserList>
  <template #default="{ user: person }">
    {{ person.name }}
  </template>
</UserList>

<!-- 默认值 -->
<UserList>
  <template #default="{ user = { name: '匿名' } }">
    {{ user.name }}
  </template>
</UserList>
```

### 动态插槽名

```vue
<template>
  <MyComponent>
    <template #[dynamicSlotName]>
      动态内容
    </template>
  </MyComponent>
</template>

<script setup>
import { ref } from 'vue';

const dynamicSlotName = ref('header');
</script>
```

### 插槽实战:通用列表组件

```vue
<!-- DataList.vue - 通用列表组件 -->
<template>
  <div class="data-list">
    <!-- 头部 -->
    <div class="header">
      <slot name="header" :total="items.length">
        <h2>列表 ({{ items.length }}项)</h2>
      </slot>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <slot name="loading">
        <p>加载中...</p>
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-else-if="items.length === 0" class="empty">
      <slot name="empty">
        <p>暂无数据</p>
      </slot>
    </div>

    <!-- 列表内容 -->
    <div v-else class="content">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="item"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :isFirst="index === 0"
          :isLast="index === items.length - 1"
        >
          {{ item }}
        </slot>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
  loading: Boolean
});
</script>

<!-- 使用DataList -->
<template>
  <DataList :items="users" :loading="loading">
    <!-- 自定义头部 -->
    <template #header="{ total }">
      <h1>用户列表 (共{{ total }}人)</h1>
      <button @click="refresh">刷新</button>
    </template>

    <!-- 自定义每项 -->
    <template #item="{ item, index, isFirst }">
      <div :class="{ first: isFirst }">
        <img :src="item.avatar" />
        <div>
          <p>{{ item.name }}</p>
          <small>{{ item.email }}</small>
        </div>
      </div>
    </template>

    <!-- 自定义空状态 -->
    <template #empty>
      <p>还没有用户</p>
      <button @click="addUser">添加用户</button>
    </template>

    <!-- 自定义底部 -->
    <template #footer>
      <button @click="loadMore">加载更多</button>
    </template>
  </DataList>
</template>
```

---

## 状态管理

### Vuex (Vue 2/3)

```javascript
// store/index.js
import { createStore } from 'vuex';

export default createStore({
  // 状态
  state() {
    return {
      count: 0,
      user: null,
      todos: []
    }
  },

  // Getters(计算属性)
  getters: {
    doneTodos(state) {
      return state.todos.filter(todo => todo.done);
    },
    doneTodosCount(state, getters) {
      return getters.doneTodos.length;
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id);
    }
  },

  // Mutations(同步修改)
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    }
  },

  // Actions(异步操作)
  actions: {
    async fetchUser({ commit }) {
      const user = await api.getUser();
      commit('SET_USER', user);
    },
    async addTodo({ commit }, text) {
      const todo = await api.createTodo(text);
      commit('ADD_TODO', todo);
    }
  },

  // Modules(模块化)
  modules: {
    cart: {
      namespaced: true,
      state: () => ({ items: [] }),
      mutations: {},
      actions: {}
    }
  }
});

// 组件中使用
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// 访问state
const count = computed(() => store.state.count);

// 访问getters
const doneTodos = computed(() => store.getters.doneTodos);

// 调用mutation
const increment = () => {
  store.commit('INCREMENT');
};

// 调用action
const fetchUser = () => {
  store.dispatch('fetchUser');
};
</script>
```

### Pinia (Vue 3推荐)

**Pinia的优势:**
- ✅ 更简洁的API,无mutations
- ✅ 完整的TypeScript支持
- ✅ 支持Composition API和Options API
- ✅ 模块化更灵活,无需嵌套
- ✅ 更好的DevTools支持

```javascript
// stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Composition API风格
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0);
  const user = ref(null);

  // getters
  const doubleCount = computed(() => count.value * 2);
  const isLoggedIn = computed(() => !!user.value);

  // actions
  function increment() {
    count.value++;
  }

  async function fetchUser() {
    user.value = await api.getUser();
  }

  return {
    count,
    user,
    doubleCount,
    isLoggedIn,
    increment,
    fetchUser
  };
});

// Options API风格
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: null
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    isLoggedIn: (state) => !!state.user
  },

  actions: {
    increment() {
      this.count++;
    },
    async fetchUser() {
      this.user = await api.getUser();
    }
  }
});

// 组件中使用
<script setup>
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();

// 保持响应式的解构
const { count, doubleCount } = storeToRefs(counterStore);

// actions可以直接解构
const { increment, fetchUser } = counterStore;

// 或直接使用
counterStore.increment();
</script>
```

**Pinia vs Vuex对比:**

| 特性 | Vuex | Pinia |
|------|------|-------|
| Mutations | 必须 | 无(直接修改state) |
| TypeScript | 部分支持 | 完整支持 |
| 模块化 | 嵌套模块 | 扁平化store |
| DevTools | 支持 | 更好的支持 |
| 包体积 | 较大 | 较小(1KB) |
| API | 复杂 | 简洁 |

---

## 路由管理

### Vue Router基础

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    // 路由参数作为props传递
    props: true
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/admin/Users.vue')
      }
    ]
  },
  {
    // 404页面
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
```

### 组件中使用路由

```vue
<template>
  <div>
    <!-- 路由链接 -->
    <router-link to="/">Home</router-link>
    <router-link :to="{ name: 'User', params: { id: 123 } }">
      User
    </router-link>

    <!-- 路由视图 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 编程式导航
const goToUser = (id) => {
  router.push({ name: 'User', params: { id } });
};

// 访问路由参数
const userId = computed(() => route.params.id);

// 访问查询参数
const search = computed(() => route.query.search);

// 监听路由变化
watch(() => route.params.id, (newId) => {
  fetchUser(newId);
});
</script>
```

---

## 服务端渲染

### SSR vs CSR

| 特性 | CSR (客户端渲染) | SSR (服务端渲染) |
|------|-----------------|-----------------|
| **首屏速度** | 慢 | 快 |
| **SEO** | 差 | 好 |
| **服务器压力** | 小 | 大 |
| **开发复杂度** | 简单 | 复杂 |
| **适用场景** | 后台管理系统 | 内容网站、电商 |

### Nuxt.js (Vue SSR框架)

```bash
# 创建Nuxt项目
npx nuxi init my-app
cd my-app
npm install
npm run dev
```

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
// 服务端+客户端都会执行
const title = ref('Blog');

// 仅在服务端执行数据获取
const { data: posts } = await useFetch('/api/posts');

// SEO
useHead({
  title: 'My Blog',
  meta: [
    { name: 'description', content: 'A blog about Vue' }
  ]
});
</script>
```

---

## 最佳实践

### 1. 组件设计原则

**单一职责:**
```vue
<!-- ❌ 不好: 职责过多 -->
<UserProfileWithPostsAndComments />

<!-- ✅ 好: 拆分组件 -->
<UserProfile />
<UserPosts />
<UserComments />
```

**Props向下,事件向上:**
```vue
<!-- ✅ 清晰的数据流 -->
<ChildComponent
  :data="parentData"
  @update="handleUpdate"
/>
```

### 2. 性能优化

```vue
<!-- v-once: 静态内容 -->
<div v-once>{{ staticContent }}</div>

<!-- v-memo: 条件缓存(Vue 3.2+) -->
<div v-memo="[item.id]">{{ item.name }}</div>

<!-- computed缓存 -->
<script setup>
// ✅ 使用computed
const filteredList = computed(() =>
  list.value.filter(item => item.active)
);

// ❌ 不要在template中计算
<div v-for="item in list.filter(i => i.active)"></div>
</script>

<!-- 异步组件 -->
<script setup>
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
);
</script>

<!-- 虚拟滚动 -->
<virtual-list :items="10000" :item-height="50" />
```

### 3. 代码组织

```
src/
├── assets/          # 静态资源
├── components/      # 通用组件
│   ├── base/       # 基础组件(BaseButton, BaseInput)
│   ├── common/     # 业务通用组件
│   └── layout/     # 布局组件
├── composables/     # 组合函数
│   ├── useAuth.js
│   └── useApi.js
├── stores/          # Pinia stores
├── router/          # 路由配置
├── views/           # 页面组件
├── utils/           # 工具函数
└── App.vue
```

### 4. 命名规范

```vue
<!-- 组件名: PascalCase -->
<MyComponent />

<!-- Props: camelCase -->
<MyComponent userName="Alice" />

<!-- 事件: kebab-case -->
<MyComponent @update-user="handler" />

<!-- 文件名: PascalCase或kebab-case -->
MyComponent.vue
my-component.vue
```

### 5. TypeScript类型

```typescript
// 定义Props类型
interface Props {
  title: string;
  count?: number;
  user: {
    id: number;
    name: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// 定义Emits类型
interface Emits {
  (e: 'update', value: number): void;
  (e: 'delete', id: string): void;
}

const emit = defineEmits<Emits>();
```

### 6. 错误处理

```vue
<script setup>
import { onErrorCaptured } from 'vue';

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  console.error('Error:', err);
  console.log('Component:', instance);
  console.log('Info:', info);

  // 返回false阻止错误继续传播
  return false;
});

// 全局错误处理(main.js)
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
};
</script>
```

---

## 总结

### Vue核心优势

1. **渐进式**: 从简单到复杂,按需采用
2. **响应式**: 数据驱动,自动更新视图
3. **组件化**: 可复用,易维护
4. **生态丰富**: Vue Router, Vuex/Pinia, Nuxt等
5. **易学易用**: 简洁的API,完善的文档

### Vue 2 vs Vue 3选择建议

**选择Vue 2的场景:**
- 老项目维护
- 依赖不支持Vue 3的库
- IE浏览器兼容需求

**选择Vue 3的场景:**
- ✅ 新项目(强烈推荐)
- ✅ 需要更好的性能
- ✅ 使用TypeScript
- ✅ 大型复杂应用

### 学习路线

```
1. 基础阶段(1-2周)
   - 模板语法
   - 指令系统
   - 组件基础
   - 生命周期

2. 进阶阶段(2-4周)
   - Composition API
   - 状态管理(Pinia)
   - 路由(Vue Router)
   - 构建工具(Vite)

3. 实战阶段(4-8周)
   - 实际项目开发
   - 性能优化
   - SSR/SSG
   - 测试

4. 深入阶段(持续)
   - 源码阅读
   - 自定义插件
   - 贡献开源
```

### 参考资源

- **官方文档**: https://cn.vuejs.org/
- **Vue Mastery**: https://www.vuemastery.com/
- **Vue School**: https://vueschool.io/
- **Awesome Vue**: https://github.com/vuejs/awesome-vue
- **Vue RFCs**: https://github.com/vuejs/rfcs

---

*最后更新: 2025年*
*适用于Vue 2.x和Vue 3.x版本*
