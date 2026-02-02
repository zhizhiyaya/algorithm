# React Native Bundle 构建原理与实战

> 深入理解从源码到Bundle的完整构建流程

## 目录

- [第一章：Bundle是什么](#第一章bundle是什么)
- [第二章：Metro打包工具深入](#第二章metro打包工具深入)
- [第三章：Bundle构建流程详解](#第三章bundle构建流程详解)
- [第四章：构建命令与配置](#第四章构建命令与配置)
- [第五章：Bundle结构分析](#第五章bundle结构分析)
- [第六章：构建优化策略](#第六章构建优化策略)
- [第七章：多Bundle与拆包](#第七章多bundle与拆包)
- [第八章：CI/CD集成](#第八章cicd集成)

---

## 第一章：Bundle是什么

### 1.1 核心概念

```typescript
/*
React Native应用 = 原生壳 + JavaScript Bundle

┌─────────────────────────────────────┐
│         React Native App            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      原生壳 (Native Shell)     │ │
│  │  • iOS: .app                   │ │
│  │  • Android: .apk/.aab          │ │
│  │  • 提供原生能力                │ │
│  │  • 加载和执行Bundle            │ │
│  └───────────────────────────────┘ │
│              ↓ 加载                 │
│  ┌───────────────────────────────┐ │
│  │   JavaScript Bundle           │ │
│  │  • index.bundle               │ │
│  │  • 所有JS代码打包              │ │
│  │  • React组件、业务逻辑        │ │
│  │  • 第三方库                    │ │
│  └───────────────────────────────┘ │
│              +                      │
│  ┌───────────────────────────────┐ │
│  │      资源文件 (Assets)        │ │
│  │  • 图片、字体、视频           │ │
│  │  • 配置文件                    │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
*/
```

### 1.2 Bundle文件类型

```bash
# iOS Bundle
index.ios.bundle
  ├── JavaScript代码（已打包和压缩）
  └── SourceMap（可选，用于调试）

# Android Bundle
index.android.bundle
  ├── JavaScript代码（已打包和压缩）
  └── SourceMap（可选，用于调试）

# 资源文件
assets/
  ├── images/
  │   ├── logo@2x.png
  │   └── logo@3x.png
  ├── fonts/
  │   └── custom-font.ttf
  └── ...
```

### 1.3 Bundle内容示例

```javascript
// 源代码（多个文件）
// src/App.js
import React from 'react';
import { View, Text } from 'react-native';
import Header from './components/Header';

function App() {
  return (
    <View>
      <Header />
      <Text>Hello World</Text>
    </View>
  );
}

export default App;

// src/components/Header.js
import React from 'react';
import { View, Text } from 'react-native';

function Header() {
  return (
    <View>
      <Text>Header</Text>
    </View>
  );
}

export default Header;

// ↓↓↓ Metro打包后 ↓↓↓

// index.bundle（简化示例）
var __d = function(factory, moduleId, dependencyMap) {
  // 模块定义函数
};

__d(function(global, require, module, exports) {
  // React Native核心代码
  // ...几千行代码
}, 0, []);

__d(function(global, require, module, exports) {
  // React代码
  // ...
}, 1, [0]);

__d(function(global, require, module, exports) {
  // 你的App.js代码
  var React = require(1); // 引用模块1
  var Header = require(3); // 引用模块3

  function App() {
    return React.createElement(View, null,
      React.createElement(Header),
      React.createElement(Text, null, 'Hello World')
    );
  }

  module.exports = App;
}, 2, [1, 3]);

__d(function(global, require, module, exports) {
  // Header组件代码
  // ...
}, 3, [1]);

// 启动代码
require(2); // 加载并执行App模块
```

---

## 第二章：Metro打包工具深入

### 2.1 Metro简介

**Metro** 是React Native的JavaScript打包工具，类似于Webpack，但专为React Native优化。

```typescript
/*
Metro工作流程：

┌──────────────┐
│  源代码文件  │
│  .js/.jsx    │
│  .ts/.tsx    │
└──────┬───────┘
       │
       ↓
┌──────────────────────┐
│   1. Resolution      │  解析依赖关系
│   找到所有import     │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│   2. Transformation  │  转换代码
│   • Babel转译        │
│   • TypeScript编译   │
│   • 代码压缩         │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│   3. Serialization   │  序列化
│   生成最终Bundle     │
└──────┬───────────────┘
       │
       ↓
┌──────────────┐
│ index.bundle │
└──────────────┘
*/
```

### 2.2 Metro配置文件

```javascript
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    // 1. 转换器配置
    transformer: {
      // Babel转换配置
      babelTransformerPath: require.resolve('react-native-svg-transformer'),

      // 压缩配置
      minifierConfig: {
        keep_classnames: true,
        keep_fnames: true,
        mangle: {
          keep_classnames: true,
          keep_fnames: true,
        },
      },

      // 实验性功能
      experimentalImportSupport: false,
      inlineRequires: true, // 内联require，减小bundle大小
    },

    // 2. 解析器配置
    resolver: {
      // 支持的文件扩展名
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],

      // 资源文件扩展名
      assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf'],

      // 模块别名
      extraNodeModules: {
        '@components': __dirname + '/src/components',
        '@utils': __dirname + '/src/utils',
      },
    },

    // 3. 序列化器配置
    serializer: {
      // 自定义模块ID生成
      createModuleIdFactory: function() {
        let nextId = 0;
        return (path) => {
          // 为每个模块生成唯一ID
          return nextId++;
        };
      },

      // 排除的模块（不打包）
      getModulesRunBeforeMainModule: () => [
        require.resolve('./src/polyfills.js'),
      ],

      // 自定义序列化
      customSerializer: undefined,
    },

    // 4. 服务器配置（开发时）
    server: {
      port: 8081,
      enhanceMiddleware: (middleware) => {
        return middleware;
      },
    },

    // 5. 缓存配置
    cacheStores: [
      new FileStore({
        root: __dirname + '/metro-cache',
      }),
    ],

    // 6. 监听文件变化
    watchFolders: [
      __dirname + '/src',
      __dirname + '/node_modules',
    ],
  };
})();
```

### 2.3 Metro的核心概念

#### 模块系统

```javascript
// Metro使用CommonJS模块系统

// 定义模块
__d(function(global, require, module, exports) {
  'use strict';

  // 模块代码
  const value = 42;

  // 导出
  module.exports = value;
  // 或
  exports.value = value;
},
moduleId,        // 模块唯一ID
dependencyMap    // 依赖映射
);

// 使用模块
const value = require(moduleId);
```

#### 依赖图（Dependency Graph）

```typescript
/*
Metro构建依赖图：

index.js (模块0)
  ├── App.js (模块1)
  │   ├── Header.js (模块2)
  │   │   └── Icon.js (模块3)
  │   └── Footer.js (模块4)
  ├── react (模块5)
  ├── react-native (模块6)
  └── utils.js (模块7)

依赖映射：
{
  0: [1, 5, 6],      // index.js依赖App.js、react、react-native
  1: [2, 4, 5, 6],   // App.js依赖Header、Footer、react、react-native
  2: [3, 5],         // Header依赖Icon、react
  3: [5],            // Icon依赖react
  4: [5],            // Footer依赖react
  5: [],             // react无依赖
  6: [],             // react-native无依赖
  7: [],             // utils无依赖
}
*/
```

---

## 第三章：Bundle构建流程详解

### 3.1 完整构建流程

```bash
# 构建步骤详解

步骤1: 解析入口文件
├── 读取 index.js
├── 解析 import/require
└── 创建依赖图根节点

步骤2: 递归解析依赖
├── 遍历所有import/require
├── 解析每个模块的依赖
├── 构建完整依赖图
└── 去重（相同模块只加载一次）

步骤3: 转换代码
├── Babel转译（ES6+ → ES5）
├── TypeScript编译（.ts/.tsx → .js）
├── JSX转换（<View> → React.createElement(View)）
└── Polyfill注入

步骤4: 优化代码
├── Tree Shaking（移除未使用代码）
├── 代码压缩（Minify）
├── 内联require（Inline Requires）
└── 移除注释和空格

步骤5: 序列化输出
├── 生成模块定义代码
├── 生成模块映射表
├── 添加启动代码
└── 输出 index.bundle

步骤6: 生成资源
├── 复制图片资源
├── 处理字体文件
├── 生成资源映射
└── 输出到 assets 目录

步骤7: 生成SourceMap（可选）
├── 记录源码位置映射
├── 方便调试
└── 输出 index.bundle.map
```

### 3.2 代码转换示例

```javascript
// ===== 转换前（源代码）=====
// src/App.tsx

import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  title: string;
}

const App: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState(0);

  const handlePress = () => {
    setCount(count + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>{title}</Text>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={handlePress} />
    </View>
  );
};

export default App;

// ===== 转换后（Bundle中）=====

__d(function(global, require, module, exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  // 导入依赖（转换为require）
  var _react = require(1);
  var _react2 = _interopRequireDefault(_react);
  var _reactNative = require(2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  // 组件代码（TypeScript已编译为JavaScript）
  var App = function App(_ref) {
    var title = _ref.title;

    var _useState = (0, _react.useState)(0);
    var count = _useState[0];
    var setCount = _useState[1];

    var handlePress = function handlePress() {
      setCount(count + 1);
    };

    // JSX转换为React.createElement
    return _react2.default.createElement(
      _reactNative.View,
      { style: { flex: 1 } },
      _react2.default.createElement(_reactNative.Text, null, title),
      _react2.default.createElement(_reactNative.Text, null, 'Count: ', count),
      _react2.default.createElement(_reactNative.Button, {
        title: 'Increment',
        onPress: handlePress
      })
    );
  };

  exports.default = App;

}, 100, [1, 2]); // 模块ID: 100, 依赖: [1, 2]
```

### 3.3 模块打包示例

```javascript
// 完整的Bundle结构（简化版）

// ===== 1. 运行时和辅助函数 =====
(function(global) {
  'use strict';

  // 模块缓存
  var modules = {};

  // 模块定义函数
  function __d(factory, moduleId, dependencyMap) {
    modules[moduleId] = {
      factory: factory,
      dependencyMap: dependencyMap,
      isInitialized: false,
      exports: {}
    };
  }

  // require函数
  function require(moduleId) {
    var module = modules[moduleId];

    if (!module) {
      throw new Error('Module ' + moduleId + ' not found');
    }

    if (!module.isInitialized) {
      module.isInitialized = true;
      module.factory(
        global,
        require,
        module,
        module.exports
      );
    }

    return module.exports;
  }

  global.__d = __d;
  global.require = require;

})(this);

// ===== 2. 核心库模块 =====

// React Native核心
__d(function(global, require, module, exports) {
  // React Native源码
  // ...几千行代码
}, 0, []);

// React
__d(function(global, require, module, exports) {
  // React源码
  // ...
}, 1, []);

// ===== 3. 第三方库 =====

// Lodash
__d(function(global, require, module, exports) {
  // Lodash代码
}, 10, []);

// Redux
__d(function(global, require, module, exports) {
  // Redux代码
}, 11, []);

// ===== 4. 应用代码 =====

// utils.js
__d(function(global, require, module, exports) {
  exports.formatDate = function(date) {
    return date.toISOString();
  };
}, 100, []);

// Header.js
__d(function(global, require, module, exports) {
  var React = require(1);
  var ReactNative = require(0);

  function Header() {
    return React.createElement(
      ReactNative.View,
      null,
      React.createElement(ReactNative.Text, null, 'Header')
    );
  }

  module.exports = Header;
}, 101, [0, 1]);

// App.js
__d(function(global, require, module, exports) {
  var React = require(1);
  var ReactNative = require(0);
  var Header = require(101);
  var utils = require(100);

  function App() {
    return React.createElement(
      ReactNative.View,
      null,
      React.createElement(Header),
      React.createElement(ReactNative.Text, null, 'Hello World')
    );
  }

  module.exports = App;
}, 102, [0, 1, 100, 101]);

// index.js
__d(function(global, require, module, exports) {
  var ReactNative = require(0);
  var App = require(102);

  ReactNative.AppRegistry.registerComponent('MyApp', function() {
    return App;
  });
}, 103, [0, 102]);

// ===== 5. 启动代码 =====
require(103); // 加载入口模块
```

---

## 第四章：构建命令与配置

### 4.1 开发环境构建

```bash
# 启动Metro服务器（开发模式）
npx react-native start

# 或者
npm start

# Metro服务器会：
# 1. 监听文件变化
# 2. 实时编译
# 3. 提供Bundle下载
# 4. 支持Hot Reload

# Metro服务器输出：
                ######                ######
              ###     ####        ####     ###
            ##          ###    ###          ##
            ##             ####             ##
            ##             ####             ##
            ##           ##    ##           ##
            ##         ###      ###         ##
              ###     ####        ####     ###
                ######                ######

               Welcome to Metro 0.76.0
              Fast - Scalable - Integrated

info Metro is running on port 8081

# 访问Bundle（开发环境）
# iOS: http://localhost:8081/index.bundle?platform=ios&dev=true
# Android: http://localhost:8081/index.bundle?platform=android&dev=true
```

### 4.2 生产环境构建

#### iOS构建

```bash
# 方法1: 使用react-native命令
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios

# 参数说明：
# --entry-file: 入口文件
# --platform: 平台（ios/android）
# --dev: 是否开发模式
# --bundle-output: Bundle输出路径
# --assets-dest: 资源文件输出路径
# --sourcemap-output: SourceMap输出路径（可选）
# --minify: 是否压缩（默认跟随--dev）
# --reset-cache: 清除缓存

# 方法2: Xcode自动构建
# 在Xcode中Build时，会自动执行：
# react-native/scripts/react-native-xcode.sh

# 查看脚本内容
cat node_modules/react-native/scripts/react-native-xcode.sh

# 脚本主要逻辑：
#!/bin/bash
set -e

# 设置环境变量
export ENTRY_FILE=${ENTRY_FILE:-index.js}
export BUNDLE_FILE=${BUNDLE_FILE:-main.jsbundle}

# 判断是否是Debug模式
if [ "${CONFIGURATION}" == "Debug" ]; then
  # Debug模式：从Metro服务器加载
  echo "Skipping bundling in Debug mode"
else
  # Release模式：打包Bundle
  "$NODE_BINARY" "$CLI_PATH" bundle \
    --entry-file "$ENTRY_FILE" \
    --platform ios \
    --dev false \
    --reset-cache \
    --bundle-output "$BUNDLE_FILE" \
    --assets-dest "$DEST"
fi
```

#### Android构建

```bash
# 方法1: 使用react-native命令
npx react-native bundle \
  --entry-file index.js \
  --platform android \
  --dev false \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/

# 方法2: Gradle自动构建
# 在android/app/build.gradle中已配置：

project.ext.react = [
    enableHermes: true,  // 使用Hermes引擎
    entryFile: "index.js",
    bundleAssetName: "index.android.bundle",
]

apply from: "../../node_modules/react-native/react.gradle"

# 构建APK时自动打包Bundle
cd android
./gradlew assembleRelease

# Bundle会打包到：
# android/app/build/generated/assets/react/release/index.android.bundle
```

### 4.3 自定义构建脚本

```javascript
// scripts/bundle.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platforms = ['ios', 'android'];
const isRelease = process.argv.includes('--release');

platforms.forEach(platform => {
  console.log(`\n📦 开始构建 ${platform} Bundle...`);

  const bundleOutput = platform === 'ios'
    ? 'ios/main.jsbundle'
    : 'android/app/src/main/assets/index.android.bundle';

  const assetsOutput = platform === 'ios'
    ? 'ios'
    : 'android/app/src/main/res';

  // 确保输出目录存在
  const outputDir = path.dirname(bundleOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 构建命令
  const cmd = [
    'npx react-native bundle',
    '--entry-file index.js',
    `--platform ${platform}`,
    `--dev ${!isRelease}`,
    `--bundle-output ${bundleOutput}`,
    `--assets-dest ${assetsOutput}`,
    isRelease ? '--minify true' : '',
    isRelease ? '--sourcemap-output ' + bundleOutput + '.map' : '',
  ].filter(Boolean).join(' ');

  console.log('执行命令:', cmd);

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${platform} Bundle构建成功`);

    // 显示Bundle大小
    const stats = fs.statSync(bundleOutput);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📊 Bundle大小: ${sizeMB} MB`);
  } catch (error) {
    console.error(`❌ ${platform} Bundle构建失败`);
    process.exit(1);
  }
});

console.log('\n🎉 所有Bundle构建完成！');
```

```json
// package.json
{
  "scripts": {
    "bundle:dev": "node scripts/bundle.js",
    "bundle:release": "node scripts/bundle.js --release",
    "bundle:ios": "react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios",
    "bundle:android": "react-native bundle --entry-file index.js --platform android --dev false --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res"
  }
}
```

### 4.4 Hermes编译

```bash
# Hermes是React Native的JavaScript引擎，可以提升性能

# 1. 启用Hermes（android/app/build.gradle）
project.ext.react = [
    enableHermes: true
]

# 2. 构建时自动编译为Hermes字节码
./gradlew assembleRelease

# 生成的文件：
# - index.android.bundle (JavaScript Bundle)
# - index.android.bundle.hbc (Hermes字节码)

# 3. 手动编译Hermes字节码
npx react-native bundle \
  --entry-file index.js \
  --platform android \
  --dev false \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# 编译为字节码
npx hermesc \
  -O -emit-binary \
  -out android/app/src/main/assets/index.android.bundle.hbc \
  android/app/src/main/assets/index.android.bundle

# 删除原始Bundle（只保留字节码）
rm android/app/src/main/assets/index.android.bundle
```

---

## 第五章：Bundle结构分析

### 5.1 Bundle文件解析

```javascript
// 使用工具查看Bundle内容

// 1. 查看Bundle大小
ls -lh ios/main.jsbundle
# -rw-r--r--  1 user  staff   3.2M Oct 25 12:00 ios/main.jsbundle

// 2. 查看Bundle前几行
head -n 50 ios/main.jsbundle

// 3. 分析Bundle结构
const fs = require('fs');

const bundleContent = fs.readFileSync('ios/main.jsbundle', 'utf8');

// Bundle通常包含：
// - IIFE包装器（立即执行函数）
// - __d 函数定义（模块定义）
// - 大量模块代码
// - require调用（启动代码）

console.log('Bundle大小:', bundleContent.length, '字符');
console.log('模块数量:', (bundleContent.match(/__d\(/g) || []).length);
console.log('require调用:', (bundleContent.match(/require\(/g) || []).length);
```

### 5.2 SourceMap分析

```javascript
// SourceMap用于将压缩后的代码映射回源代码

// 生成SourceMap
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output ios/main.jsbundle \
  --sourcemap-output ios/main.jsbundle.map

// SourceMap结构
{
  "version": 3,
  "sources": [
    "index.js",
    "src/App.tsx",
    "src/components/Header.tsx",
    "node_modules/react/index.js",
    // ... 所有源文件
  ],
  "names": [
    "React",
    "useState",
    "View",
    // ... 所有变量名
  ],
  "mappings": "AAAA;AACA;AACA;...", // Base64编码的映射
  "file": "main.jsbundle",
  "sourcesContent": [
    "// index.js源码",
    "// App.tsx源码",
    // ...
  ]
}

// 使用SourceMap调试
// 1. 在Chrome DevTools中加载SourceMap
// 2. 断点调试时可以看到原始源码
// 3. 错误堆栈会显示原始文件和行号
```

### 5.3 Bundle分析工具

```bash
# 1. react-native-bundle-visualizer
# 可视化Bundle内容，查看各模块大小

npm install --save-dev react-native-bundle-visualizer

# 生成可视化报告
npx react-native-bundle-visualizer

# 输出：在浏览器中打开交互式图表
# 显示每个模块的大小占比

# 2. source-map-explorer
# 分析SourceMap，查看代码来源

npm install -g source-map-explorer

# 分析Bundle
source-map-explorer ios/main.jsbundle ios/main.jsbundle.map

# 输出：HTML报告，显示每个文件的大小
```

---

## 第六章：构建优化策略

### 6.1 代码分割（Code Splitting）

```javascript
// 1. 动态导入（Lazy Loading）

// 不好的做法：一次性导入所有组件
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
// 这些都会被打包到主Bundle中

// 好的做法：按需加载
import React, { lazy, Suspense } from 'react';

const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Route path="/home" component={HomeScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/settings" component={SettingsScreen} />
      </Router>
    </Suspense>
  );
}

// 2. 使用react-native-code-splitting
npm install react-native-code-splitting

// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // 启用内联require
      },
    }),
  },
};
```

### 6.2 Tree Shaking

```javascript
// Tree Shaking自动移除未使用的代码

// utils.js
export function usedFunction() {
  return 'used';
}

export function unusedFunction() {
  return 'unused'; // 这个函数不会被打包
}

// App.js
import { usedFunction } from './utils';
// 只使用了usedFunction，unusedFunction会被移除

// 注意：Tree Shaking需要ES6模块（import/export）
// CommonJS（require/module.exports）不支持Tree Shaking

// 不好的做法：
const utils = require('./utils'); // 整个utils都会被打包

// 好的做法：
import { usedFunction } from './utils'; // 只打包用到的
```

### 6.3 内联Require（Inline Requires）

```javascript
// Inline Requires将require调用延迟到使用时

// 配置 metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true, // 启用内联require
      },
    }),
  },
};

// 转换前：
import React from 'react';
import { View, Text } from 'react-native';
import SomeComponent from './SomeComponent';

function App() {
  return (
    <View>
      <Text>Hello</Text>
      {condition && <SomeComponent />}
    </View>
  );
}

// 转换后：
function App() {
  // require被内联到使用处
  const React = require('react');
  const { View, Text } = require('react-native');

  return (
    React.createElement(View, null,
      React.createElement(Text, null, 'Hello'),
      condition && React.createElement(require('./SomeComponent').default)
    )
  );
}

// 优势：
// 1. 减小启动时需要加载的代码量
// 2. 按需加载，提升启动速度
// 3. 对于条件导入的模块，可能永远不会加载
```

### 6.4 压缩优化

```javascript
// metro.config.js
module.exports = {
  transformer: {
    minifierConfig: {
      // 保留类名和函数名（有助于调试）
      keep_classnames: true,
      keep_fnames: true,

      // 混淆配置
      mangle: {
        toplevel: false,
        keep_classnames: true,
        keep_fnames: true,
      },

      // 输出配置
      output: {
        ascii_only: true, // 只输出ASCII字符
        beautify: false,  // 不格式化
        comments: false,  // 移除注释
      },

      // 压缩配置
      compress: {
        drop_console: true,  // 移除console.log
        drop_debugger: true, // 移除debugger
        reduce_funcs: false,
      },
    },
  },
};

// 自定义压缩
const terser = require('terser');

async function minifyBundle(code) {
  const result = await terser.minify(code, {
    compress: {
      drop_console: true,
      dead_code: true,
      unused: true,
    },
    mangle: {
      toplevel: true,
    },
  });

  return result.code;
}
```

### 6.5 资源优化

```javascript
// 1. 图片优化

// 使用合适的图片格式和尺寸
// assets/images/
//   logo.png          // 1x (100x100)
//   logo@2x.png       // 2x (200x200)
//   logo@3x.png       // 3x (300x300)

// 压缩图片
npm install -g imagemin-cli

imagemin assets/images/*.png --out-dir=assets/images/optimized

// 使用WebP格式（体积更小）
npm install -g imagemin-webp

imagemin assets/images/*.png --plugin=webp > assets/images/optimized

// 2. 字体优化

// 只包含需要的字符集
// 使用字体子集化工具
npm install -g glyphhanger

glyphhanger --subset=custom-font.ttf --whitelist=ABCD...

// 3. 按需加载资源

// 不好的做法：预加载所有图片
const images = {
  logo: require('./assets/logo.png'),
  banner1: require('./assets/banner1.png'),
  banner2: require('./assets/banner2.png'),
  // ... 100+ 图片
};

// 好的做法：动态加载
function loadImage(name) {
  return require(`./assets/${name}.png`);
}

// 使用时才加载
<Image source={loadImage('logo')} />
```

---

## 第七章：多Bundle与拆包

### 7.1 基础Bundle + 业务Bundle

```javascript
// 策略：将基础库和业务代码分离

// 1. 打包基础Bundle（React、React Native、常用库）
npx react-native bundle \
  --entry-file base.js \
  --platform ios \
  --dev false \
  --bundle-output ios/base.jsbundle

// base.js
import 'react';
import 'react-native';
import 'redux';
import 'react-redux';
// ... 其他基础库

// 2. 打包业务Bundle（应用代码）
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output ios/business.jsbundle

// 3. 加载多个Bundle
// AppDelegate.m (iOS)
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  // 加载基础Bundle
  NSURL *baseURL = [[NSBundle mainBundle] URLForResource:@"base" withExtension:@"jsbundle"];
  [bridge loadAndExecuteScriptURL:baseURL];

  // 加载业务Bundle
  return [[NSBundle mainBundle] URLForResource:@"business" withExtension:@"jsbundle"];
}

// 优势：
// - 基础Bundle很少变化，可以缓存
// - 业务Bundle频繁更新，单独热更新
// - 减小热更新包大小
```

### 7.2 按功能模块拆分

```javascript
// 使用react-native-multibundler

npm install react-native-multibundler

// multibundle.config.js
module.exports = {
  bundles: [
    {
      name: 'common',
      entry: 'common.js',
      output: 'ios/common.jsbundle',
    },
    {
      name: 'home',
      entry: 'modules/home/index.js',
      output: 'ios/home.jsbundle',
      dependencies: ['common'], // 依赖common bundle
    },
    {
      name: 'profile',
      entry: 'modules/profile/index.js',
      output: 'ios/profile.jsbundle',
      dependencies: ['common'],
    },
  ],
};

// 运行打包
npx multibundler

// 动态加载模块Bundle
import { BundleLoader } from 'react-native-multibundler';

async function navigateToProfile() {
  // 检查是否已加载
  if (!BundleLoader.isLoaded('profile')) {
    // 下载并加载Profile Bundle
    await BundleLoader.load('profile');
  }

  // 导航到Profile页面
  navigation.navigate('Profile');
}
```

### 7.3 RAM Bundle（随机访问模块）

```javascript
// RAM Bundle将每个模块拆分为独立文件，按需加载

// iOS打包
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios \
  --ram-bundle

// 生成的文件结构：
// ios/
//   ├── main.jsbundle (索引文件)
//   └── js-modules/
//       ├── 0.js (模块0)
//       ├── 1.js (模块1)
//       ├── 2.js (模块2)
//       └── ...

// Android打包
npx react-native bundle \
  --entry-file index.js \
  --platform android \
  --dev false \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --indexed-ram-bundle

// 配置 metro.config.js
module.exports = {
  serializer: {
    createModuleIdFactory: () => {
      return (path) => {
        // 生成稳定的模块ID
        return crypto.createHash('md5').update(path).digest('hex').substr(0, 8);
      };
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

// 优势：
// - 启动时只加载必需模块
// - 其他模块按需加载
// - 减小启动时间
// - 适合大型应用
```

---

## 第八章：CI/CD集成

### 8.1 GitHub Actions自动构建

```yaml
# .github/workflows/build-bundle.yml
name: Build React Native Bundle

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-ios-bundle:
    runs-on: macos-latest

    steps:
      - name: Checkout代码
        uses: actions/checkout@v3

      - name: 设置Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: 安装依赖
        run: npm ci

      - name: 构建iOS Bundle
        run: |
          npx react-native bundle \
            --entry-file index.js \
            --platform ios \
            --dev false \
            --bundle-output ios/main.jsbundle \
            --assets-dest ios \
            --sourcemap-output ios/main.jsbundle.map

      - name: 查看Bundle大小
        run: |
          ls -lh ios/main.jsbundle
          echo "Bundle size: $(du -h ios/main.jsbundle | cut -f1)"

      - name: 上传Bundle到Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ios-bundle
          path: |
            ios/main.jsbundle
            ios/main.jsbundle.map

  build-android-bundle:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout代码
        uses: actions/checkout@v3

      - name: 设置Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: 安装依赖
        run: npm ci

      - name: 构建Android Bundle
        run: |
          npx react-native bundle \
            --entry-file index.js \
            --platform android \
            --dev false \
            --bundle-output android/app/src/main/assets/index.android.bundle \
            --assets-dest android/app/src/main/res \
            --sourcemap-output android/app/src/main/assets/index.android.bundle.map

      - name: 上传Bundle到Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: android-bundle
          path: |
            android/app/src/main/assets/index.android.bundle
            android/app/src/main/assets/index.android.bundle.map
```

### 8.2 自动发布到CodePush

```yaml
# .github/workflows/codepush-release.yml
name: CodePush Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: 设置Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: 安装依赖
        run: npm ci

      - name: 安装CodePush CLI
        run: npm install -g code-push-cli

      - name: CodePush登录
        run: code-push login --accessKey ${{ secrets.CODEPUSH_ACCESS_KEY }}

      - name: 发布iOS更新
        run: |
          code-push release-react MyApp-iOS ios \
            --deploymentName Production \
            --description "Release ${{ github.ref_name }}" \
            --mandatory false

      - name: 发布Android更新
        run: |
          code-push release-react MyApp-Android android \
            --deploymentName Production \
            --description "Release ${{ github.ref_name }}" \
            --mandatory false
```

### 8.3 Bundle质量检查

```javascript
// scripts/check-bundle.js
const fs = require('fs');
const path = require('path');

const MAX_BUNDLE_SIZE_MB = 5; // 5MB限制
const BUNDLE_PATH = process.argv[2];

if (!BUNDLE_PATH) {
  console.error('请提供Bundle路径');
  process.exit(1);
}

// 检查Bundle大小
const stats = fs.statSync(BUNDLE_PATH);
const sizeMB = stats.size / 1024 / 1024;

console.log(`📊 Bundle大小: ${sizeMB.toFixed(2)} MB`);

if (sizeMB > MAX_BUNDLE_SIZE_MB) {
  console.error(`❌ Bundle过大！超过${MAX_BUNDLE_SIZE_MB}MB限制`);
  process.exit(1);
}

// 检查Bundle内容
const content = fs.readFileSync(BUNDLE_PATH, 'utf8');

// 检查是否包含console.log（生产环境不应该有）
const consoleCount = (content.match(/console\.log/g) || []).length;
if (consoleCount > 0) {
  console.warn(`⚠️  发现 ${consoleCount} 个console.log，建议移除`);
}

// 检查是否包含debugger
if (content.includes('debugger')) {
  console.error('❌ Bundle包含debugger语句');
  process.exit(1);
}

// 检查模块数量
const moduleCount = (content.match(/__d\(/g) || []).length;
console.log(`📦 模块数量: ${moduleCount}`);

console.log('✅ Bundle检查通过');
```

```yaml
# 在CI中使用
- name: 检查Bundle质量
  run: node scripts/check-bundle.js ios/main.jsbundle
```

---

## 总结

### Bundle构建核心要点

1. **理解原理**
   - Bundle = JavaScript代码 + 资源文件
   - Metro是RN的打包工具
   - 模块化系统基于CommonJS

2. **构建流程**
   - 解析依赖 → 转换代码 → 优化 → 序列化
   - 开发模式：实时编译
   - 生产模式：完整打包

3. **优化策略**
   - 代码分割（Code Splitting）
   - Tree Shaking
   - 内联Require
   - 资源压缩

4. **高级技巧**
   - 多Bundle拆分
   - RAM Bundle
   - Hermes字节码
   - 差异化更新

5. **工程化**
   - CI/CD自动构建
   - Bundle质量检查
   - 版本管理
   - 监控分析

### 实践建议

**开发阶段**
- 使用Metro开发服务器
- 启用Hot Reload
- 保留SourceMap

**测试阶段**
- 构建Release Bundle
- 测试Bundle大小
- 验证性能

**生产阶段**
- 启用所有优化
- 移除console.log
- 使用Hermes引擎
- 配置热更新

---

**掌握Bundle构建原理，能够让你更好地优化应用性能和开发流程！** 🚀

---

*推荐阅读*
- Metro官方文档：https://facebook.github.io/metro/
- React Native性能优化：https://reactnative.dev/docs/performance
- Hermes引擎：https://hermesengine.dev/
