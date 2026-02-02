# React Native 核心原理

> 深入理解React Native架构演进、通信机制与新架构

## 目录

- [第一章：架构演进概述](#第一章架构演进概述)
- [第二章：旧架构原理](#第二章旧架构原理)
- [第三章：Bridge通信机制](#第三章bridge通信机制)
- [第四章：新架构概述](#第四章新架构概述)
- [第五章：JSI详解](#第五章jsi详解)
- [第六章：Fabric渲染器](#第六章fabric渲染器)
- [第七章：TurboModules](#第七章turbomodules)
- [第八章：Codegen](#第八章codegen)

---

## 第一章：架构演进概述

### 1.1 React Native是什么

```typescript
/*
React Native架构的三大核心问题：

1. 如何让JavaScript代码运行在移动端？
   → JavaScript引擎（JavaScriptCore / Hermes）

2. 如何让JS调用原生功能？
   → Bridge（旧架构）/ JSI（新架构）

3. 如何将React组件渲染为原生UI？
   → 渲染器（Fabric）

React Native应用组成：

┌─────────────────────────────────────────┐
│         React Native App                │
├─────────────────────────────────────────┤
│  JavaScript Layer (React代码)           │
│  • 业务逻辑                             │
│  • UI组件                               │
│  • 状态管理                             │
├─────────────────────────────────────────┤
│  Bridge / JSI (通信层)                  │
│  • JS ↔ Native 通信                     │
│  • 序列化/反序列化（旧架构）            │
│  • 直接函数调用（新架构）               │
├─────────────────────────────────────────┤
│  Native Layer (原生代码)                │
│  • iOS: Objective-C / Swift             │
│  • Android: Java / Kotlin               │
│  • 原生UI组件                           │
│  • 系统API调用                          │
└─────────────────────────────────────────┘
*/
```

### 1.2 架构演进历史

```typescript
/*
React Native架构演进：

2015 - 初代架构（Bridge架构）
├─ JavaScript引擎：JavaScriptCore
├─ 通信方式：异步Bridge
├─ 渲染：原生UI组件
└─ 问题：
   • Bridge性能瓶颈
   • 序列化开销
   • 无法同步调用

2018 - Fabric重写渲染器（部分新架构）
├─ 新的渲染系统
├─ 同步渲染能力
└─ C++实现核心逻辑

2019 - JSI引入（新架构核心）
├─ 直接函数调用
├─ 同步访问原生模块
└─ 移除序列化开销

2020 - TurboModules
├─ 按需加载原生模块
├─ 类型安全
└─ 更好的性能

2021-2024 - 新架构逐步普及
├─ Hermes引擎默认启用
├─ Fabric成为默认渲染器
├─ TurboModules生态完善
└─ Codegen自动生成代码

新旧架构对比：

┌──────────────┬──────────────┬──────────────┐
│   特性       │  旧架构      │  新架构      │
├──────────────┼──────────────┼──────────────┤
│ 通信机制     │ Bridge       │ JSI          │
│ 调用方式     │ 异步         │ 同步+异步    │
│ 数据传输     │ JSON序列化   │ 直接传递     │
│ 渲染器       │ UIManager    │ Fabric       │
│ 原生模块     │ NativeModule │ TurboModule  │
│ 启动时间     │ 慢           │ 快           │
│ 运行性能     │ 一般         │ 优秀         │
│ 内存占用     │ 高           │ 低           │
└──────────────┴──────────────┴──────────────┘
*/
```

---

## 第二章：旧架构原理

### 2.1 三线程模型

```typescript
/*
旧架构的三个线程：

┌─────────────────────────────────────────────────┐
│  JavaScript Thread（JS线程）                    │
│  • 执行JS代码                                   │
│  • React调和算法                                │
│  • 业务逻辑处理                                 │
│  • Metro Bundle运行                             │
└─────────────────────────────────────────────────┘
                    ↕ Bridge (异步通信)
┌─────────────────────────────────────────────────┐
│  Native Thread（原生主线程）                    │
│  • UI渲染                                       │
│  • 事件处理                                     │
│  • 原生模块调用                                 │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│  Shadow Thread（影子线程）                      │
│  • 计算布局（Yoga）                             │
│  • 创建Shadow Tree                              │
│  • Flexbox计算                                  │
└─────────────────────────────────────────────────┘
*/

// 旧架构渲染流程
/*
Step 1: React组件树更新（JS Thread）
<View style={{ width: 100 }}>
  <Text>Hello</Text>
</View>

↓

Step 2: 生成UI指令通过Bridge发送（JSON序列化）
{
  "type": "createView",
  "viewId": 42,
  "viewName": "RCTView",
  "props": { "style": { "width": 100 } }
}

↓

Step 3: Shadow Thread计算布局
- 使用Yoga引擎计算Flexbox
- 生成Shadow Tree
- 计算每个元素的位置和大小

↓

Step 4: 将布局结果发送到Native Thread
{
  "viewId": 42,
  "frame": { "x": 0, "y": 0, "width": 100, "height": 50 }
}

↓

Step 5: Native Thread创建真实UI（主线程）
- 创建UIView（iOS）或View（Android）
- 应用样式和属性
- 添加到视图层级
*/
```

### 2.2 Bridge工作原理

```typescript
// Bridge的实现机制（简化版）

// JavaScript端
class MessageQueue {
  private callId = 0;
  private callbacks = new Map();

  // JS调用Native
  callNativeModule(
    moduleId: number,
    methodId: number,
    args: any[]
  ): void {
    const message = [moduleId, methodId, args];
    // 序列化为JSON字符串
    const jsonString = JSON.stringify(message);
    // 通过Bridge发送
    global.nativeFlushQueueImmediate([message]);
  }

  // Native调用JS（带回调）
  invokeCallbackAndReturnFlushedQueue(
    callbackId: number,
    args: any[]
  ): void {
    const callback = this.callbacks.get(callbackId);
    if (callback) {
      callback(...args);
      this.callbacks.delete(callbackId);
    }
  }
}

// 示例：调用原生Toast模块
// JS代码
NativeModules.ToastAndroid.show('Hello', ToastAndroid.SHORT);

// 内部执行：
// 1. 查找ToastAndroid模块ID（假设为3）
// 2. 查找show方法ID（假设为1）
// 3. 构造消息：[3, 1, ['Hello', 1]]
// 4. JSON序列化："[3,1,[\"Hello\",1]]"
// 5. 通过Bridge发送到Native

// Android端（Java）
public class ToastModule extends ReactContextBaseJavaModule {
  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(
      getReactApplicationContext(),
      message,
      duration
    ).show();
  }
}

// Bridge接收消息流程：
// 1. 接收JSON字符串："[3,1,[\"Hello\",1]]"
// 2. 解析为数组：[3, 1, ['Hello', 1]]
// 3. moduleId=3 → 查找ToastModule
// 4. methodId=1 → 查找show方法
// 5. args=['Hello', 1] → 调用show('Hello', 1)
```

### 2.3 旧架构的性能问题

```typescript
/*
Bridge架构的主要性能问题：

1. 序列化开销
*/
// 大数据传输示例
const largeData = {
  items: Array(1000).fill(null).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: 'Long description...',
    metadata: { /* 更多数据 */ }
  }))
};

// 旧架构：
// 1. JS将对象转为JSON字符串（耗时）
const json = JSON.stringify(largeData); // ~500ms for 1000 items
// 2. Bridge传输字符串
// 3. Native解析JSON（耗时）
const obj = JSON.parse(json); // ~300ms

// 总开销：~800ms + 传输时间

/*
2. 异步通信限制
*/
// 无法同步获取原生数据
// ❌ 旧架构不支持
const screenWidth = NativeModules.Dimensions.getSync('width'); // 不存在

// ✅ 只能异步
NativeModules.Dimensions.get('window').then(dims => {
  console.log(dims.width);
});

/*
3. Bridge拥塞
*/
// 大量消息堆积在Bridge队列
for (let i = 0; i < 1000; i++) {
  NativeModules.Analytics.track('event', { data: i });
}
// 所有1000条消息都要排队、序列化、传输、反序列化

/*
4. 内存占用高
*/
// Bridge需要维护：
// - 模块注册表
// - 方法映射表
// - 回调队列
// - 消息队列
// - 序列化缓冲区

/*
5. 启动慢
*/
// 应用启动时需要：
// 1. 加载所有Native Module（即使不用）
// 2. 构建模块注册表
// 3. 初始化Bridge
// 4. 加载JS Bundle
// 总耗时：2-5秒
```

---

## 第三章：Bridge通信机制

### 3.1 JS调用Native

```typescript
// 完整的调用链路

// 1. JS层：调用Native Module
import { NativeModules } from 'react-native';

const { LocationManager } = NativeModules;

LocationManager.getCurrentPosition(
  (position) => {
    console.log('Position:', position);
  },
  (error) => {
    console.error('Error:', error);
  }
);

// 2. 内部实现（react-native源码简化版）
class NativeModules {
  static LocationManager = {
    getCurrentPosition(successCallback, errorCallback) {
      const moduleId = this.__moduleId; // 假设为5
      const methodId = this.__methods['getCurrentPosition']; // 假设为2

      // 生成回调ID
      const successCallbackId = MessageQueue.registerCallback(successCallback);
      const errorCallbackId = MessageQueue.registerCallback(errorCallback);

      // 构造消息
      const message = {
        moduleId: moduleId,
        methodId: methodId,
        args: [successCallbackId, errorCallbackId]
      };

      // 发送到Native
      MessageQueue.enqueueNativeCall(message);
    }
  };
}

// 3. Native层（iOS - Objective-C）
@implementation LocationManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getCurrentPosition:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)errorCallback)
{
  CLLocationManager *locationManager = [[CLLocationManager alloc] init];

  [locationManager requestWhenInUseAuthorization];

  CLLocation *location = locationManager.location;

  if (location) {
    NSDictionary *position = @{
      @"latitude": @(location.coordinate.latitude),
      @"longitude": @(location.coordinate.longitude)
    };

    // 调用成功回调
    successCallback(@[position]);
  } else {
    // 调用错误回调
    errorCallback(@[@"Location not available"]);
  }
}

@end

// 4. Native调用JS回调
// Native通过Bridge发送消息：
// {
//   "callbackId": 123,
//   "args": [{ "latitude": 37.7749, "longitude": -122.4194 }]
// }

// 5. JS接收回调
MessageQueue.invokeCallback(123, [position]);
// 执行之前注册的successCallback
```

### 3.2 Native调用JS

```typescript
// Native主动调用JS（事件机制）

// 1. JS层：注册事件监听
import { NativeEventEmitter, NativeModules } from 'react-native';

const { CalendarManager } = NativeModules;
const calendarEmitter = new NativeEventEmitter(CalendarManager);

// 添加监听器
const subscription = calendarEmitter.addListener(
  'EventReminder',
  (reminder) => {
    console.log('Reminder:', reminder.name);
  }
);

// 移除监听器
subscription.remove();

// 2. Native层（Android - Java）
public class CalendarModule extends ReactContextBaseJavaModule {

  public CalendarModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "CalendarManager";
  }

  // 发送事件到JS
  private void sendEvent(String eventName, WritableMap params) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  // 触发事件
  public void scheduleReminder(String eventName) {
    WritableMap params = Arguments.createMap();
    params.putString("name", eventName);

    sendEvent("EventReminder", params);
  }
}

// 3. Bridge传输
// Native → Bridge:
// {
//   "type": "emit",
//   "eventName": "EventReminder",
//   "data": { "name": "Meeting at 3pm" }
// }

// Bridge → JS:
// 调用注册的监听器函数
```

### 3.3 Promise与异步处理

```typescript
// Promise在Bridge中的实现

// JS层
NativeModules.DatabaseManager.query('SELECT * FROM users')
  .then(results => {
    console.log('Results:', results);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Native层（iOS）
@implementation DatabaseManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(query:(NSString *)sql
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // 执行数据库查询
  NSArray *results = [self executeQuery:sql];

  if (results) {
    // 成功：resolve
    resolve(results);
  } else {
    // 失败：reject
    NSError *error = [NSError errorWithDomain:@"Database"
                                         code:500
                                     userInfo:nil];
    reject(@"query_failed", @"Failed to execute query", error);
  }
}

@end

// Bridge内部实现（简化）
class PromiseHandler {
  query(sql: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const resolveCallbackId = MessageQueue.registerCallback(resolve);
      const rejectCallbackId = MessageQueue.registerCallback(reject);

      MessageQueue.enqueueNativeCall({
        moduleId: DatabaseManager.__moduleId,
        methodId: DatabaseManager.__methods['query'],
        args: [sql, resolveCallbackId, rejectCallbackId]
      });
    });
  }
}
```

---

## 第四章：新架构概述

### 4.1 新架构核心组件

```typescript
/*
新架构（JSI架构）的核心组件：

┌─────────────────────────────────────────────────┐
│  JavaScript Layer                               │
│  • React代码                                    │
│  • 业务逻辑                                     │
└─────────────────────────────────────────────────┘
                    ↕ JSI (直接函数调用)
┌─────────────────────────────────────────────────┐
│  C++ Core (Fabric + TurboModules)               │
│  • JSI Runtime                                  │
│  • Fabric Renderer                              │
│  • TurboModule Manager                          │
│  • Codegen生成的绑定代码                        │
└─────────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────────┐
│  Native Layer (iOS / Android)                   │
│  • 原生UI组件                                   │
│  • 系统API                                      │
└─────────────────────────────────────────────────┘

核心特性：

1. JSI (JavaScript Interface)
   - JS与C++直接交互
   - 移除序列化开销
   - 支持同步调用
   - 共享内存

2. Fabric (新渲染器)
   - C++实现
   - 同步布局计算
   - 优先级调度
   - 并发渲染

3. TurboModules (新原生模块系统)
   - 按需加载
   - 类型安全
   - 更好的性能
   - Codegen自动生成

4. Hermes (优化的JS引擎)
   - 更快的启动
   - 更小的包体积
   - 更低的内存占用
   - 字节码预编译
*/
```

### 4.2 性能对比

```typescript
/*
新旧架构性能对比：

┌──────────────────┬──────────┬──────────┬────────┐
│     指标         │  旧架构  │  新架构  │ 提升   │
├──────────────────┼──────────┼──────────┼────────┤
│ 启动时间         │  2500ms  │  800ms   │ 68%↓   │
│ TTI (可交互时间) │  3500ms  │  1200ms  │ 66%↓   │
│ 内存占用         │  150MB   │  80MB    │ 47%↓   │
│ 列表滚动帧率     │  45 FPS  │  60 FPS  │ 33%↑   │
│ 动画流畅度       │  一般    │  优秀    │ 显著↑  │
│ 大数据传输       │  800ms   │  50ms    │ 94%↓   │
│ 同步调用         │  不支持  │  支持    │ 质变   │
└──────────────────┴──────────┴──────────┴────────┘

实测案例：

1. 列表渲染（1000条数据）
   旧架构：初始渲染3.2s，滚动卡顿
   新架构：初始渲染0.8s，丝滑60fps

2. 复杂动画
   旧架构：掉帧严重，平均45fps
   新架构：稳定60fps

3. 原生模块调用（100次）
   旧架构：~2000ms（序列化+传输）
   新架构：~100ms（直接调用）

4. 应用启动
   旧架构：冷启动3.5s
   新架构：冷启动1.0s
*/

// 性能提升示例：同步获取屏幕尺寸
// 旧架构（异步）
Dimensions.addEventListener('change', ({ window }) => {
  const width = window.width; // 只能通过事件获取
});

// 新架构（同步）
const width = Dimensions.get('window').width; // 直接同步获取
```

---

## 第五章：JSI详解

### 5.1 JSI核心概念

```cpp
// JSI是什么？
/*
JSI (JavaScript Interface) 是一个轻量级的API，
允许JavaScript直接调用C++函数，无需序列化。

核心原理：
1. JavaScript引擎（Hermes/V8/JSC）暴露C++ API
2. C++函数注册到JS Runtime
3. JS可以直接调用C++函数（如同调用普通JS函数）
4. C++可以直接操作JS对象
*/

// JSI核心接口（简化版）
namespace facebook {
namespace jsi {

// JSI Runtime - JS引擎的抽象
class Runtime {
public:
  // 创建JS对象
  virtual Object createObject() = 0;

  // 创建JS函数
  virtual Function createFunctionFromHostFunction(
    const PropNameID& name,
    unsigned int paramCount,
    HostFunctionType func
  ) = 0;

  // 获取全局对象
  virtual Object global() = 0;

  // 执行JS代码
  virtual Value evaluateJavaScript(
    const std::shared_ptr<const Buffer>& buffer,
    const std::string& sourceURL
  ) = 0;
};

// JS Value类型
class Value {
public:
  bool isUndefined() const;
  bool isNull() const;
  bool isBool() const;
  bool isNumber() const;
  bool isString() const;
  bool isObject() const;

  bool getBool() const;
  double getNumber() const;
  std::string getString(Runtime& runtime) const;
  Object getObject(Runtime& runtime) const;
};

} // namespace jsi
} // namespace facebook
```

### 5.2 使用JSI创建原生模块

```cpp
// C++端：实现原生模块

#include <jsi/jsi.h>

using namespace facebook::jsi;

// 定义原生函数
class MathModule {
public:
  static void install(Runtime& runtime) {
    // 创建Math对象
    auto mathObject = Object(runtime);

    // 添加add方法
    auto add = Function::createFromHostFunction(
      runtime,
      PropNameID::forAscii(runtime, "add"),
      2, // 参数个数
      [](Runtime& runtime,
         const Value& thisValue,
         const Value* args,
         size_t count) -> Value {

        // 直接获取参数（无需序列化）
        double a = args[0].getNumber();
        double b = args[1].getNumber();

        // 计算并返回
        return Value(a + b);
      }
    );

    mathObject.setProperty(runtime, "add", add);

    // 添加multiply方法
    auto multiply = Function::createFromHostFunction(
      runtime,
      PropNameID::forAscii(runtime, "multiply"),
      2,
      [](Runtime& runtime,
         const Value& thisValue,
         const Value* args,
         size_t count) -> Value {

        double a = args[0].getNumber();
        double b = args[1].getNumber();
        return Value(a * b);
      }
    );

    mathObject.setProperty(runtime, "multiply", multiply);

    // 注册到全局对象
    runtime.global().setProperty(
      runtime,
      "NativeMath",
      mathObject
    );
  }
};

// 在应用启动时安装
void initializeJSI(Runtime& runtime) {
  MathModule::install(runtime);
}
```

```typescript
// JavaScript端：直接调用

// 同步调用，零开销
const result = global.NativeMath.add(10, 20);
console.log(result); // 30

const product = global.NativeMath.multiply(5, 6);
console.log(product); // 30

// 性能对比
console.time('JSI');
for (let i = 0; i < 10000; i++) {
  global.NativeMath.add(i, i + 1);
}
console.timeEnd('JSI'); // ~5ms

// 旧Bridge方式
console.time('Bridge');
for (let i = 0; i < 10000; i++) {
  NativeModules.Math.add(i, i + 1); // 每次都序列化
}
console.timeEnd('Bridge'); // ~2000ms
```

### 5.3 JSI与原生对象交互

```cpp
// 复杂对象的传递

// C++端
class DataModule {
public:
  static void install(Runtime& runtime) {
    auto dataObj = Object(runtime);

    // 返回复杂对象
    auto getUserData = Function::createFromHostFunction(
      runtime,
      PropNameID::forAscii(runtime, "getUserData"),
      0,
      [](Runtime& runtime,
         const Value& thisValue,
         const Value* args,
         size_t count) -> Value {

        // 创建JS对象（无需序列化）
        auto user = Object(runtime);

        // 设置属性
        user.setProperty(runtime, "id", Value(123));
        user.setProperty(
          runtime,
          "name",
          String::createFromAscii(runtime, "John Doe")
        );
        user.setProperty(runtime, "age", Value(30));

        // 嵌套对象
        auto address = Object(runtime);
        address.setProperty(
          runtime,
          "city",
          String::createFromAscii(runtime, "San Francisco")
        );
        user.setProperty(runtime, "address", address);

        // 数组
        auto hobbies = Array(runtime, 3);
        hobbies.setValueAtIndex(
          runtime, 0,
          String::createFromAscii(runtime, "coding")
        );
        hobbies.setValueAtIndex(
          runtime, 1,
          String::createFromAscii(runtime, "reading")
        );
        hobbies.setValueAtIndex(
          runtime, 2,
          String::createFromAscii(runtime, "gaming")
        );
        user.setProperty(runtime, "hobbies", hobbies);

        return user;
      }
    );

    dataObj.setProperty(runtime, "getUserData", getUserData);

    runtime.global().setProperty(runtime, "NativeData", dataObj);
  }
};
```

```typescript
// JS端直接使用
const user = global.NativeData.getUserData();

console.log(user.name); // "John Doe"
console.log(user.address.city); // "San Francisco"
console.log(user.hobbies[0]); // "coding"

// 关键：没有JSON.parse()，直接就是JS对象！
```

### 5.4 共享内存

```cpp
// JSI最强大的功能：共享内存

// C++端：创建ArrayBuffer
class ImageModule {
public:
  static void install(Runtime& runtime) {
    auto imageObj = Object(runtime);

    auto loadImage = Function::createFromHostFunction(
      runtime,
      PropNameID::forAscii(runtime, "loadImage"),
      1,
      [](Runtime& runtime,
         const Value& thisValue,
         const Value* args,
         size_t count) -> Value {

        std::string path = args[0].getString(runtime).utf8(runtime);

        // 从文件加载图像数据
        std::vector<uint8_t> imageData = loadImageFromDisk(path);

        // 创建ArrayBuffer（共享内存）
        auto arrayBuffer = runtime.global()
          .getPropertyAsFunction(runtime, "ArrayBuffer")
          .callAsConstructor(runtime, (int)imageData.size())
          .getObject(runtime);

        // 获取底层缓冲区
        auto buffer = arrayBuffer.getArrayBuffer(runtime);

        // 直接写入数据（零拷贝）
        memcpy(buffer.data(runtime), imageData.data(), imageData.size());

        return arrayBuffer;
      }
    );

    imageObj.setProperty(runtime, "loadImage", loadImage);

    runtime.global().setProperty(runtime, "NativeImage", imageObj);
  }
};
```

```typescript
// JS端：直接访问原生内存
const imageBuffer = global.NativeImage.loadImage('/path/to/image.jpg');

// imageBuffer是ArrayBuffer，可以直接使用
const uint8Array = new Uint8Array(imageBuffer);

// 处理图像数据（零拷贝！）
for (let i = 0; i < uint8Array.length; i++) {
  // 直接访问C++分配的内存
  const pixel = uint8Array[i];
}

// 性能：
// 旧架构：需要Base64编码 → JSON传输 → Base64解码
//        1MB图像 ≈ 1.5秒
// 新架构：共享内存，直接访问
//        1MB图像 ≈ 5毫秒
```

---

## 第六章：Fabric渲染器

### 6.1 Fabric架构

```typescript
/*
Fabric渲染器架构：

┌─────────────────────────────────────────────────┐
│  React (JavaScript)                             │
│  • 组件树                                       │
│  • Hooks                                        │
│  • 状态更新                                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Fabric Renderer (C++)                          │
│  ┌───────────────────────────────────────────┐ │
│  │  React Reconciler                         │ │
│  │  • Fiber树协调                            │ │
│  │  • Diff算法                               │ │
│  └───────────────────────────────────────────┘ │
│                    ↓                            │
│  ┌───────────────────────────────────────────┐ │
│  │  Shadow Tree                              │ │
│  │  • C++实现的虚拟DOM                       │ │
│  │  • 布局计算（Yoga）                       │ │
│  └───────────────────────────────────────────┘ │
│                    ↓                            │
│  ┌───────────────────────────────────────────┐ │
│  │  Mounting Layer                           │ │
│  │  • 创建/更新原生视图                      │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Native Views (UIView / View)                   │
└─────────────────────────────────────────────────┘

Fabric vs 旧渲染器：

旧渲染器流程：
React → Bridge(JSON) → Shadow Thread → Bridge → UI Thread
                ↑ 异步，序列化开销大

Fabric流程：
React → C++ Fabric → UI Thread
        ↑ 同步，直接调用
*/
```

### 6.2 Shadow Tree

```cpp
// Shadow Tree的C++实现（简化版）

namespace facebook {
namespace react {

// Shadow Node - Shadow Tree的节点
class ShadowNode {
private:
  Tag tag_; // 唯一标识
  std::string componentName_; // 组件名称
  Props props_; // 属性
  LayoutMetrics layoutMetrics_; // 布局信息
  std::vector<std::shared_ptr<ShadowNode>> children_; // 子节点

public:
  // 创建Shadow Node
  static std::shared_ptr<ShadowNode> create(
    const ShadowNodeFragment& fragment
  ) {
    return std::make_shared<ShadowNode>(fragment);
  }

  // 克隆节点（不可变性）
  std::shared_ptr<ShadowNode> clone(
    const ShadowNodeFragment& fragment
  ) const {
    auto newNode = std::make_shared<ShadowNode>(*this);
    // 更新props
    newNode->props_ = fragment.props;
    return newNode;
  }

  // 布局计算
  void layout(LayoutContext layoutContext) {
    // 使用Yoga进行Flexbox布局
    YGNodeRef yogaNode = getYogaNode();
    YGNodeCalculateLayout(
      yogaNode,
      YGUndefined,
      YGUndefined,
      YGDirectionLTR
    );

    // 获取计算结果
    layoutMetrics_.frame = {
      .origin = {
        .x = YGNodeLayoutGetLeft(yogaNode),
        .y = YGNodeLayoutGetTop(yogaNode)
      },
      .size = {
        .width = YGNodeLayoutGetWidth(yogaNode),
        .height = YGNodeLayoutGetHeight(yogaNode)
      }
    };

    // 递归布局子节点
    for (auto& child : children_) {
      child->layout(layoutContext);
    }
  }
};

// Shadow Tree - 整棵树
class ShadowTree {
private:
  std::shared_ptr<ShadowNode> rootNode_;
  ShadowTreeDelegate* delegate_;

public:
  // 提交更新
  void commit(
    const ShadowTreeCommitTransaction& transaction
  ) {
    // 1. 创建新的Shadow Tree
    auto newRootNode = transaction.newRootShadowNode;

    // 2. 计算布局
    newRootNode->layout(LayoutContext{});

    // 3. Diff新旧树
    auto mutations = calculateMutations(rootNode_, newRootNode);

    // 4. 应用到UI
    delegate_->shadowTreeDidCommit(this, mutations);

    // 5. 更新根节点
    rootNode_ = newRootNode;
  }

  // 计算变更
  ShadowViewMutationList calculateMutations(
    const std::shared_ptr<ShadowNode>& oldNode,
    const std::shared_ptr<ShadowNode>& newNode
  ) {
    ShadowViewMutationList mutations;

    // Diff算法
    if (oldNode == nullptr && newNode != nullptr) {
      // 创建
      mutations.push_back(ShadowViewMutation::CreateMutation(newNode));
    } else if (oldNode != nullptr && newNode == nullptr) {
      // 删除
      mutations.push_back(ShadowViewMutation::DeleteMutation(oldNode));
    } else if (oldNode->getProps() != newNode->getProps()) {
      // 更新
      mutations.push_back(ShadowViewMutation::UpdateMutation(
        oldNode, newNode
      ));
    }

    // 递归处理子节点...

    return mutations;
  }
};

} // namespace react
} // namespace facebook
```

### 6.3 同步渲染

```typescript
// Fabric的同步渲染能力

// 场景：滚动时同步测量元素
const ScrollableList = () => {
  const ref = useRef<View>(null);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    setScrollY(y);

    // 新架构：可以同步测量
    if (ref.current) {
      // 同步获取布局信息（旧架构不支持）
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        // 在同一帧内完成
        console.log('Layout:', { x, y, width, height });
      });
    }
  };

  return (
    <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
      <View ref={ref}>
        {/* 内容 */}
      </View>
    </ScrollView>
  );
};

// 旧架构问题：
// 1. measure是异步的
// 2. 滚动和测量在不同帧
// 3. 造成视觉延迟

// Fabric优势：
// 1. 同步测量
// 2. 滚动和布局在同一帧
// 3. 丝滑体验
```

### 6.4 优先级调度

```cpp
// Fabric的优先级系统

enum class EventPriority {
  // 同步（最高优先级）
  // 例：文本输入
  SynchronousUnbatched,

  // 离散事件（高优先级）
  // 例：点击、按键
  DiscreteEvent,

  // 连续事件（普通优先级）
  // 例：滚动、鼠标移动
  ContinuousEvent,

  // 默认（低优先级）
  // 例：网络响应
  DefaultEvent,

  // 空闲（最低优先级）
  // 例：分析数据
  IdleEvent
};

// 调度器根据优先级决定何时处理更新
class Scheduler {
public:
  void scheduleUpdate(
    ShadowTree& shadowTree,
    EventPriority priority
  ) {
    switch (priority) {
      case EventPriority::SynchronousUnbatched:
        // 立即同步执行
        shadowTree.commit();
        break;

      case EventPriority::DiscreteEvent:
        // 在下一帧执行
        scheduleCallback(ImmediatePriority, [&]() {
          shadowTree.commit();
        });
        break;

      case EventPriority::ContinuousEvent:
        // 可以批处理
        scheduleBatchedCallback(NormalPriority, [&]() {
          shadowTree.commit();
        });
        break;

      // ... 其他优先级
    }
  }
};
```

---

## 第七章：TurboModules

### 7.1 TurboModule原理

```typescript
/*
TurboModules vs 旧Native Modules：

旧Native Modules：
- 启动时加载所有模块
- JSON序列化
- 异步调用
- 无类型安全

TurboModules：
- 按需加载（懒加载）
- 直接调用（JSI）
- 同步+异步
- 类型安全（Codegen）
- 更好的性能

加载对比：

旧方式：
App启动 → 加载50个Native Modules → 耗时1.5s
         ↑ 即使只用5个

新方式：
App启动 → 只注册TurboModule接口 → 耗时0.1s
使用时 → 按需加载具体模块 → 首次~10ms
*/
```

### 7.2 定义TurboModule

```typescript
// 1. 定义接口（使用Flow或TypeScript）

// NativeMath.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // 同步方法
  add(a: number, b: number): number;

  // 异步方法（返回Promise）
  multiply(a: number, b: number): Promise<number>;

  // 带回调的方法
  divide(
    a: number,
    b: number,
    callback: (result: number) => void
  ): void;

  // 复杂对象
  calculateStats(numbers: number[]): {
    sum: number;
    average: number;
    max: number;
    min: number;
  };

  // 可选参数
  power(base: number, exponent?: number): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeMath');
```

```cpp
// 2. C++实现（自动生成骨架代码）

// NativeMath.h
#pragma once

#include <ReactCommon/TurboModule.h>
#include "NativeMathSpec.h" // Codegen生成

namespace facebook {
namespace react {

class NativeMath : public NativeMathCxxSpec<NativeMath> {
public:
  NativeMath(std::shared_ptr<CallInvoker> jsInvoker);

  // 实现接口方法
  double add(jsi::Runtime& rt, double a, double b);

  jsi::Value multiply(
    jsi::Runtime& rt,
    double a,
    double b
  );

  void divide(
    jsi::Runtime& rt,
    double a,
    double b,
    jsi::Function callback
  );

  jsi::Object calculateStats(
    jsi::Runtime& rt,
    jsi::Array numbers
  );

  double power(
    jsi::Runtime& rt,
    double base,
    std::optional<double> exponent
  );
};

} // namespace react
} // namespace facebook
```

```cpp
// NativeMath.cpp
#include "NativeMath.h"
#include <cmath>
#include <algorithm>

namespace facebook {
namespace react {

NativeMath::NativeMath(std::shared_ptr<CallInvoker> jsInvoker)
  : NativeMathCxxSpec(std::move(jsInvoker)) {}

// 同步方法
double NativeMath::add(jsi::Runtime& rt, double a, double b) {
  return a + b;
}

// 异步方法（返回Promise）
jsi::Value NativeMath::multiply(
  jsi::Runtime& rt,
  double a,
  double b
) {
  // 创建Promise
  auto promise = createPromise(rt, [a, b](
    jsi::Runtime& rt,
    std::shared_ptr<Promise> promise
  ) {
    // 异步计算
    std::thread([a, b, promise]() {
      std::this_thread::sleep_for(std::chrono::milliseconds(100));
      double result = a * b;

      // Resolve promise
      promise->resolve(jsi::Value(result));
    }).detach();
  });

  return promise;
}

// 带回调
void NativeMath::divide(
  jsi::Runtime& rt,
  double a,
  double b,
  jsi::Function callback
) {
  if (b == 0) {
    // 错误处理
    auto error = jsi::String::createFromAscii(rt, "Division by zero");
    callback.call(rt, jsi::Value::null(), error);
    return;
  }

  double result = a / b;
  callback.call(rt, jsi::Value(result));
}

// 复杂对象
jsi::Object NativeMath::calculateStats(
  jsi::Runtime& rt,
  jsi::Array numbers
) {
  std::vector<double> nums;
  size_t length = numbers.length(rt);

  // 提取数组数据
  for (size_t i = 0; i < length; i++) {
    nums.push_back(numbers.getValueAtIndex(rt, i).getNumber());
  }

  // 计算统计信息
  double sum = std::accumulate(nums.begin(), nums.end(), 0.0);
  double avg = sum / nums.size();
  double max = *std::max_element(nums.begin(), nums.end());
  double min = *std::min_element(nums.begin(), nums.end());

  // 创建返回对象
  auto result = jsi::Object(rt);
  result.setProperty(rt, "sum", sum);
  result.setProperty(rt, "average", avg);
  result.setProperty(rt, "max", max);
  result.setProperty(rt, "min", min);

  return result;
}

// 可选参数
double NativeMath::power(
  jsi::Runtime& rt,
  double base,
  std::optional<double> exponent
) {
  double exp = exponent.value_or(2.0); // 默认值为2
  return std::pow(base, exp);
}

} // namespace react
} // namespace facebook
```

### 7.3 使用TurboModule

```typescript
// JavaScript使用

import NativeMath from './NativeMath';

// 同步调用
const sum = NativeMath.add(10, 20);
console.log(sum); // 30

// 异步调用
const product = await NativeMath.multiply(5, 6);
console.log(product); // 30

// 回调方式
NativeMath.divide(10, 2, (result) => {
  console.log(result); // 5
});

// 复杂对象
const stats = NativeMath.calculateStats([1, 2, 3, 4, 5]);
console.log(stats);
// {
//   sum: 15,
//   average: 3,
//   max: 5,
//   min: 1
// }

// 可选参数
const square = NativeMath.power(5); // 25 (默认exponent=2)
const cube = NativeMath.power(5, 3); // 125

// 性能对比
console.time('TurboModule');
for (let i = 0; i < 10000; i++) {
  NativeMath.add(i, i + 1);
}
console.timeEnd('TurboModule'); // ~5ms

console.time('OldModule');
for (let i = 0; i < 10000; i++) {
  OldNativeModules.Math.add(i, i + 1);
}
console.timeEnd('OldModule'); // ~2000ms

// 400倍性能提升！
```

---

## 第八章：Codegen

### 8.1 Codegen作用

```typescript
/*
Codegen的作用：

问题：手写原生绑定代码容易出错
- 类型不匹配
- 参数数量错误
- 忘记实现某些方法

解决：自动生成类型安全的绑定代码
- 从TypeScript/Flow接口定义生成C++/ObjC/Java代码
- 保证类型一致性
- 减少手写代码

工作流程：

1. 开发者编写接口定义（TS/Flow）
   ↓
2. Codegen解析接口
   ↓
3. 生成C++头文件和桥接代码
   ↓
4. 生成iOS（Objective-C++）绑定
   ↓
5. 生成Android（JNI）绑定
   ↓
6. 开发者只需实现业务逻辑
*/
```

### 8.2 Codegen示例

```typescript
// 1. 输入：接口定义 (NativeStorage.ts)

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeStorage');
```

```cpp
// 2. Codegen自动生成：NativeStorageSpec.h

#pragma once

#include <ReactCommon/TurboModule.h>
#include <ReactCommon/CallInvoker.h>

namespace facebook {
namespace react {

class JSI_EXPORT NativeStorageSpec : public TurboModule {
protected:
  NativeStorageSpec(std::shared_ptr<CallInvoker> jsInvoker);

public:
  // 纯虚函数，子类必须实现
  virtual jsi::Value setItem(
    jsi::Runtime& rt,
    jsi::String key,
    jsi::String value
  ) = 0;

  virtual jsi::Value getItem(
    jsi::Runtime& rt,
    jsi::String key
  ) = 0;

  virtual jsi::Value removeItem(
    jsi::Runtime& rt,
    jsi::String key
  ) = 0;

  virtual jsi::Value clear(jsi::Runtime& rt) = 0;

  virtual jsi::Value getAllKeys(jsi::Runtime& rt) = 0;
};

} // namespace react
} // namespace facebook
```

```objc
// 3. Codegen生成iOS绑定 (RCTNativeStorageSpec.h)

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@protocol RCTNativeStorageSpec <NSObject>

- (void)setItem:(NSString *)key
          value:(NSString *)value
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;

- (void)getItem:(NSString *)key
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;

- (void)removeItem:(NSString *)key
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject;

- (void)clear:(RCTPromiseResolveBlock)resolve
       reject:(RCTPromiseRejectBlock)reject;

- (void)getAllKeys:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject;

@end
```

```java
// 4. Codegen生成Android绑定 (NativeStorageSpec.java)

package com.myapp;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public abstract class NativeStorageSpec extends ReactContextBaseJavaModule {

  public NativeStorageSpec(ReactApplicationContext context) {
    super(context);
  }

  @ReactMethod
  public abstract void setItem(String key, String value, Promise promise);

  @ReactMethod
  public abstract void getItem(String key, Promise promise);

  @ReactMethod
  public abstract void removeItem(String key, Promise promise);

  @ReactMethod
  public abstract void clear(Promise promise);

  @ReactMethod
  public abstract void getAllKeys(Promise promise);
}
```

```cpp
// 5. 开发者实现业务逻辑 (NativeStorage.cpp)

#include "NativeStorage.h"
#include <fstream>

namespace facebook {
namespace react {

NativeStorage::NativeStorage(std::shared_ptr<CallInvoker> jsInvoker)
  : NativeStorageSpec(std::move(jsInvoker)) {}

jsi::Value NativeStorage::setItem(
  jsi::Runtime& rt,
  jsi::String key,
  jsi::String value
) {
  // 实现存储逻辑
  std::string k = key.utf8(rt);
  std::string v = value.utf8(rt);

  return createPromise(rt, [k, v](auto rt, auto promise) {
    // 异步写入文件
    std::ofstream file(k);
    file << v;
    file.close();

    promise->resolve(jsi::Value::undefined());
  });
}

// ... 其他方法实现

} // namespace react
} // namespace facebook
```

### 8.3 类型安全的好处

```typescript
// Codegen保证类型安全

// ✅ 正确使用
await NativeStorage.setItem('key', 'value'); // OK

// ❌ 类型错误（编译时发现）
await NativeStorage.setItem(123, 'value'); // Error: key必须是string
await NativeStorage.setItem('key', 123); // Error: value必须是string

// ✅ 返回值类型正确
const value: string | null = await NativeStorage.getItem('key');

// ❌ 类型错误
const value: number = await NativeStorage.getItem('key'); // Error

// Codegen生成的代码确保：
// 1. JS类型 ↔ C++类型 匹配
// 2. 参数数量正确
// 3. 返回值类型正确
// 4. Promise/Callback正确处理

// 没有Codegen的旧方式：
// - 手写JNI绑定（易出错）
// - 运行时才发现类型错误
// - 难以维护
```

---

## 总结

本指南深入讲解了React Native的核心原理：

1. **架构演进** - 从Bridge到JSI的质的飞跃
2. **旧架构** - 三线程模型与Bridge通信机制
3. **Bridge详解** - 序列化、异步通信的原理与限制
4. **新架构概述** - JSI + Fabric + TurboModules
5. **JSI** - 直接函数调用、共享内存、零序列化
6. **Fabric** - 同步渲染、优先级调度、C++实现
7. **TurboModules** - 按需加载、类型安全、高性能
8. **Codegen** - 自动生成类型安全的绑定代码

**关键收获：**
- 新架构带来数倍甚至数十倍的性能提升
- JSI移除了Bridge的序列化瓶颈
- Fabric实现了同步、优先级化的渲染
- TurboModules实现按需加载和类型安全
- Codegen大幅提升开发效率和代码质量

**未来趋势：**
- 新架构将成为默认和唯一选择
- 更多原生模块迁移到TurboModule
- 性能持续优化
- 与Web标准更紧密集成
