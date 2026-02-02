# Vite 全面解析 - 前端开发者版

> 新一代前端构建工具,深入理解Vite核心原理、配置详解与性能优化

## 📚 目录导航

### 第一部分:Vite核心概念
- [Vite简介](#vite简介)
- [为什么选择Vite](#为什么选择vite)
- [Vite vs Webpack](#vite-vs-webpack)

### 第二部分:核心原理
- [基于ES Modules](#基于es-modules)
- [依赖预构建](#依赖预构建)
- [热模块替换(HMR)](#热模块替换hmr)
- [生产构建](#生产构建)

### 第三部分:快速上手
- [项目创建](#项目创建)
- [项目结构](#项目结构)
- [基础使用](#基础使用)

### 第四部分:配置详解
- [基础配置](#基础配置)
- [开发服务器配置](#开发服务器配置)
- [构建配置](#构建配置)
- [插件配置](#插件配置)
- [优化配置](#优化配置)

### 第五部分:性能优化
- [开发环境优化](#开发环境优化)
- [生产构建优化](#生产构建优化)
- [代码分割策略](#代码分割策略)
- [资源优化](#资源优化)

### 第六部分:插件开发
- [插件机制](#插件机制)
- [常用钩子](#常用钩子)
- [自定义插件](#自定义插件)

### 第七部分:实战应用
- [多页应用配置](#多页应用配置)
- [环境变量管理](#环境变量管理)
- [代理配置](#代理配置)
- [CSS预处理器](#css预处理器)
- [TypeScript集成](#typescript集成)

### 第八部分:最佳实践
- [项目规范](#项目规范)
- [常见问题](#常见问题)
- [迁移指南](#迁移指南)

---

## Vite简介

### 什么是Vite?

Vite (法语意为"快速",发音 `/vit/`,类似"veet") 是一种新型前端构建工具,由Vue.js作者尤雨溪开发。

**核心特点:**
- ⚡ **极速的服务启动**: 使用原生ES模块,无需打包
- 🔥 **即时的热模块更新**: 无论应用大小,HMR始终快速
- 🛠️ **丰富的功能**: 开箱即用TypeScript、JSX、CSS等
- 📦 **优化的构建**: 预配置的Rollup构建,输出高度优化的静态资源
- 🔩 **通用的插件**: 与Rollup插件兼容的插件接口
- 🔑 **完全类型化**: TypeScript编写,类型完备

### Vite的发展历程

| 版本 | 发布时间 | 重大特性 |
|------|---------|----------|
| Vite 1.0 | 2020年10月 | 首个稳定版,仅支持Vue |
| Vite 2.0 | 2021年2月 | 框架无关,插件API,SSR支持 |
| Vite 3.0 | 2022年7月 | 冷启动优化,构建性能提升 |
| Vite 4.0 | 2022年12月 | Rollup 3,环境API改进 |
| Vite 5.0 | 2023年11月 | 废弃CJS Node API,使用Rollup 4 |
| Vite 6.0 | 2024年 | Environment API,性能优化 |

---

## 为什么选择Vite

### 传统构建工具的痛点

**Webpack等传统bundler的问题:**

```
启动开发服务器:
  源代码 → Bundle(打包所有模块) → 开发服务器启动
  ⏱️ 随着项目增大,启动时间线性增长(几十秒甚至几分钟)

热更新:
  修改代码 → 重新构建整个bundle → 更新页面
  ⏱️ 随着项目增大,HMR速度下降
```

**Vite的解决方案:**

```
启动开发服务器:
  启动开发服务器(立即) → 按需编译源代码
  ⚡ 始终快速启动(通常 < 1秒)

热更新:
  修改代码 → 只编译修改的模块 → 精确更新
  ⚡ 始终快速HMR(通常 < 50ms)
```

### 性能对比

**实际项目启动时间对比 (大型项目 ~1000个模块):**

| 构建工具 | 冷启动时间 | HMR时间 |
|---------|-----------|--------|
| Webpack 4 | 50-80秒 | 1-3秒 |
| Webpack 5 | 30-50秒 | 0.5-2秒 |
| **Vite** | **1-3秒** | **<100ms** |

---

## Vite vs Webpack

### 核心差异对比

| 特性 | Webpack | Vite |
|------|---------|------|
| **开发模式** | Bundle模式(打包所有模块) | No-Bundle模式(ESM原生支持) |
| **启动速度** | 慢(需要打包) | 极快(即时启动) |
| **热更新速度** | 随项目增大变慢 | 始终快速 |
| **生产构建** | Webpack | Rollup |
| **配置复杂度** | 复杂 | 简单 |
| **插件生态** | 非常丰富 | 快速增长 |
| **成熟度** | 非常成熟 | 较新但稳定 |
| **浏览器支持** | ES5+ | 现代浏览器(ES2015+) |
| **学习曲线** | 陡峭 | 平缓 |

### 工作流程对比

**Webpack工作流程:**

```
开发环境:
源代码
  ↓
解析所有依赖
  ↓
转换(Babel/TS)
  ↓
打包成bundle
  ↓
启动服务器
  ↓
浏览器加载bundle

修改代码
  ↓
重新打包(增量)
  ↓
HMR更新
```

**Vite工作流程:**

```
开发环境:
启动服务器(即时)
  ↓
浏览器请求入口文件
  ↓
按需编译&转换(仅请求的文件)
  ↓
返回ESM格式代码
  ↓
浏览器原生加载

修改代码
  ↓
重新编译(仅修改的模块)
  ↓
HMR精确更新(利用ESM边界)
```

### 适用场景

**选择Webpack的场景:**
- 需要支持IE等老旧浏览器
- 大量使用Webpack特有插件/loader
- 需要极致的生产构建自定义
- 团队对Webpack非常熟悉

**选择Vite的场景:**
- ✅ 新项目(强烈推荐)
- ✅ 现代浏览器环境
- ✅ 需要极快的开发体验
- ✅ Vue/React/Svelte等现代框架
- ✅ TypeScript项目
- ✅ 中小型到大型项目

---

## 基于ES Modules

### 原生ESM支持

Vite在开发环境利用浏览器对ES Modules的原生支持:

```html
<!-- 浏览器原生支持 -->
<script type="module">
  import { createApp } from 'vue'
  import App from './App.vue'

  createApp(App).mount('#app')
</script>
```

**工作原理:**

```
浏览器请求: /src/main.js
  ↓
Vite服务器拦截请求
  ↓
编译TypeScript/JSX等
  ↓
返回ESM格式的JavaScript
  ↓
浏览器解析import语句
  ↓
发起新的请求(如 /src/App.vue)
  ↓
Vite按需编译返回
  ↓
递归加载所有依赖
```

**示例:模块转换过程**

```typescript
// 源代码: src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

// ↓ Vite转换后 ↓

// 浏览器接收的代码
import { createApp } from '/@modules/vue'  // ← 依赖重写
import App from '/src/App.vue?t=1234567'   // ← 添加时间戳
import '/src/style.css?t=1234567'

createApp(App).mount('#app')
```

### 依赖路径重写

Vite会重写裸模块导入(bare imports):

```javascript
// 源代码
import { createApp } from 'vue'

// Vite重写为
import { createApp } from '/@modules/vue'

// 实际指向
node_modules/.vite/deps/vue.js
```

---

## 依赖预构建

### 为什么需要预构建?

**问题1: CommonJS和UMD模块兼容性**

```javascript
// 很多npm包仍使用CommonJS
const lodash = require('lodash')

// Vite需要将其转换为ESM
import lodash from 'lodash'
```

**问题2: 性能优化(模块过多)**

```javascript
// lodash-es有600+个模块
import { debounce } from 'lodash-es'

// 浏览器需要发起600+个HTTP请求 ❌

// Vite预构建将其打包为单个文件
// 只需1个HTTP请求 ✅
```

### 预构建流程

```
1. 扫描阶段
   ↓
分析import语句,找到所有依赖
   ↓
2. 构建阶段
   ↓
使用esbuild打包依赖
   ↓
转换为ESM格式
   ↓
生成到 node_modules/.vite/deps/
   ↓
3. 缓存
   ↓
下次启动直接使用缓存
```

**预构建配置:**

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    // 手动指定需要预构建的依赖
    include: [
      'vue',
      'axios',
      'lodash-es'
    ],

    // 排除某些依赖
    exclude: [
      'your-local-package'
    ],

    // esbuild配置
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
}
```

### 依赖发现

Vite自动发现依赖的方式:

```javascript
// ✅ 会被预构建
import { createApp } from 'vue'
import axios from 'axios'

// ✅ 动态导入也会被发现
const module = await import('lodash-es')

// ❌ 不会被自动发现(需要手动include)
const moduleName = 'some-package'
import(moduleName)
```

### 强制重新预构建

```bash
# 删除缓存并重启
rm -rf node_modules/.vite

# 或使用命令行参数
vite --force

# 或在浏览器中
# 地址栏添加 ?force 参数重新加载
```

---

## 热模块替换(HMR)

### HMR工作原理

**Vite的HMR机制:**

```
1. 文件监听
   ↓ (文件改变)
2. 模块图分析
   ↓ (找到受影响的模块)
3. WebSocket通知浏览器
   ↓
4. 浏览器接收更新
   ↓
5. 执行HMR更新(精确更新,保持状态)
```

**HMR边界:**

```javascript
// main.js (HMR边界)
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

if (import.meta.hot) {
  import.meta.hot.accept() // 接受自身更新
}

// 当App.vue改变时
// Vue会处理组件的HMR
// 只更新App组件,不刷新整个页面
```

### HMR API

```javascript
// 接受自身更新
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // newModule是更新后的模块
    console.log('模块已更新:', newModule)
  })
}

// 接受依赖更新
import { foo } from './foo.js'

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // 使用新的foo模块
    foo = newFoo.foo
  })
}

// 处理模块失效
if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // 清理副作用
    // data在下次更新时可用
    data.count = count
  })
}

// 监听自定义事件
if (import.meta.hot) {
  import.meta.hot.on('custom-event', (data) => {
    console.log('收到自定义事件:', data)
  })
}

// 发送自定义事件到客户端
import.meta.hot.send('custom-event', { message: 'Hello' })
```

### Vue组件的HMR

Vue通过`@vitejs/plugin-vue`内置支持:

```vue
<!-- Counter.vue -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

// 修改template → 只更新template,保留count状态 ✅
// 修改script → 重新加载组件,状态丢失 (这是正常的)
</script>
```

**Vue HMR行为:**

| 修改内容 | HMR行为 | 状态保留 |
|---------|---------|---------|
| `<template>` | 原地更新 | ✅ 保留 |
| `<style>` | 原地更新 | ✅ 保留 |
| `<script>` | 重新加载组件 | ❌ 丢失 |
| Props/Emits | 重新加载组件 | ❌ 丢失 |

### React的HMR

React通过`@vitejs/plugin-react`支持Fast Refresh:

```jsx
// Counter.jsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}

// 修改JSX → 保留状态更新 ✅
// 修改Hooks → 保留状态更新 ✅
// 组件重命名 → 完全刷新 (这是正常的)
```

---

## 生产构建

### Rollup构建

Vite使用Rollup进行生产构建:

**为什么不用esbuild?**

虽然esbuild非常快,但目前还不适合生产构建:
- 代码分割不够成熟
- CSS处理有限
- 灵活性不足

**Rollup优势:**
- ✅ 成熟的代码分割
- ✅ 丰富的插件生态
- ✅ 更小的bundle体积(Tree-shaking)

### 构建流程

```
源代码
  ↓
1. 入口分析
  ↓
2. 依赖解析(所有模块)
  ↓
3. 转换(插件处理)
  ↓
4. Tree-shaking(删除死代码)
  ↓
5. 代码分割
  ↓
6. 压缩(terser)
  ↓
7. 输出到dist/
```

### 构建优化

```javascript
// vite.config.js
export default {
  build: {
    // 目标浏览器
    target: 'es2015',

    // 输出目录
    outDir: 'dist',

    // 静态资源目录
    assetsDir: 'assets',

    // 小于此阈值的资源内联为base64
    assetsInlineLimit: 4096, // 4kb

    // CSS代码分割
    cssCodeSplit: true,

    // 生成sourcemap
    sourcemap: false,

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // 删除console
        drop_debugger: true,     // 删除debugger
        pure_funcs: ['console.log'] // 删除特定函数调用
      }
    },

    // Rollup配置
    rollupOptions: {
      output: {
        // 手动分包
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus'],
          'utils': ['axios', 'dayjs', 'lodash-es']
        },

        // 自定义文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    },

    // chunk大小警告限制
    chunkSizeWarningLimit: 1000, // 1000kb

    // 启用/禁用CSS代码分割
    cssCodeSplit: true,

    // 预加载指令
    modulePreload: {
      polyfill: true
    }
  }
}
```

---

## 项目创建

### 使用官方模板

```bash
# npm 6.x
npm create vite@latest my-app --template vue

# npm 7+
npm create vite@latest my-app -- --template vue

# yarn
yarn create vite my-app --template vue

# pnpm
pnpm create vite my-app --template vue

# bun
bunx create-vite my-app --template vue
```

### 可用模板

| 模板 | 说明 |
|------|------|
| `vanilla` | 原生JavaScript |
| `vanilla-ts` | TypeScript |
| `vue` | Vue 3 + JavaScript |
| `vue-ts` | Vue 3 + TypeScript |
| `react` | React + JavaScript |
| `react-ts` | React + TypeScript |
| `react-swc` | React + SWC |
| `react-swc-ts` | React + SWC + TypeScript |
| `preact` | Preact |
| `preact-ts` | Preact + TypeScript |
| `lit` | Lit |
| `lit-ts` | Lit + TypeScript |
| `svelte` | Svelte |
| `svelte-ts` | Svelte + TypeScript |
| `solid` | Solid |
| `solid-ts` | Solid + TypeScript |
| `qwik` | Qwik |
| `qwik-ts` | Qwik + TypeScript |

### 社区模板

```bash
# 使用degit克隆模板
npx degit user/repo my-app

# 示例
npx degit vitejs/vite/packages/create-vite/template-vue my-app
```

### 手动创建项目

```bash
# 1. 创建项目目录
mkdir my-vite-app
cd my-vite-app

# 2. 初始化package.json
npm init -y

# 3. 安装Vite
npm install -D vite

# 4. 安装框架(以Vue为例)
npm install vue

# 5. 创建基本文件
```

**基本文件结构:**

```
my-vite-app/
├── index.html          # 入口HTML
├── package.json
├── vite.config.js      # Vite配置
└── src/
    ├── main.js         # 入口JS
    ├── App.vue
    └── style.css
```

**index.html:**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <!-- type="module" 是关键 -->
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**package.json:**

```json
{
  "name": "my-vite-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## 项目结构

### 标准项目结构

```
my-vite-project/
├── public/                 # 静态资源(不会被处理)
│   └── favicon.ico
├── src/
│   ├── assets/            # 需要处理的静态资源
│   │   ├── images/
│   │   ├── styles/
│   │   └── logo.svg
│   ├── components/        # 组件
│   │   ├── common/
│   │   └── layout/
│   ├── composables/       # 组合函数(Vue)
│   ├── hooks/             # Hooks(React)
│   ├── router/            # 路由
│   │   └── index.js
│   ├── stores/            # 状态管理
│   │   └── user.js
│   ├── utils/             # 工具函数
│   ├── views/             # 页面
│   ├── App.vue
│   └── main.js
├── .env                   # 环境变量
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .gitignore
├── index.html             # 入口HTML(在根目录!)
├── package.json
├── tsconfig.json          # TypeScript配置
└── vite.config.js         # Vite配置
```

### index.html与入口文件

**重要:** Vite的`index.html`在项目根目录,不是`public/`下:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>

  <!-- 入口文件 -->
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**入口文件:**

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

// 样式导入
import './assets/styles/main.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
```

---

## 基础配置

### vite.config.js基础结构

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 插件
  plugins: [
    vue()
  ],

  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    },
    // 导入时可省略的扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },

  // 基础路径
  base: '/',

  // 模式
  mode: 'development', // 'production' | 'development'

  // 定义全局常量
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    'process.env': {}
  },

  // CSS配置
  css: {
    // CSS预处理器
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    },
    // CSS modules配置
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // JSON配置
  json: {
    namedExports: true,  // 是否支持命名导入
    stringify: false     // 是否禁用.json的导入
  }
})
```

### 路径解析

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // 使用@符号
      '@': path.resolve(__dirname, './src'),

      // 多个别名
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),

      // 替换包
      'vue': 'vue/dist/vue.esm-bundler.js'
    },

    // 自动解析的扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
})

// 使用别名
import Header from '@/components/Header.vue'
import { formatDate } from '@utils/date'
import logo from '@assets/logo.png'
```

**TypeScript支持(tsconfig.json):**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

---

## 开发服务器配置

### 完整配置选项

```javascript
// vite.config.js
export default defineConfig({
  server: {
    // 服务器主机名
    host: '0.0.0.0',  // 或 true 监听所有地址

    // 端口号
    port: 3000,

    // 端口被占用时是否自动尝试下一个端口
    strictPort: false,

    // 是否自动打开浏览器
    open: true,
    // 或打开指定路径
    open: '/docs/index.html',

    // HTTPS配置
    https: false,
    // 或自定义证书
    https: {
      key: fs.readFileSync('path/to/server.key'),
      cert: fs.readFileSync('path/to/server.crt')
    },

    // CORS配置
    cors: true,
    // 或详细配置
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
    },

    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },

    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/components/**/*.vue',
        './src/utils/*.ts'
      ]
    },

    // 监听文件变化配置
    watch: {
      // 忽略监听的文件
      ignored: ['**/node_modules/**', '**/.git/**']
    },

    // 中间件模式(用于SSR)
    middlewareMode: false,

    // 服务器文件系统配置
    fs: {
      // 允许访问的文件范围
      allow: [
        // 默认是项目根目录
        // 可以添加其他目录
        '../shared'
      ],
      // 禁止访问的文件
      deny: ['.env', '.env.local']
    },

    // 源文件的源map
    sourcemapIgnoreList: false,

    // HMR配置
    hmr: {
      // 使用WebSocket
      protocol: 'ws',
      // 自定义端口
      port: 3001,
      // 自定义路径
      path: '/__vite_hmr',
      // 超时时间
      timeout: 30000,
      // 覆盖选项
      overlay: true,
      // 客户端配置
      clientPort: 3000,
      // 服务器地址
      host: 'localhost'
    }
  }
})
```

### 代理配置详解

**基础代理:**

```javascript
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写
      '/foo': 'http://localhost:4567',

      // 带选项的对象
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

// 请求示例:
// /api/users → http://jsonplaceholder.typicode.com/users
```

**多个代理:**

```javascript
export default defineConfig({
  server: {
    proxy: {
      // 代理API请求
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1')
      },

      // 代理WebSocket
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true
      },

      // 使用正则表达式
      '^/fallback/.*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      }
    }
  }
})
```

**条件代理:**

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 根据函数返回值决定是否代理
        bypass(req, res, options) {
          const proxyURL = new URL(options.target + req.url)

          // 代理请求的真实URL
          console.log('代理请求:', proxyURL.href)

          // 返回false继续代理
          // 返回null或undefined继续代理
          // 返回其他值则直接返回(不代理)
          if (req.headers.accept?.includes('html')) {
            return '/index.html'  // 返回index.html
          }
        },

        // 配置请求头
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('x-custom-header', 'value')
          })

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应:', proxyRes.statusCode)
          })
        }
      }
    }
  }
})
```

---

## 构建配置

### 完整构建配置

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // 构建目标
    target: 'modules',  // 'es2015' | 'es2016' | ... | 'esnext' | 'modules'

    // 兼容性
    polyfillModulePreload: true,

    // 输出目录
    outDir: 'dist',

    // 静态资源目录(相对于outDir)
    assetsDir: 'assets',

    // 小于此阈值的资源内联为base64
    assetsInlineLimit: 4096, // 4kb

    // CSS代码分割
    cssCodeSplit: true,

    // CSS目标(可以与target不同)
    cssTarget: 'chrome61',

    // 生成sourcemap
    sourcemap: false,  // true | false | 'inline' | 'hidden'

    // Rollup配置
    rollupOptions: {
      // 外部化依赖(不打包)
      external: ['vue'],

      // 输入配置
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'nested/index.html')
      },

      // 输出配置
      output: {
        // 入口文件名
        entryFileNames: 'js/[name]-[hash].js',

        // chunk文件名
        chunkFileNames: 'js/[name]-[hash].js',

        // 静态资源文件名
        assetFileNames: (assetInfo) => {
          // 根据文件类型分类
          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]

          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'media'
          } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'img'
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'fonts'
          }

          return `${extType}/[name]-[hash].[ext]`
        },

        // 手动分包
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'utils': ['axios', 'dayjs']
        }

        // 或使用函数
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
        //   }
        // }
      },

      // 插件
      plugins: []
    },

    // 库模式配置
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'MyLib',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `my-lib.${format}.js`
    },

    // 压缩配置
    minify: 'terser',  // 'terser' | 'esbuild' | false
    terserOptions: {
      compress: {
        // 删除console
        drop_console: true,
        // 删除debugger
        drop_debugger: true,
        // 删除特定函数
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        // 删除注释
        comments: false
      }
    },

    // 清空输出目录
    emptyOutDir: true,

    // 启用/禁用brotli压缩大小报告
    reportCompressedSize: true,

    // chunk大小警告限制(kb)
    chunkSizeWarningLimit: 500,

    // 监听文件变化并重新构建
    watch: null,
    // 或配置
    // watch: {
    //   include: 'src/**'
    // }

    // 构建后的文件放在一起
    assetsInlineLimit: 0,

    // manifest
    manifest: false,  // true生成manifest.json

    // SSR构建配置
    ssr: false,
    // 或配置
    // ssr: {
    //   external: [],
    //   noExternal: []
    // }

    // 自定义构建后的文件名
    cssCodeSplit: true
  }
})
```

### 环境变量与模式

**创建环境文件:**

```bash
.env                # 所有情况下都加载
.env.local          # 所有情况下都加载,但被git忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载,但被git忽略
```

**.env文件示例:**

```bash
# .env
VITE_APP_TITLE=My App
VITE_API_BASE_URL=http://localhost:3000

# .env.development
VITE_APP_TITLE=My App (Dev)
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_APP_TITLE=My App (Prod)
VITE_API_BASE_URL=https://api.example.com
```

**注意:**
- ✅ 只有以`VITE_`开头的变量才会暴露给客户端代码
- ✅ 不要在客户端代码中暴露敏感信息

**使用环境变量:**

```javascript
// 在代码中使用
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_BASE_URL)

// 内置环境变量
console.log(import.meta.env.MODE)        // 'development' | 'production'
console.log(import.meta.env.DEV)         // boolean
console.log(import.meta.env.PROD)        // boolean
console.log(import.meta.env.SSR)         // boolean
console.log(import.meta.env.BASE_URL)    // string
```

**TypeScript智能提示:**

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**自定义模式:**

```bash
# 使用自定义模式
vite build --mode staging

# .env.staging
VITE_APP_TITLE=My App (Staging)
VITE_API_BASE_URL=https://staging.example.com
```

---

## 插件配置

### 官方插件

**Vue插件:**

```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    // Vue 3单文件组件支持
    vue({
      // 自定义块
      include: [/\.vue$/],

      // Reactivity Transform(已废弃)
      reactivityTransform: false,

      // 模板选项
      template: {
        compilerOptions: {
          // 自定义元素
          isCustomElement: (tag) => tag.startsWith('my-')
        }
      },

      // Script setup配置
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),

    // Vue JSX支持
    vueJsx({
      // 选项
    })
  ]
})
```

**React插件:**

```javascript
import react from '@vitejs/plugin-react'
// 或使用SWC(更快)
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react({
      // 包含文件
      include: '**/*.{jsx,tsx}',

      // Babel配置
      babel: {
        plugins: [
          ['babel-plugin-styled-components', { displayName: true }]
        ]
      },

      // Fast Refresh配置
      fastRefresh: true
    })
  ]
})
```

### 常用社区插件

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动导入API
import AutoImport from 'unplugin-auto-import/vite'

// 自动导入组件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 图标插件
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// SVG组件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 压缩
import viteCompression from 'vite-plugin-compression'

// 可视化bundle
import { visualizer } from 'rollup-plugin-visualizer'

// Mock数据
import { viteMockServe } from 'vite-plugin-mock'

// 环境变量类型
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    vue(),

    // 自动导入
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver()
      ],
      dts: 'src/auto-imports.d.ts'
    }),

    // 组件自动导入
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
          enabledCollections: ['ep']
        })
      ],
      dts: 'src/components.d.ts'
    }),

    // 图标
    Icons({
      autoInstall: true
    }),

    // SVG图标
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),

    // Gzip压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 10kb
      algorithm: 'gzip',
      ext: '.gz'
    }),

    // Bundle分析
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    }),

    // Mock
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true
    }),

    // HTML模板
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'My App'
        }
      }
    })
  ]
})
```

### 插件使用示例

**自动导入示例:**

```vue
<script setup>
// ❌ 不需要手动导入
// import { ref, computed, watch } from 'vue'
// import { useRouter } from 'vue-router'

// ✅ 直接使用
const count = ref(0)
const double = computed(() => count.value * 2)
const router = useRouter()

watch(count, (val) => {
  console.log('count changed:', val)
})
</script>
```

**组件自动导入示例:**

```vue
<template>
  <!-- ❌ 不需要手动导入 -->
  <!-- import { ElButton } from 'element-plus' -->

  <!-- ✅ 直接使用 -->
  <ElButton type="primary">按钮</ElButton>

  <!-- 自定义组件也会自动导入 -->
  <MyCustomComponent />
</template>
```

---

## 性能优化

### 开发环境优化

**1. 依赖预构建优化**

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 强制预构建
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'element-plus',
      'element-plus/es',
      'element-plus/es/components/*/style/css',
      '@element-plus/icons-vue'
    ],

    // 排除预构建
    exclude: [
      'your-local-package'
    ],

    // 禁用依赖发现
    entries: [
      'src/main.ts'
    ],

    // esbuild配置
    esbuildOptions: {
      // 定义全局变量
      define: {
        global: 'globalThis'
      },
      // 插件
      plugins: []
    }
  }
})
```

**2. 启动性能优化**

```javascript
export default defineConfig({
  server: {
    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/components/**/*.vue',
        './src/utils/**/*.ts',
        './src/stores/**/*.ts'
      ]
    },

    // 禁用文件系统缓存
    fs: {
      strict: false,
      allow: ['..']
    }
  }
})
```

**3. HMR性能优化**

```javascript
export default defineConfig({
  server: {
    hmr: {
      // 优化HMR性能
      overlay: false // 禁用错误覆盖层
    },

    watch: {
      // 忽略大文件夹
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**'
      ],

      // 使用原生文件监听
      usePolling: false
    }
  }
})
```

### 生产构建优化

**1. 代码分割策略**

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 方法1: 手动分包
        manualChunks: {
          // 框架核心
          'vue-core': ['vue', 'vue-router', 'pinia'],

          // UI库
          'element-plus': ['element-plus'],

          // 工具库
          'utils': ['axios', 'dayjs', 'lodash-es'],

          // 图标
          'icons': ['@element-plus/icons-vue']
        }

        // 方法2: 自动分包(推荐)
        // manualChunks(id) {
        //   // node_modules中的包
        //   if (id.includes('node_modules')) {
        //     // 提取包名
        //     const name = id.toString().split('node_modules/')[1].split('/')[0]
        //
        //     // 大型库单独打包
        //     if (['element-plus', '@element-plus'].some(n => name.includes(n))) {
        //       return 'element-plus'
        //     }
        //
        //     // 其他第三方库
        //     return 'vendor'
        //   }
        //
        //   // 组件目录
        //   if (id.includes('src/components')) {
        //     return 'components'
        //   }
        //
        //   // 工具目录
        //   if (id.includes('src/utils')) {
        //     return 'utils'
        //   }
        // }
      }
    },

    // chunk大小警告限制
    chunkSizeWarningLimit: 1000
  }
})
```

**2. 压缩优化**

```javascript
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    // Gzip压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false
    }),

    // Brotli压缩(可选,nginx需要支持)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false
    })
  ],

  build: {
    // 使用terser压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  }
})
```

**3. CSS优化**

```javascript
export default defineConfig({
  build: {
    // CSS代码分割
    cssCodeSplit: true,

    // CSS压缩
    cssMinify: true
  },

  css: {
    // 使用lightningcss(更快)
    transformer: 'lightningcss',

    // 或postcss
    postcss: {
      plugins: [
        // 自动添加浏览器前缀
        require('autoprefixer'),

        // 压缩CSS
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  }
})
```

**4. 图片优化**

```javascript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ]
})
```

**5. Tree-shaking优化**

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      // 外部化依赖
      external: ['vue', 'vue-router'],

      treeshake: {
        // 更激进的tree-shaking
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    }
  }
})
```

### 资源加载优化

**1. 预加载关键资源**

```html
<!-- index.html -->
<head>
  <!-- 预加载字体 -->
  <link rel="preload" href="/fonts/font.woff2" as="font" type="font/woff2" crossorigin>

  <!-- 预连接到API -->
  <link rel="preconnect" href="https://api.example.com">

  <!-- DNS预解析 -->
  <link rel="dns-prefetch" href="https://api.example.com">
</head>
```

**2. 路由懒加载**

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    // ✅ 懒加载
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    // ✅ 懒加载 + 魔法注释(自定义chunk名)
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: 'users',
        // ✅ 预加载(鼠标悬停时加载)
        component: () => import(
          /* webpackChunkName: "admin-users" */
          /* webpackPrefetch: true */
          '@/views/admin/Users.vue'
        )
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

**3. 组件懒加载**

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

// 异步组件
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// 带选项的异步组件
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./AsyncComponent.vue'),

  // 加载中组件
  loadingComponent: LoadingComponent,

  // 加载失败组件
  errorComponent: ErrorComponent,

  // 展示加载组件前的延迟(ms)
  delay: 200,

  // 超时时间
  timeout: 3000
})
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

### 性能监控

**Bundle分析:**

```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ]
})
```

**构建信息:**

```bash
# 查看详细构建信息
vite build --debug

# 分析构建性能
VITE_PROFILE=true vite build
```

---

## 插件开发

### 插件基础

**插件结构:**

```javascript
// my-plugin.js
export default function myPlugin(options = {}) {
  return {
    // 插件名称
    name: 'vite-plugin-my-plugin',

    // 应用模式
    apply: 'build', // 'serve' | 'build' | (config, env) => boolean

    // 强制插件顺序
    enforce: 'pre', // 'pre' | 'post'

    // 配置钩子
    config(config, env) {
      // 修改配置
      return {
        // 返回部分配置(会被合并)
      }
    },

    // 配置解析完成后调用
    configResolved(resolvedConfig) {
      // 存储最终配置
      this.config = resolvedConfig
    },

    // 配置开发服务器
    configureServer(server) {
      // 添加中间件
      server.middlewares.use((req, res, next) => {
        // 自定义处理
        next()
      })

      // 返回后置钩子
      return () => {
        server.middlewares.use((req, res, next) => {
          // 在内部中间件后执行
          next()
        })
      }
    },

    // 转换index.html
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        '<title>My App</title>'
      )
    },

    // 自定义热更新处理
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.custom')) {
        server.ws.send({
          type: 'custom',
          event: 'custom-update',
          data: {}
        })
        return []
      }
    },

    // 解析模块ID
    resolveId(source, importer) {
      if (source === 'virtual-module') {
        return source
      }
    },

    // 加载模块
    load(id) {
      if (id === 'virtual-module') {
        return 'export default "This is virtual!"'
      }
    },

    // 转换模块
    transform(code, id) {
      if (id.endsWith('.custom')) {
        return {
          code: transformCode(code),
          map: null
        }
      }
    },

    // 构建开始
    buildStart() {
      console.log('构建开始')
    },

    // 构建结束
    buildEnd() {
      console.log('构建结束')
    }
  }
}
```

### 常用钩子

**通用钩子(Vite特有):**

```javascript
export default function myPlugin() {
  return {
    name: 'my-plugin',

    // 1. config - 修改Vite配置
    config(config, { command, mode }) {
      if (command === 'serve') {
        // 开发环境
      } else {
        // 生产环境
      }

      return {
        define: {
          __IS_DEV__: command === 'serve'
        }
      }
    },

    // 2. configResolved - 配置解析完成
    configResolved(resolvedConfig) {
      // 保存配置供其他钩子使用
      this.config = resolvedConfig
    },

    // 3. configureServer - 配置开发服务器
    configureServer(server) {
      // 添加自定义中间件
      server.middlewares.use((req, res, next) => {
        if (req.url === '/custom-api') {
          res.end('Custom response')
        } else {
          next()
        }
      })
    },

    // 4. transformIndexHtml - 转换HTML
    transformIndexHtml: {
      // 顺序:'pre' | undefined | 'post'
      order: 'pre',
      handler(html, ctx) {
        return html.replace(
          '</head>',
          '<script>console.log("Injected")</script></head>'
        )
      }
    },

    // 5. handleHotUpdate - 自定义HMR
    handleHotUpdate({ file, server, modules }) {
      if (file.endsWith('.custom')) {
        console.log('Custom file updated')

        // 发送自定义事件到客户端
        server.ws.send({
          type: 'custom',
          event: 'custom-update',
          data: { file }
        })

        // 返回空数组阻止默认HMR
        return []
      }

      // 返回undefined使用默认HMR
      // 返回modules数组自定义需要更新的模块
    }
  }
}
```

**Rollup钩子:**

```javascript
export default function myPlugin() {
  return {
    name: 'my-plugin',

    // 1. resolveId - 解析模块ID
    resolveId(source, importer, options) {
      // 处理虚拟模块
      if (source === 'virtual:my-module') {
        return source
      }

      // 重定向模块
      if (source.startsWith('@/')) {
        return this.resolve(
          source.replace('@/', './src/'),
          importer,
          { skipSelf: true }
        )
      }

      return null
    },

    // 2. load - 加载模块
    load(id) {
      // 加载虚拟模块
      if (id === 'virtual:my-module') {
        return `export const msg = "Hello from virtual module"`
      }

      return null
    },

    // 3. transform - 转换代码
    transform(code, id) {
      // 转换特定文件
      if (id.endsWith('.md')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null
        }
      }

      return null
    },

    // 4. buildStart - 构建开始
    buildStart(options) {
      console.log('Build started')
    },

    // 5. buildEnd - 构建结束
    buildEnd(error) {
      if (error) {
        console.error('Build failed:', error)
      }
    },

    // 6. generateBundle - 生成bundle前
    generateBundle(options, bundle) {
      // 修改输出文件
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (file.type === 'chunk') {
          // 修改代码
          file.code = file.code.replace(/const/g, 'var')
        }
      }
    },

    // 7. writeBundle - 写入磁盘后
    writeBundle(options, bundle) {
      console.log('Files written to disk')
    }
  }
}
```

### 自定义插件示例

**示例1: 环境变量注入插件**

```javascript
// plugins/inject-env.js
export default function injectEnvPlugin(options = {}) {
  return {
    name: 'vite-plugin-inject-env',

    transformIndexHtml(html) {
      // 注入环境变量到HTML
      return html.replace(
        '</head>',
        `
          <script>
            window.__ENV__ = {
              MODE: '${process.env.NODE_ENV}',
              API_URL: '${options.apiUrl || ''}'
            }
          </script>
        </head>
        `
      )
    }
  }
}

// vite.config.js
import injectEnv from './plugins/inject-env'

export default defineConfig({
  plugins: [
    injectEnv({ apiUrl: 'https://api.example.com' })
  ]
})
```

**示例2: Markdown加载器插件**

```javascript
// plugins/markdown.js
import { marked } from 'marked'

export default function markdownPlugin() {
  return {
    name: 'vite-plugin-markdown',

    // 解析.md文件
    transform(code, id) {
      if (id.endsWith('.md')) {
        // 转换Markdown为HTML
        const html = marked(code)

        // 返回Vue组件
        return {
          code: `
            export default {
              name: 'MarkdownContent',
              template: \`<div class="markdown-body">${html}</div>\`
            }
          `,
          map: null
        }
      }
    }
  }
}

// 使用
import Article from './article.md'
```

**示例3: 虚拟模块插件**

```javascript
// plugins/virtual-config.js
export default function virtualConfigPlugin(config) {
  const virtualModuleId = 'virtual:config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-virtual-config',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(config)}`
      }
    }
  }
}

// vite.config.js
import virtualConfig from './plugins/virtual-config'

export default defineConfig({
  plugins: [
    virtualConfig({
      appName: 'My App',
      version: '1.0.0'
    })
  ]
})

// 使用
import config from 'virtual:config'
console.log(config.appName) // 'My App'
```

**示例4: 自定义文件转换插件**

```javascript
// plugins/yaml-loader.js
import yaml from 'js-yaml'

export default function yamlPlugin() {
  return {
    name: 'vite-plugin-yaml',

    transform(code, id) {
      if (id.endsWith('.yaml') || id.endsWith('.yml')) {
        try {
          const data = yaml.load(code)
          return {
            code: `export default ${JSON.stringify(data)}`,
            map: null
          }
        } catch (e) {
          this.error(`YAML parse error: ${e.message}`)
        }
      }
    }
  }
}

// 使用
import config from './config.yaml'
console.log(config)
```

**示例5: 自动生成路由插件**

```javascript
// plugins/auto-routes.js
import fs from 'fs'
import path from 'path'

export default function autoRoutesPlugin(options = {}) {
  const { pagesDir = 'src/pages' } = options
  const virtualModuleId = 'virtual:routes'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-auto-routes',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        // 扫描pages目录
        const routes = generateRoutes(pagesDir)

        return `
          export default ${JSON.stringify(routes, null, 2)}
        `
      }
    },

    // 监听文件变化
    configureServer(server) {
      const watcher = server.watcher

      watcher.on('add', (file) => {
        if (file.includes(pagesDir)) {
          // 触发虚拟模块更新
          const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
          if (module) {
            server.moduleGraph.invalidateModule(module)
            server.ws.send({
              type: 'full-reload'
            })
          }
        }
      })
    }
  }
}

function generateRoutes(dir) {
  // 实现路由生成逻辑
  // 返回路由配置
}

// 使用
import routes from 'virtual:routes'
const router = createRouter({
  routes
})
```

---

## 多页应用配置

### 多页面配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 主页
        main: resolve(__dirname, 'index.html'),

        // 嵌套页面
        nested: resolve(__dirname, 'nested/index.html'),

        // 管理后台
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
})
```

**项目结构:**

```
project/
├── index.html              # 主页
├── nested/
│   └── index.html          # 嵌套页面
├── admin/
│   └── index.html          # 管理后台
├── src/
│   ├── main/               # 主页代码
│   │   ├── main.js
│   │   └── App.vue
│   ├── admin/              # 管理后台代码
│   │   ├── main.js
│   │   └── App.vue
│   └── shared/             # 共享代码
│       ├── components/
│       └── utils/
└── vite.config.js
```

**index.html:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Main Page</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main/main.js"></script>
</body>
</html>
```

**admin/index.html:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Admin Page</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/admin/main.js"></script>
</body>
</html>
```

---

## CSS预处理器

### Sass/SCSS

**安装:**

```bash
npm install -D sass
```

**配置:**

```javascript
// vite.config.js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入变量和mixins
        additionalData: `
          @import "@/assets/styles/variables.scss";
          @import "@/assets/styles/mixins.scss";
        `,

        // API类型
        api: 'modern-compiler' // 或 'modern'
      }
    }
  }
})
```

**使用:**

```vue
<style lang="scss">
// 直接使用变量(已自动导入)
.container {
  color: $primary-color;

  @include flex-center;
}
</style>
```

### Less

**安装:**

```bash
npm install -D less
```

**配置:**

```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/assets/styles/variables.less";`,

        // Less选项
        modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px'
        },

        javascriptEnabled: true
      }
    }
  }
})
```

### Stylus

**安装:**

```bash
npm install -D stylus
```

**配置:**

```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      stylus: {
        additionalData: `@import "@/assets/styles/variables.styl"`
      }
    }
  }
})
```

### PostCSS

**安装:**

```bash
npm install -D postcss autoprefixer
```

**配置:**

```javascript
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
    'postcss-custom-media': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }
  }
}

// vite.config.js
export default defineConfig({
  css: {
    postcss: './postcss.config.js'
  }
})
```

### CSS Modules

**自动启用:**

```vue
<!-- 文件名: Component.module.css -->
<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Title</h1>
  </div>
</template>

<style module>
.container {
  padding: 20px;
}

.title {
  color: red;
}
</style>
```

**配置:**

```javascript
export default defineConfig({
  css: {
    modules: {
      // 类名生成规则
      generateScopedName: '[name]__[local]___[hash:base64:5]',

      // hash前缀
      hashPrefix: 'prefix',

      // 驼峰转换
      localsConvention: 'camelCaseOnly'
    }
  }
})
```

---

## TypeScript集成

### 基础配置

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Vue */
    "types": ["vite/client"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

**tsconfig.node.json:**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 类型声明

**环境变量类型:**

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**Vue组件类型:**

```typescript
// src/shims-vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

**静态资源类型:**

```typescript
// src/shims-assets.d.ts
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: any
  export default content
}
```

### Vue 3 + TypeScript

```vue
<script setup lang="ts">
import { ref, computed, type Ref, type ComputedRef } from 'vue'

// Props类型
interface Props {
  title: string
  count?: number
  user: {
    id: number
    name: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits类型
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: string): void
}

const emit = defineEmits<Emits>()

// Ref类型
const count: Ref<number> = ref(0)
const message: Ref<string> = ref('hello')

// Computed类型
const doubleCount: ComputedRef<number> = computed(() => count.value * 2)

// 函数类型
const increment = (): void => {
  count.value++
  emit('update', count.value)
}

// 接口定义
interface User {
  id: number
  name: string
  email: string
}

const users: Ref<User[]> = ref([])

// 异步函数
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users')
  return response.json()
}
</script>
```

---

## 项目规范

### 目录结构规范

```
src/
├── api/                    # API接口
│   ├── modules/
│   │   ├── user.ts
│   │   └── product.ts
│   ├── request.ts         # axios封装
│   └── types.ts           # API类型定义
├── assets/                # 静态资源
│   ├── images/
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── main.scss
│   └── icons/
├── components/            # 组件
│   ├── base/             # 基础组件
│   ├── common/           # 通用业务组件
│   └── layout/           # 布局组件
├── composables/          # 组合函数
│   ├── useAuth.ts
│   ├── useRequest.ts
│   └── useTable.ts
├── config/               # 配置文件
│   └── index.ts
├── directives/           # 自定义指令
│   └── permission.ts
├── hooks/                # Hooks(React)
├── router/               # 路由
│   ├── index.ts
│   ├── modules/
│   └── guards.ts
├── stores/               # 状态管理
│   ├── modules/
│   │   └── user.ts
│   └── index.ts
├── types/                # 类型定义
│   ├── global.d.ts
│   └── api.d.ts
├── utils/                # 工具函数
│   ├── format.ts
│   ├── validate.ts
│   └── storage.ts
├── views/                # 页面
│   ├── home/
│   │   ├── index.vue
│   │   ├── components/
│   │   └── types.ts
│   └── user/
├── App.vue
└── main.ts
```

### 命名规范

```typescript
// ✅ 组件名: PascalCase
MyComponent.vue
UserProfile.vue

// ✅ 文件名: kebab-case或PascalCase
user-profile.vue
UserProfile.vue

// ✅ 变量/函数: camelCase
const userName = 'Alice'
function getUserInfo() {}

// ✅ 常量: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_COUNT = 100

// ✅ 类/接口: PascalCase
class UserService {}
interface UserInfo {}

// ✅ 类型别名: PascalCase
type UserId = string

// ✅ Enum: PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user'
}
```

### 代码规范

**使用ESLint + Prettier:**

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**.eslintrc.cjs:**

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

**.prettierrc:**

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "none",
  "arrowParens": "avoid"
}
```

---

## 常见问题

### 1. 依赖预构建问题

**问题:** 某些包预构建失败或运行时错误

**解决:**

```javascript
export default defineConfig({
  optimizeDeps: {
    // 强制包含
    include: ['problematic-package'],

    // 或排除
    exclude: ['problematic-package']
  }
})
```

### 2. CommonJS模块兼容

**问题:** 某些包使用CommonJS导出

**解决:**

```javascript
export default defineConfig({
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
```

### 3. 动态导入路径

**问题:** 动态import不工作

```javascript
// ❌ 不支持
const module = await import(dynamicPath)

// ✅ 使用import.meta.glob
const modules = import.meta.glob('./modules/*.js')
const module = await modules[`./modules/${name}.js`]()
```

### 4. 全局变量注入

**问题:** 需要注入全局变量(如jQuery的$)

**解决:**

```javascript
export default defineConfig({
  define: {
    $: 'jQuery',
    jQuery: 'jQuery'
  }
})
```

### 5. CSS @import路径

**问题:** CSS中@import路径解析问题

```css
/* ❌ 可能失败 */
@import '../node_modules/some-package/style.css';

/* ✅ 使用别名 */
@import '@/assets/styles/variables.css';
```

### 6. 大文件上传超时

**问题:** 上传大文件时开发服务器超时

**解决:**

```javascript
export default defineConfig({
  server: {
    hmr: {
      timeout: 60000 // 增加超时时间
    }
  }
})
```

---

## 迁移指南

### 从Webpack迁移

**1. 安装Vite:**

```bash
npm install -D vite @vitejs/plugin-vue
```

**2. 修改package.json:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**3. 移动index.html:**

```
从 public/index.html → 移动到根目录
```

**4. 更新index.html:**

```html
<!-- Webpack -->
<script src="<%= BASE_URL %>main.js"></script>

<!-- Vite -->
<script type="module" src="/src/main.js"></script>
```

**5. 环境变量:**

```
Webpack: process.env.VUE_APP_*
Vite: import.meta.env.VITE_*
```

**6. 静态资源:**

```javascript
// Webpack
require('@/assets/logo.png')

// Vite
import logo from '@/assets/logo.png'
// 或在template中
<img src="@/assets/logo.png" />
```

**7. 别名配置:**

```javascript
// webpack.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}

// vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

**8. 插件替换:**

| Webpack插件 | Vite替代方案 |
|------------|------------|
| html-webpack-plugin | vite-plugin-html |
| copy-webpack-plugin | vite-plugin-static-copy |
| compression-webpack-plugin | vite-plugin-compression |
| webpack-bundle-analyzer | rollup-plugin-visualizer |

### 从Vue CLI迁移

**1. 移除Vue CLI:**

```bash
npm uninstall @vue/cli-service @vue/cli-plugin-*
```

**2. 安装Vite:**

```bash
npm install -D vite @vitejs/plugin-vue
```

**3. 创建vite.config.js:**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8080
  }
})
```

**4. 更新package.json:**

```json
{
  "scripts": {
    "serve": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 总结

### Vite核心优势

1. **极速启动**: 无需打包,即时启动
2. **快速HMR**: 无论项目多大,HMR始终快速
3. **按需编译**: 只编译当前页面需要的代码
4. **开箱即用**: 内置TypeScript、JSX、CSS预处理器支持
5. **优化构建**: 预配置的Rollup构建,代码分割优秀
6. **插件生态**: 丰富的插件,与Rollup兼容
7. **框架无关**: 支持Vue、React、Svelte等

### 适用场景

**✅ 推荐使用Vite:**
- 新项目
- 现代浏览器环境
- Vue 3 / React / Svelte项目
- 需要快速开发迭代
- TypeScript项目
- 中小型到大型应用

**⚠️ 谨慎使用Vite:**
- 需要支持IE11
- 大量使用Webpack特有功能
- 团队对Webpack非常熟悉且不愿切换

### 学习路线

```
1. 基础阶段(1-2天)
   - 理解ES Modules
   - 创建第一个Vite项目
   - 了解基本配置

2. 进阶阶段(3-5天)
   - 深入配置选项
   - 性能优化技巧
   - 插件使用

3. 高级阶段(1-2周)
   - 插件开发
   - 源码阅读
   - 复杂场景处理

4. 实践阶段(持续)
   - 实际项目应用
   - 性能优化实践
   - 最佳实践总结
```

### 参考资源

- **官方文档**: https://cn.vitejs.dev/
- **Awesome Vite**: https://github.com/vitejs/awesome-vite
- **Vite Rollup插件**: https://vite-rollup-plugins.patak.dev/
- **源码仓库**: https://github.com/vitejs/vite
- **社区讨论**: https://chat.vitejs.dev/

---

*最后更新: 2025年*
*适用于Vite 5.x和Vite 6.x版本*
