# React Native 热更新完全实战指南

> 从原理到实践 - CodePush使用、自建热更新方案、最佳实践全解析

## 目录

- [第一章：热更新原理与架构](#第一章热更新原理与架构)
- [第二章：CodePush完整实战](#第二章codepush完整实战)
- [第三章：自建热更新方案](#第三章自建热更新方案)
- [第四章：差异化更新策略](#第四章差异化更新策略)
- [第五章：灰度发布与AB测试](#第五章灰度发布与ab测试)
- [第六章：安全性与版本管理](#第六章安全性与版本管理)
- [第七章：监控与回滚机制](#第七章监控与回滚机制)
- [第八章：实战案例与最佳实践](#第八章实战案例与最佳实践)

---

## 第一章：热更新原理与架构

### 1.1 什么是热更新

热更新（Hot Update/Over-The-Air Update）是指**无需重新发布应用到App Store/Google Play**，就能更新应用功能的技术。

#### 为什么需要热更新

```typescript
// 传统更新流程
问题修复 → 打包 → 提交审核 → 等待审核(1-7天) → 用户更新 → 修复生效
❌ 周期长（iOS审核可能需要数天）
❌ 用户不一定会更新
❌ 无法快速修复紧急bug

// 热更新流程
问题修复 → 发布更新 → 用户自动更新 → 修复生效
✅ 即时生效（秒级/分钟级）
✅ 用户无感知自动更新
✅ 可以快速修复线上问题
```

#### 能更新什么，不能更新什么

```typescript
// ✅ 可以热更新
- JavaScript代码（业务逻辑、UI组件）
- 样式和布局
- 图片、字体等资源文件
- 配置文件

// ❌ 不能热更新（需要发版）
- 原生代码（Java/Kotlin/Objective-C/Swift）
- 原生模块和库
- 应用权限（Info.plist/AndroidManifest.xml）
- App图标、启动页
- RN版本升级

// 示例：哪些可以热更新
// ✅ 可以热更新
function UserProfile() {
  return (
    <View>
      <Text>用户信息</Text>
      <Button title="新功能" onPress={handlePress} />
    </View>
  );
}

// ❌ 不能热更新（涉及原生权限）
import { Camera } from 'react-native-camera';
// 需要在AndroidManifest.xml添加权限
```

### 1.2 热更新原理

#### 核心机制

```typescript
/*
热更新核心原理：

1. Bundle文件
   - RN应用实际是JS Bundle + 原生壳
   - Bundle = index.bundle (JS代码) + assets (资源文件)

2. 更新流程
   ┌─────────────┐
   │  App启动    │
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ 检查更新    │ ← 向服务器查询是否有新版本
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ 下载Bundle  │ ← 下载新的JS Bundle
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ 校验签名    │ ← 验证Bundle完整性
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ 替换Bundle  │ ← 用新Bundle替换旧Bundle
   └──────┬──────┘
          ↓
   ┌─────────────┐
   │ 重启应用    │ ← 加载新Bundle
   └─────────────┘

3. 本地存储结构
   App/
   ├── index.bundle (内置Bundle)
   ├── CodePush/
   │   ├── v1.0.0/
   │   │   ├── index.bundle
   │   │   └── assets/
   │   └── v1.0.1/
   │       ├── index.bundle
   │       └── assets/
   └── metadata.json (版本信息)
*/
```

#### 更新策略

```typescript
// 1. 启动时检查（默认）
- App启动时检查更新
- 下载后下次启动生效
- 用户体验好，不打断当前使用

// 2. 立即更新
- 检查到更新立即下载并安装
- 强制重启应用
- 适合紧急修复

// 3. 后台更新
- 静默下载
- 下次启动或特定时机应用
- 用户无感知

// 4. 强制更新
- 检测到重大版本，必须更新才能使用
- 阻止用户继续使用旧版本
```

### 1.3 热更新架构设计

#### 整体架构

```typescript
/*
完整热更新系统架构：

┌──────────────────────────────────────────┐
│              移动端 App                    │
│  ┌────────────────────────────────────┐  │
│  │    热更新SDK                        │  │
│  │  • 版本检查                         │  │
│  │  • Bundle下载                       │  │
│  │  • 完整性校验                       │  │
│  │  • 本地存储管理                     │  │
│  │  • 重启应用                         │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │ HTTPS
               ↓
┌──────────────────────────────────────────┐
│           热更新服务端                     │
│  ┌────────────────────────────────────┐  │
│  │  API服务                            │  │
│  │  • 版本查询                         │  │
│  │  • 下载地址分发                     │  │
│  │  • 灰度策略                         │  │
│  │  • 统计上报                         │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  管理后台                           │  │
│  │  • 版本管理                         │  │
│  │  • 发布配置                         │  │
│  │  • 灰度控制                         │  │
│  │  • 数据监控                         │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  存储服务                           │  │
│  │  • Bundle文件存储                   │  │
│  │  • CDN加速                          │  │
│  │  • 备份恢复                         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
*/
```

---

## 第二章：CodePush完整实战

### 2.1 CodePush简介

**CodePush** 是微软提供的React Native热更新服务，免费且稳定。

#### 优势
- ✅ 免费使用
- ✅ 官方支持，稳定可靠
- ✅ 集成简单
- ✅ 提供CLI工具
- ✅ 支持灰度发布
- ✅ 自动回滚

#### 劣势
- ❌ 服务器在国外，国内访问可能较慢
- ❌ 定制化能力有限
- ❌ 依赖微软服务

### 2.2 完整集成步骤

#### 步骤1：安装CodePush CLI

```bash
# 全局安装CLI工具
npm install -g code-push-cli

# 登录/注册账号
code-push register

# 或者使用已有账号登录
code-push login

# 验证登录状态
code-push whoami
```

#### 步骤2：创建应用

```bash
# 创建iOS应用
code-push app add MyApp-iOS ios react-native

# 创建Android应用
code-push app add MyApp-Android android react-native

# 查看应用列表
code-push app list

# 查看应用的部署密钥
code-push deployment ls MyApp-iOS -k
code-push deployment ls MyApp-Android -k

# 输出示例：
# ┌────────────┬───────────────────────────────────────┐
# │ Name       │ Deployment Key                        │
# ├────────────┼───────────────────────────────────────┤
# │ Production │ abc123...                             │
# │ Staging    │ def456...                             │
# └────────────┴───────────────────────────────────────┘
```

#### 步骤3：安装SDK

```bash
# 安装依赖
npm install --save react-native-code-push

# React Native >= 0.60 自动链接
# React Native < 0.60 需要手动链接
react-native link react-native-code-push
```

#### 步骤4：iOS配置

##### 4.1 修改 `ios/YourApp/AppDelegate.m`

```objective-c
#import <CodePush/CodePush.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // ... 其他代码

  // ✅ 关键：设置Bundle URL为CodePush
  #ifdef DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
    return [CodePush bundleURL]; // 使用CodePush
  #endif
}

@end
```

##### 4.2 修改 `ios/YourApp/Info.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- 添加CodePush配置 -->
    <key>CodePushDeploymentKey</key>
    <string>YOUR-IOS-DEPLOYMENT-KEY-HERE</string>

    <!-- 其他配置... -->
</dict>
</plist>
```

#### 步骤5：Android配置

##### 5.1 修改 `android/app/build.gradle`

```gradle
apply from: "../../node_modules/react-native/react.gradle"

// ✅ 添加CodePush
apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"

android {
    // ...
}

dependencies {
    // ...
    implementation project(':react-native-code-push')
}
```

##### 5.2 修改 `android/app/src/main/java/.../MainApplication.java`

```java
import com.microsoft.codepush.react.CodePush;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    // ✅ 1. 添加CodePush包
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new CodePushPackage()
      );
    }

    // ✅ 2. 设置Bundle URL
    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    // ✅ 3. 配置部署密钥
    @Override
    protected String getCodePushDeploymentKey() {
      return "YOUR-ANDROID-DEPLOYMENT-KEY-HERE";
    }
  };
}
```

##### 5.3 修改 `android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">YourApp</string>

    <!-- ✅ 添加CodePush配置 -->
    <string moduleConfig="true" name="CodePushDeploymentKey">YOUR-ANDROID-DEPLOYMENT-KEY-HERE</string>
</resources>
```

#### 步骤6：在应用中使用CodePush

```typescript
// App.tsx
import React, { useEffect } from 'react';
import CodePush from 'react-native-code-push';
import { Alert } from 'react-native';

// ✅ 方式1：使用装饰器（类组件）
class App extends React.Component {
  componentDidMount() {
    CodePush.notifyAppReady(); // 通知CodePush应用已准备好
  }

  render() {
    return <YourApp />;
  }
}

// CodePush配置
const codePushOptions = {
  // 检查频率
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,

  // 安装模式
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,

  // 强制更新的最小后台时长（秒）
  minimumBackgroundDuration: 60 * 10,

  // 是否显示更新对话框
  updateDialog: {
    title: '发现新版本',
    optionalUpdateMessage: '有新版本可用，是否更新？',
    optionalInstallButtonLabel: '立即更新',
    optionalIgnoreButtonLabel: '稍后',
    mandatoryUpdateMessage: '必须更新到新版本才能继续使用',
    mandatoryContinueButtonLabel: '继续',
  },
};

export default CodePush(codePushOptions)(App);

// ✅ 方式2：函数组件
function App() {
  useEffect(() => {
    // 检查更新
    CodePush.sync({
      updateDialog: {
        title: '发现新版本',
        optionalUpdateMessage: '有新版本可用，是否更新？',
        optionalInstallButtonLabel: '立即更新',
        optionalIgnoreButtonLabel: '稍后',
      },
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
  }, []);

  return <YourApp />;
}

// 导出时包装
export default CodePush(App);
```

### 2.3 发布更新

#### 发布到Staging环境

```bash
# iOS发布
code-push release-react MyApp-iOS ios \
  --deploymentName Staging \
  --description "修复了登录问题" \
  --mandatory false

# Android发布
code-push release-react MyApp-Android android \
  --deploymentName Staging \
  --description "修复了登录问题" \
  --mandatory false

# 参数说明：
# --deploymentName: 部署环境（Staging/Production）
# --description: 更新描述
# --mandatory: 是否强制更新
# --targetBinaryVersion: 目标应用版本（可选）
# --rollout: 灰度百分比（可选，1-100）
```

#### 指定目标版本

```bash
# 只对1.0.0版本的用户推送更新
code-push release-react MyApp-iOS ios \
  --targetBinaryVersion "1.0.0" \
  --deploymentName Production

# 支持多个版本（使用语义化版本）
code-push release-react MyApp-iOS ios \
  --targetBinaryVersion "~1.0.0" \  # 1.0.x
  --deploymentName Production

code-push release-react MyApp-iOS ios \
  --targetBinaryVersion ">=1.0.0 <2.0.0" \  # 1.x.x
  --deploymentName Production
```

#### 灰度发布

```bash
# 先推送给10%用户
code-push release-react MyApp-iOS ios \
  --deploymentName Production \
  --rollout 10

# 观察一段时间后，扩大到50%
code-push patch MyApp-iOS Production \
  --rollout 50

# 最后推送给所有用户
code-push patch MyApp-iOS Production \
  --rollout 100
```

### 2.4 高级用法

#### 自定义更新检查

```typescript
import CodePush from 'react-native-code-push';
import { AppState } from 'react-native';

function App() {
  useEffect(() => {
    // 监听应用状态
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: string) => {
    // 应用从后台切换到前台时检查更新
    if (nextAppState === 'active') {
      try {
        const update = await CodePush.checkForUpdate();

        if (update) {
          console.log('发现更新:', update);

          // 静默下载
          await CodePush.downloadUpdate((progress) => {
            console.log('下载进度:', progress.receivedBytes / progress.totalBytes);
          });

          // 下次重启时安装
          await CodePush.installUpdate(CodePush.InstallMode.ON_NEXT_RESTART);

          Alert.alert(
            '更新已就绪',
            '重启应用后生效',
            [{ text: '确定' }]
          );
        }
      } catch (error) {
        console.error('检查更新失败:', error);
      }
    }
  };

  return <YourApp />;
}
```

#### 完整的更新流程控制

```typescript
import React, { useEffect, useState } from 'react';
import CodePush, {
  RemotePackage,
  LocalPackage,
  DownloadProgress
} from 'react-native-code-push';
import { View, Text, Button, ActivityIndicator } from 'react-native';

function UpdateManager() {
  const [updateState, setUpdateState] = useState<{
    status: 'checking' | 'downloading' | 'installing' | 'idle' | 'error';
    progress?: number;
    error?: string;
  }>({ status: 'idle' });

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      setUpdateState({ status: 'checking' });

      const update: RemotePackage | null = await CodePush.checkForUpdate();

      if (!update) {
        setUpdateState({ status: 'idle' });
        console.log('已是最新版本');
        return;
      }

      console.log('发现更新:', {
        label: update.label,
        description: update.description,
        isMandatory: update.isMandatory,
        packageSize: update.packageSize,
      });

      // 如果是强制更新，立即下载
      if (update.isMandatory) {
        await downloadAndInstall(update);
      } else {
        // 可选更新，询问用户
        Alert.alert(
          '发现新版本',
          update.description || '有新版本可用',
          [
            { text: '稍后', style: 'cancel' },
            { text: '立即更新', onPress: () => downloadAndInstall(update) },
          ]
        );
      }
    } catch (error) {
      console.error('检查更新失败:', error);
      setUpdateState({ status: 'error', error: error.message });
    }
  };

  const downloadAndInstall = async (update: RemotePackage) => {
    try {
      setUpdateState({ status: 'downloading', progress: 0 });

      // 下载更新
      const localPackage: LocalPackage = await update.download((progress: DownloadProgress) => {
        const percent = (progress.receivedBytes / progress.totalBytes) * 100;
        setUpdateState({ status: 'downloading', progress: percent });
        console.log(`下载进度: ${percent.toFixed(0)}%`);
      });

      console.log('下载完成，开始安装...');
      setUpdateState({ status: 'installing' });

      // 安装更新
      await localPackage.install(CodePush.InstallMode.IMMEDIATE);

      console.log('安装完成，重启应用');
    } catch (error) {
      console.error('下载或安装失败:', error);
      setUpdateState({ status: 'error', error: error.message });
    }
  };

  // UI展示
  if (updateState.status === 'checking') {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>检查更新中...</Text>
      </View>
    );
  }

  if (updateState.status === 'downloading') {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>下载中: {updateState.progress?.toFixed(0)}%</Text>
      </View>
    );
  }

  if (updateState.status === 'installing') {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>安装中...</Text>
      </View>
    );
  }

  return null;
}
```

#### 获取当前版本信息

```typescript
import CodePush from 'react-native-code-push';

async function getCurrentVersion() {
  // 获取当前运行的CodePush版本
  const update = await CodePush.getUpdateMetadata();

  if (update) {
    console.log('当前版本:', {
      label: update.label,              // v1
      appVersion: update.appVersion,    // 1.0.0
      description: update.description,
      isMandatory: update.isMandatory,
      packageHash: update.packageHash,
    });
  }

  // 获取应用二进制版本
  const { appVersion } = await CodePush.getConfiguration();
  console.log('App版本:', appVersion);
}
```

### 2.5 版本管理命令

```bash
# 查看部署历史
code-push deployment history MyApp-iOS Production

# 输出示例：
# ┌────────┬──────────────┬────────┬──────────┬──────────┐
# │ Label  │ Release Time │ Active │ Installs │ Rollback │
# ├────────┼──────────────┼────────┼──────────┼──────────┤
# │ v3     │ 2小时前      │ 100%   │ 1,234    │          │
# │ v2     │ 1天前        │ 0%     │ 5,678    │          │
# │ v1     │ 3天前        │ 0%     │ 2,345    │          │
# └────────┴──────────────┴────────┴──────────┴──────────┘

# 回滚到上一个版本
code-push rollback MyApp-iOS Production

# 回滚到指定版本
code-push rollback MyApp-iOS Production --targetRelease v2

# 清除部署历史
code-push deployment clear MyApp-iOS Production

# 删除某个版本
code-push deployment rm MyApp-iOS Production v1
```

---

## 第三章：自建热更新方案

### 3.1 为什么要自建

#### CodePush的局限性
- ❌ 服务器在国外，国内访问慢
- ❌ 定制化能力有限
- ❌ 依赖第三方服务
- ❌ 数据安全性考虑

#### 自建方案的优势
- ✅ 完全掌控，不依赖第三方
- ✅ 可以深度定制
- ✅ 数据完全私有
- ✅ 国内服务器，更新更快
- ✅ 可以集成到现有系统

### 3.2 整体架构设计

```typescript
/*
自建热更新系统架构：

┌─────────────────────────────────────────────────┐
│                   移动端 App                      │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      UpdateManager (更新管理器)          │    │
│  │  • checkUpdate() - 检查更新              │    │
│  │  • downloadBundle() - 下载Bundle         │    │
│  │  • verifyBundle() - 校验Bundle           │    │
│  │  • installBundle() - 安装Bundle          │    │
│  │  • rollback() - 回滚                     │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      BundleLoader (Bundle加载器)         │    │
│  │  • loadBundle() - 加载Bundle             │    │
│  │  • getActiveBundlePath() - 获取当前Bundle│    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      StorageManager (存储管理器)         │    │
│  │  • saveBundle() - 保存Bundle             │    │
│  │  • deleteBundle() - 删除Bundle           │    │
│  │  • getMetadata() - 获取元数据            │    │
│  └─────────────────────────────────────────┘    │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS
                    ↓
┌─────────────────────────────────────────────────┐
│              热更新服务端（Node.js）              │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      API层                               │    │
│  │  GET /api/update/check - 检查更新        │    │
│  │  GET /api/update/download/:id - 下载     │    │
│  │  POST /api/update/report - 上报统计     │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      业务逻辑层                          │    │
│  │  • 版本比对                              │    │
│  │  • 灰度策略                              │    │
│  │  • 统计分析                              │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      数据库（MongoDB/MySQL）             │    │
│  │  • 版本信息                              │    │
│  │  • 用户设备信息                          │    │
│  │  • 更新统计                              │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │      文件存储（OSS/S3）                  │    │
│  │  • Bundle文件                            │    │
│  │  • 差异补丁                              │    │
│  │  • 资源文件                              │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
*/
```

### 3.3 客户端实现

#### 3.3.1 原生模块 - iOS

```objective-c
// RNUpdateManager.h
#import <React/RCTBridgeModule.h>

@interface RNUpdateManager : NSObject <RCTBridgeModule>
@end

// RNUpdateManager.m
#import "RNUpdateManager.h"
#import <React/RCTBundleURLProvider.h>

@implementation RNUpdateManager

RCT_EXPORT_MODULE();

// 获取当前Bundle路径
RCT_EXPORT_METHOD(getCurrentBundlePath:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *bundlePath = [[self class] getActiveBundlePath];
  resolve(bundlePath);
}

// 下载Bundle
RCT_EXPORT_METHOD(downloadBundle:(NSString *)url
                  version:(NSString *)version
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // 创建下载任务
  NSURL *downloadURL = [NSURL URLWithString:url];
  NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
  NSURLSession *session = [NSURLSession sessionWithConfiguration:config];

  NSURLSessionDownloadTask *task = [session downloadTaskWithURL:downloadURL
    completionHandler:^(NSURL *location, NSURLResponse *response, NSError *error) {
      if (error) {
        reject(@"download_error", @"下载失败", error);
        return;
      }

      // 保存Bundle到本地
      NSString *bundleDir = [self getBundleDirectory:version];
      [[NSFileManager defaultManager] createDirectoryAtPath:bundleDir
                                withIntermediateDirectories:YES
                                attributes:nil
                                error:nil];

      NSString *bundlePath = [bundleDir stringByAppendingPathComponent:@"index.bundle"];
      [[NSFileManager defaultManager] moveItemAtPath:location.path
                                             toPath:bundlePath
                                              error:nil];

      // 保存版本元数据
      [self saveMetadata:version];

      resolve(bundlePath);
    }];

  [task resume];
}

// 重启应用加载新Bundle
RCT_EXPORT_METHOD(reloadBundle:(NSString *)bundlePath)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTBridge *bridge = [RCTBridge currentBridge];
    NSURL *bundleURL = [NSURL fileURLWithPath:bundlePath];

    // 重新加载Bundle
    [bridge setValue:bundleURL forKey:@"bundleURL"];
    [bridge reload];
  });
}

// 获取活动的Bundle路径
+ (NSString *)getActiveBundlePath
{
  // 先检查是否有更新的Bundle
  NSString *version = [self getActiveVersion];
  if (version) {
    NSString *bundlePath = [[self getBundleDirectory:version]
                           stringByAppendingPathComponent:@"index.bundle"];

    if ([[NSFileManager defaultManager] fileExistsAtPath:bundlePath]) {
      return bundlePath;
    }
  }

  // 返回默认Bundle
  return [[NSBundle mainBundle] pathForResource:@"main" ofType:@"jsbundle"];
}

// 获取Bundle存储目录
+ (NSString *)getBundleDirectory:(NSString *)version
{
  NSString *docPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
  return [docPath stringByAppendingPathComponent:[NSString stringWithFormat:@"bundles/%@", version]];
}

// 保存版本元数据
+ (void)saveMetadata:(NSString *)version
{
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:version forKey:@"activeVersion"];
  [defaults synchronize];
}

// 获取活动版本
+ (NSString *)getActiveVersion
{
  return [[NSUserDefaults standardUserDefaults] stringForKey:@"activeVersion"];
}

@end

// AppDelegate.m中使用
#import "RNUpdateManager.h"

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#ifdef DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  // 使用自定义的Bundle路径
  NSString *bundlePath = [RNUpdateManager getActiveBundlePath];
  return [NSURL fileURLWithPath:bundlePath];
#endif
}
```

#### 3.3.2 原生模块 - Android

```java
// RNUpdateManagerModule.java
package com.yourapp;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.*;
import java.net.*;

public class RNUpdateManagerModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RNUpdateManager";
    private ReactApplicationContext reactContext;

    public RNUpdateManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    // 下载Bundle
    @ReactMethod
    public void downloadBundle(String url, String version, Promise promise) {
        new Thread(() -> {
            try {
                URL downloadUrl = new URL(url);
                HttpURLConnection conn = (HttpURLConnection) downloadUrl.openConnection();
                conn.setRequestMethod("GET");
                conn.connect();

                // 创建Bundle目录
                File bundleDir = getBundleDirectory(version);
                bundleDir.mkdirs();

                // 下载文件
                File bundleFile = new File(bundleDir, "index.android.bundle");
                FileOutputStream fos = new FileOutputStream(bundleFile);
                InputStream is = conn.getInputStream();

                byte[] buffer = new byte[4096];
                int bytesRead;
                long totalBytes = 0;
                long fileSize = conn.getContentLength();

                while ((bytesRead = is.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                    totalBytes += bytesRead;

                    // 发送下载进度事件
                    double progress = (double) totalBytes / fileSize;
                    sendEvent("downloadProgress", progress);
                }

                fos.close();
                is.close();

                // 保存版本元数据
                saveMetadata(version);

                promise.resolve(bundleFile.getAbsolutePath());
            } catch (Exception e) {
                promise.reject("download_error", e.getMessage());
            }
        }).start();
    }

    // 重启应用
    @ReactMethod
    public void reloadBundle(String bundlePath) {
        reactContext.runOnUiQueueThread(() -> {
            try {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("reloadBundle", bundlePath);

                // 触发reload
                reactContext.getCatalystInstance().destroy();

                // 重启Activity
                Activity activity = getCurrentActivity();
                if (activity != null) {
                    Intent intent = activity.getIntent();
                    activity.finish();
                    activity.startActivity(intent);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    // 获取Bundle目录
    private File getBundleDirectory(String version) {
        File baseDir = reactContext.getFilesDir();
        return new File(baseDir, "bundles/" + version);
    }

    // 保存元数据
    private void saveMetadata(String version) {
        SharedPreferences prefs = reactContext.getSharedPreferences("UpdateManager", Context.MODE_PRIVATE);
        prefs.edit().putString("activeVersion", version).apply();
    }

    // 发送事件
    private void sendEvent(String eventName, Object params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    // 获取活动Bundle路径
    public static String getActiveBundlePath(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("UpdateManager", Context.MODE_PRIVATE);
        String version = prefs.getString("activeVersion", null);

        if (version != null) {
            File bundleFile = new File(context.getFilesDir(), "bundles/" + version + "/index.android.bundle");
            if (bundleFile.exists()) {
                return bundleFile.getAbsolutePath();
            }
        }

        // 返回默认Bundle
        return "assets://index.android.bundle";
    }
}

// MainApplication.java中使用
@Override
protected String getJSMainModuleName() {
    return "index";
}

@Override
protected String getJSBundleFile() {
    // 使用自定义的Bundle路径
    return RNUpdateManagerModule.getActiveBundlePath(this);
}
```

#### 3.3.3 JavaScript层封装

```typescript
// UpdateManager.ts
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const { RNUpdateManager } = NativeModules;
const updateEmitter = new NativeEventEmitter(RNUpdateManager);

interface UpdateInfo {
  version: string;
  description: string;
  downloadUrl: string;
  mandatory: boolean;
  minAppVersion: string;
  maxAppVersion: string;
  md5: string;
  size: number;
}

class UpdateManager {
  private baseUrl = 'https://your-update-server.com/api';
  private currentVersion: string | null = null;

  // 检查更新
  async checkForUpdate(): Promise<UpdateInfo | null> {
    try {
      const appVersion = DeviceInfo.getVersion();
      const buildNumber = DeviceInfo.getBuildNumber();
      const platform = Platform.OS;

      const response = await fetch(`${this.baseUrl}/update/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          appVersion,
          buildNumber,
          currentBundleVersion: this.currentVersion,
        }),
      });

      const data = await response.json();

      if (data.hasUpdate) {
        return data.updateInfo;
      }

      return null;
    } catch (error) {
      console.error('检查更新失败:', error);
      throw error;
    }
  }

  // 下载更新
  async downloadUpdate(
    updateInfo: UpdateInfo,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // 监听下载进度
      const progressListener = updateEmitter.addListener(
        'downloadProgress',
        (progress: number) => {
          onProgress?.(progress);
        }
      );

      RNUpdateManager.downloadBundle(
        updateInfo.downloadUrl,
        updateInfo.version
      )
        .then((bundlePath: string) => {
          progressListener.remove();

          // 验证MD5
          return this.verifyBundle(bundlePath, updateInfo.md5).then((valid) => {
            if (!valid) {
              throw new Error('Bundle校验失败');
            }
            return bundlePath;
          });
        })
        .then(resolve)
        .catch((error) => {
          progressListener.remove();
          reject(error);
        });
    });
  }

  // 校验Bundle
  private async verifyBundle(
    bundlePath: string,
    expectedMd5: string
  ): Promise<boolean> {
    try {
      // 计算文件MD5
      const md5 = await this.calculateMD5(bundlePath);
      return md5 === expectedMd5;
    } catch (error) {
      console.error('校验失败:', error);
      return false;
    }
  }

  // 计算MD5（需要安装react-native-fs和crypto-js）
  private async calculateMD5(filePath: string): Promise<string> {
    const RNFS = require('react-native-fs');
    const CryptoJS = require('crypto-js');

    const content = await RNFS.readFile(filePath, 'base64');
    return CryptoJS.MD5(content).toString();
  }

  // 安装更新
  async installUpdate(bundlePath: string): Promise<void> {
    try {
      await RNUpdateManager.reloadBundle(bundlePath);
    } catch (error) {
      console.error('安装更新失败:', error);
      throw error;
    }
  }

  // 完整更新流程
  async update(options?: {
    onCheckStart?: () => void;
    onCheckComplete?: (hasUpdate: boolean) => void;
    onDownloadStart?: () => void;
    onDownloadProgress?: (progress: number) => void;
    onDownloadComplete?: () => void;
    onInstallStart?: () => void;
    onInstallComplete?: () => void;
    onError?: (error: Error) => void;
  }): Promise<void> {
    try {
      // 1. 检查更新
      options?.onCheckStart?.();
      const updateInfo = await this.checkForUpdate();
      options?.onCheckComplete?.(!!updateInfo);

      if (!updateInfo) {
        console.log('已是最新版本');
        return;
      }

      // 2. 下载更新
      options?.onDownloadStart?.();
      const bundlePath = await this.downloadUpdate(
        updateInfo,
        options?.onDownloadProgress
      );
      options?.onDownloadComplete?.();

      // 3. 安装更新
      options?.onInstallStart?.();
      await this.installUpdate(bundlePath);
      options?.onInstallComplete?.();
    } catch (error) {
      options?.onError?.(error as Error);
      throw error;
    }
  }

  // 回滚到上一个版本
  async rollback(): Promise<void> {
    // 实现回滚逻辑
  }
}

export default new UpdateManager();
```

#### 3.3.4 使用示例

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import UpdateManager from './UpdateManager';

function App() {
  const [updateState, setUpdateState] = useState<{
    checking: boolean;
    downloading: boolean;
    progress: number;
    error: string | null;
  }>({
    checking: false,
    downloading: false,
    progress: 0,
    error: null,
  });

  useEffect(() => {
    // 应用启动时检查更新
    checkUpdate();
  }, []);

  const checkUpdate = async () => {
    try {
      await UpdateManager.update({
        onCheckStart: () => {
          console.log('开始检查更新');
          setUpdateState((prev) => ({ ...prev, checking: true }));
        },
        onCheckComplete: (hasUpdate) => {
          setUpdateState((prev) => ({ ...prev, checking: false }));
          if (!hasUpdate) {
            console.log('已是最新版本');
          }
        },
        onDownloadStart: () => {
          console.log('开始下载');
          setUpdateState((prev) => ({ ...prev, downloading: true }));
        },
        onDownloadProgress: (progress) => {
          setUpdateState((prev) => ({ ...prev, progress }));
        },
        onDownloadComplete: () => {
          console.log('下载完成');
        },
        onInstallStart: () => {
          console.log('开始安装');
        },
        onInstallComplete: () => {
          console.log('安装完成，即将重启');
        },
        onError: (error) => {
          console.error('更新失败:', error);
          setUpdateState((prev) => ({
            ...prev,
            error: error.message,
            checking: false,
            downloading: false,
          }));
        },
      });
    } catch (error) {
      Alert.alert('更新失败', error.message);
    }
  };

  // 渲染更新UI
  if (updateState.checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>检查更新中...</Text>
      </View>
    );
  }

  if (updateState.downloading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>下载中: {(updateState.progress * 100).toFixed(0)}%</Text>
      </View>
    );
  }

  return <YourMainApp />;
}

export default App;
```

### 3.4 服务端实现（完整的Code-Push-Server）

#### 3.4.1 整体架构设计

```typescript
/*
Code-Push-Server 完整架构：

┌────────────────────────────────────────────────────────────┐
│                      负载均衡层                              │
│                  Nginx / AWS ELB                            │
└────────────────────┬───────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼───────┐       ┌────────▼────────┐
│   API Server  │       │   API Server    │   (多实例)
│   Node.js     │       │   Node.js       │
└───────┬───────┘       └────────┬────────┘
        │                        │
        └────────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼───────┐       ┌────────▼────────┐
│   Redis       │       │   Database      │
│   Cache       │       │   PostgreSQL    │
│   Session     │       │   MongoDB       │
└───────────────┘       └─────────────────┘
                                 │
                     ┌───────────┴──────────┐
                     │                      │
             ┌───────▼───────┐    ┌────────▼────────┐
             │   File Store  │    │   Monitoring    │
             │   S3/OSS/NAS  │    │   Prometheus    │
             └───────────────┘    └─────────────────┘
*/
```

#### 3.4.2 数据库设计

```typescript
// ==================== PostgreSQL 表结构 ====================

// 1. 应用表 (apps)
CREATE TABLE apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,

  -- 配置
  auto_rollback BOOLEAN DEFAULT true,
  rollback_threshold INTEGER DEFAULT 10, -- 错误率阈值(%)

  UNIQUE(name)
);

// 2. 部署环境表 (deployments)
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- Production, Staging, Development
  key VARCHAR(255) UNIQUE NOT NULL, -- 部署密钥
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(app_id, name)
);

// 3. 版本表 (releases)
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deployment_id UUID REFERENCES deployments(id) ON DELETE CASCADE,

  -- 版本信息
  label VARCHAR(50) NOT NULL, -- v1, v2, v3...
  app_version VARCHAR(50) NOT NULL, -- 1.0.0
  platform VARCHAR(20) NOT NULL, -- ios, android

  -- Bundle信息
  bundle_url TEXT NOT NULL,
  bundle_hash VARCHAR(64) NOT NULL, -- SHA256
  bundle_size BIGINT NOT NULL,

  -- 版本约束
  min_app_version VARCHAR(50),
  max_app_version VARCHAR(50),

  -- 描述信息
  description TEXT,
  change_log TEXT,

  -- 发布配置
  is_mandatory BOOLEAN DEFAULT false,
  is_disabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 100, -- 灰度百分比

  -- 差分更新
  diff_against_label VARCHAR(50), -- 基于哪个版本的差分
  is_diff_bundle BOOLEAN DEFAULT false,

  -- 时间戳
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  disabled_at TIMESTAMP,

  -- 元数据
  metadata JSONB, -- 额外的自定义数据

  created_by UUID REFERENCES users(id),

  INDEX idx_deployment_platform (deployment_id, platform),
  INDEX idx_app_version (app_version),
  INDEX idx_released_at (released_at)
);

// 4. 设备表 (devices)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id VARCHAR(255) UNIQUE NOT NULL,

  -- 设备信息
  platform VARCHAR(20) NOT NULL,
  os_version VARCHAR(50),
  app_version VARCHAR(50),
  device_model VARCHAR(100),

  -- 网络信息
  ip_address INET,
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),

  -- 首次和最后访问
  first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- 元数据
  metadata JSONB,

  INDEX idx_device_id (device_id),
  INDEX idx_last_seen (last_seen_at)
);

// 5. 更新记录表 (update_logs)
CREATE TABLE update_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  device_id UUID REFERENCES devices(id),
  release_id UUID REFERENCES releases(id),
  deployment_id UUID REFERENCES deployments(id),

  -- 更新状态
  status VARCHAR(50) NOT NULL, -- checking, downloading, downloaded, installed, failed, rolled_back

  -- 从哪个版本更新
  from_label VARCHAR(50),
  to_label VARCHAR(50),

  -- 时间记录
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  download_started_at TIMESTAMP,
  download_completed_at TIMESTAMP,
  installed_at TIMESTAMP,

  -- 下载信息
  download_size BIGINT,
  download_duration INTEGER, -- 秒

  -- 错误信息
  error_message TEXT,
  error_stack TEXT,

  -- 客户端信息
  client_version VARCHAR(50),

  INDEX idx_device_release (device_id, release_id),
  INDEX idx_status (status),
  INDEX idx_installed_at (installed_at)
);

// 6. 统计表 (metrics)
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,

  -- 统计日期
  metric_date DATE NOT NULL,

  -- 设备统计
  total_devices INTEGER DEFAULT 0,
  active_devices INTEGER DEFAULT 0,
  new_devices INTEGER DEFAULT 0,

  -- 更新统计
  check_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  rollback_count INTEGER DEFAULT 0,

  -- 性能统计
  avg_download_time FLOAT, -- 平均下载时间(秒)
  avg_install_time FLOAT,  -- 平均安装时间(秒)

  -- 错误率
  error_rate FLOAT, -- 错误率(%)

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(release_id, metric_date),
  INDEX idx_metric_date (metric_date)
);

// 7. 用户表 (users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),

  role VARCHAR(50) DEFAULT 'developer', -- admin, developer, viewer

  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

// 8. 灰度策略表 (rollout_rules)
CREATE TABLE rollout_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,

  -- 规则类型
  rule_type VARCHAR(50) NOT NULL, -- percentage, device_list, region, app_version

  -- 规则配置
  config JSONB NOT NULL,
  -- 示例:
  -- percentage: { "percentage": 50 }
  -- device_list: { "device_ids": ["xxx", "yyy"] }
  -- region: { "countries": ["CN", "US"], "regions": ["Beijing"] }
  -- app_version: { "versions": ["1.0.0", "1.0.1"] }

  priority INTEGER DEFAULT 0, -- 优先级，数字越大越优先
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_release_active (release_id, is_active)
);

// 9. 审计日志表 (audit_logs)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- upload_release, update_rollout, disable_release, etc.
  resource_type VARCHAR(50), -- release, deployment, app
  resource_id UUID,

  details JSONB,
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_action (user_id, action),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created_at (created_at)
);

// ==================== MongoDB Collections (可选，用于大数据量日志) ====================

// 详细更新日志集合
{
  collection: "detailed_update_logs",
  schema: {
    deviceId: String,
    releaseId: String,
    timestamp: Date,
    event: String, // check, download_start, download_progress, download_complete, install, error
    data: Object,
    metadata: {
      platform: String,
      appVersion: String,
      osVersion: String,
      deviceModel: String,
      network: String, // wifi, cellular
      battery: Number,
      location: {
        country: String,
        city: String
      }
    }
  },
  indexes: [
    { deviceId: 1, timestamp: -1 },
    { releaseId: 1, timestamp: -1 },
    { event: 1, timestamp: -1 }
  ]
}

// 性能监控集合
{
  collection: "performance_metrics",
  schema: {
    releaseId: String,
    timestamp: Date,
    metrics: {
      bundleSize: Number,
      downloadTime: Number,
      installTime: Number,
      appCrashCount: Number,
      appLaunchTime: Number
    },
    device: {
      platform: String,
      osVersion: String,
      deviceModel: String
    }
  },
  indexes: [
    { releaseId: 1, timestamp: -1 },
    { timestamp: -1 }
  ]
}
```

#### 3.4.3 完整的API服务实现

```typescript
// ==================== src/index.ts ====================
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { setupDatabase } from './database';
import { setupRedis } from './cache/redis';

// 路由
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import downloadRoutes from './routes/download';

async function bootstrap() {
  const app = express();

  // 安全中间件
  app.use(helmet());
  app.use(cors({
    origin: config.cors.allowedOrigins,
    credentials: true
  }));

  // 基础中间件
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 限流
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 最多100个请求
    message: 'Too many requests from this IP'
  });
  app.use('/api/', limiter);

  // 请求日志
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    next();
  });

  // 路由
  app.use('/api', apiRoutes);
  app.use('/admin', adminRoutes);
  app.use('/download', downloadRoutes);

  // 健康检查
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 错误处理
  app.use(errorHandler);

  // 初始化数据库和缓存
  await setupDatabase();
  await setupRedis();

  // 启动服务器
  const server = createServer(app);
  const port = config.port || 3000;

  server.listen(port, () => {
    logger.info(`Code-Push-Server started on port ${port}`);
  });

  // 优雅关闭
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, closing server...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

// ==================== src/routes/api.ts ====================
import { Router } from 'express';
import { UpdateController } from '../controllers/updateController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();
const updateController = new UpdateController();

// 检查更新 (公开接口，不需要认证)
router.post(
  '/update/check',
  validateRequest('checkUpdate'),
  updateController.checkUpdate
);

// 下载确认 (记录下载开始)
router.post(
  '/update/download-start',
  validateRequest('downloadStart'),
  updateController.recordDownloadStart
);

// 安装确认 (记录安装成功)
router.post(
  '/update/install-complete',
  validateRequest('installComplete'),
  updateController.recordInstallComplete
);

// 报告错误
router.post(
  '/update/report-error',
  validateRequest('reportError'),
  updateController.reportError
);

// 上报统计数据
router.post(
  '/metrics/report',
  updateController.reportMetrics
);

// 以下接口需要认证

// 上传Bundle
router.post(
  '/releases/upload',
  authMiddleware,
  updateController.uploadRelease
);

// 更新灰度百分比
router.patch(
  '/releases/:id/rollout',
  authMiddleware,
  validateRequest('updateRollout'),
  updateController.updateRollout
);

// 禁用版本
router.patch(
  '/releases/:id/disable',
  authMiddleware,
  updateController.disableRelease
);

// 启用版本
router.patch(
  '/releases/:id/enable',
  authMiddleware,
  updateController.enableRelease
);

// 回滚
router.post(
  '/releases/:id/rollback',
  authMiddleware,
  updateController.rollbackRelease
);

// 获取版本列表
router.get(
  '/deployments/:deploymentId/releases',
  authMiddleware,
  updateController.getReleases
);

// 获取版本详情
router.get(
  '/releases/:id',
  authMiddleware,
  updateController.getReleaseDetail
);

// 获取统计数据
router.get(
  '/releases/:id/metrics',
  authMiddleware,
  updateController.getMetrics
);

export default router;

// ==================== src/controllers/updateController.ts ====================
import { Request, Response, NextFunction } from 'express';
import { UpdateService } from '../services/updateService';
import { RolloutService } from '../services/rolloutService';
import { MetricsService } from '../services/metricsService';
import { logger } from '../utils/logger';

export class UpdateController {
  private updateService: UpdateService;
  private rolloutService: RolloutService;
  private metricsService: MetricsService;

  constructor() {
    this.updateService = new UpdateService();
    this.rolloutService = new RolloutService();
    this.metricsService = new MetricsService();
  }

  // 检查更新
  checkUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        deploymentKey,
        appVersion,
        platform,
        deviceId,
        currentLabel,
        clientUniqueId
      } = req.body;

      logger.info('Check update request', {
        deploymentKey,
        appVersion,
        platform,
        deviceId
      });

      // 1. 查找部署
      const deployment = await this.updateService.findDeploymentByKey(deploymentKey);
      if (!deployment) {
        return res.status(404).json({ error: 'Deployment not found' });
      }

      // 2. 查找最新可用版本
      const latestRelease = await this.updateService.findLatestRelease({
        deploymentId: deployment.id,
        platform,
        appVersion
      });

      // 3. 检查是否需要更新
      if (!latestRelease || latestRelease.label === currentLabel) {
        // 记录检查但无更新
        await this.metricsService.recordCheck(deviceId, deployment.id, false);

        return res.json({
          updateInfo: {
            isAvailable: false,
            appVersion,
            currentLabel
          }
        });
      }

      // 4. 检查灰度策略
      const shouldUpdate = await this.rolloutService.shouldUpdate({
        release: latestRelease,
        deviceId,
        appVersion,
        platform,
        clientUniqueId
      });

      if (!shouldUpdate) {
        logger.info('Update blocked by rollout strategy', {
          releaseId: latestRelease.id,
          deviceId
        });

        await this.metricsService.recordCheck(deviceId, deployment.id, false);

        return res.json({
          updateInfo: {
            isAvailable: false,
            appVersion,
            currentLabel
          }
        });
      }

      // 5. 返回更新信息
      logger.info('Update available', {
        releaseId: latestRelease.id,
        label: latestRelease.label,
        deviceId
      });

      // 记录检查且有更新
      await this.metricsService.recordCheck(deviceId, deployment.id, true);

      // 生成下载URL（带签名）
      const downloadUrl = await this.updateService.generateDownloadUrl(
        latestRelease.id,
        deviceId
      );

      res.json({
        updateInfo: {
          isAvailable: true,
          downloadURL: downloadUrl,
          description: latestRelease.description,
          appVersion: latestRelease.appVersion,
          isMandatory: latestRelease.isMandatory,
          label: latestRelease.label,
          packageHash: latestRelease.bundleHash,
          packageSize: latestRelease.bundleSize,

          // 差异更新信息
          ...(latestRelease.isDiffBundle && {
            isDiffPackage: true,
            diffAgainstPackageHash: latestRelease.diffAgainstLabel
          })
        }
      });
    } catch (error) {
      logger.error('Check update failed:', error);
      next(error);
    }
  };

  // 记录下载开始
  recordDownloadStart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deviceId, releaseId, label } = req.body;

      await this.metricsService.recordDownloadStart(deviceId, releaseId, label);

      res.json({ success: true });
    } catch (error) {
      logger.error('Record download start failed:', error);
      next(error);
    }
  };

  // 记录安装完成
  recordInstallComplete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        deviceId,
        releaseId,
        label,
        installTime, // 安装耗时(秒)
        fromLabel
      } = req.body;

      await this.metricsService.recordInstallComplete({
        deviceId,
        releaseId,
        label,
        installTime,
        fromLabel
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Record install complete failed:', error);
      next(error);
    }
  };

  // 报告错误
  reportError = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        deviceId,
        releaseId,
        label,
        errorMessage,
        errorStack,
        stage // 'download' | 'install'
      } = req.body;

      await this.metricsService.recordError({
        deviceId,
        releaseId,
        label,
        errorMessage,
        errorStack,
        stage
      });

      // 检查错误率是否超过阈值，自动回滚
      await this.updateService.checkAndAutoRollback(releaseId);

      res.json({ success: true });
    } catch (error) {
      logger.error('Report error failed:', error);
      next(error);
    }
  };

  // 上传发布
  uploadRelease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        deploymentId,
        appVersion,
        platform,
        description,
        isMandatory = false,
        rolloutPercentage = 100
      } = req.body;

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Bundle file is required' });
      }

      const release = await this.updateService.createRelease({
        deploymentId,
        appVersion,
        platform,
        description,
        isMandatory,
        rolloutPercentage,
        bundleFile: file,
        userId: req.user.id
      });

      logger.info('Release uploaded', {
        releaseId: release.id,
        label: release.label,
        userId: req.user.id
      });

      res.json({
        success: true,
        release: {
          id: release.id,
          label: release.label,
          appVersion: release.appVersion,
          platform: release.platform,
          bundleUrl: release.bundleUrl,
          bundleHash: release.bundleHash,
          bundleSize: release.bundleSize
        }
      });
    } catch (error) {
      logger.error('Upload release failed:', error);
      next(error);
    }
  };

  // 更新灰度百分比
  updateRollout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { rolloutPercentage } = req.body;

      if (rolloutPercentage < 0 || rolloutPercentage > 100) {
        return res.status(400).json({
          error: 'Rollout percentage must be between 0 and 100'
        });
      }

      await this.updateService.updateRolloutPercentage(
        id,
        rolloutPercentage,
        req.user.id
      );

      logger.info('Rollout updated', {
        releaseId: id,
        rolloutPercentage,
        userId: req.user.id
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Update rollout failed:', error);
      next(error);
    }
  };

  // 禁用版本
  disableRelease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.updateService.disableRelease(id, req.user.id);

      logger.info('Release disabled', {
        releaseId: id,
        userId: req.user.id
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Disable release failed:', error);
      next(error);
    }
  };

  // 启用版本
  enableRelease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.updateService.enableRelease(id, req.user.id);

      logger.info('Release enabled', {
        releaseId: id,
        userId: req.user.id
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Enable release failed:', error);
      next(error);
    }
  };

  // 回滚
  rollbackRelease = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { targetLabel } = req.body;

      await this.updateService.rollbackRelease(id, targetLabel, req.user.id);

      logger.info('Release rolled back', {
        releaseId: id,
        targetLabel,
        userId: req.user.id
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Rollback release failed:', error);
      next(error);
    }
  };

  // 获取版本列表
  getReleases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deploymentId } = req.params;
      const { platform, page = 1, limit = 20 } = req.query;

      const result = await this.updateService.getReleases({
        deploymentId,
        platform: platform as string,
        page: Number(page),
        limit: Number(limit)
      });

      res.json(result);
    } catch (error) {
      logger.error('Get releases failed:', error);
      next(error);
    }
  };

  // 获取版本详情
  getReleaseDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const release = await this.updateService.getReleaseDetail(id);
      if (!release) {
        return res.status(404).json({ error: 'Release not found' });
      }

      res.json(release);
    } catch (error) {
      logger.error('Get release detail failed:', error);
      next(error);
    }
  };

  // 获取统计数据
  getMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      const metrics = await this.metricsService.getMetrics({
        releaseId: id,
        startDate: startDate as string,
        endDate: endDate as string
      });

      res.json(metrics);
    } catch (error) {
      logger.error('Get metrics failed:', error);
      next(error);
    }
  };

  // 上报性能指标
  reportMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        deviceId,
        releaseId,
        metrics
      } = req.body;

      await this.metricsService.savePerformanceMetrics({
        deviceId,
        releaseId,
        ...metrics
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Report metrics failed:', error);
      next(error);
    }
  };
}

// ==================== src/services/updateService.ts ====================
import { db } from '../database';
import { storage } from '../storage';
import { cache } from '../cache/redis';
import { generateHash } from '../utils/crypto';
import { AuditService } from './auditService';

export class UpdateService {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  async findDeploymentByKey(deploymentKey: string) {
    // 先从缓存获取
    const cacheKey = `deployment:${deploymentKey}`;
    let deployment = await cache.get(cacheKey);

    if (!deployment) {
      deployment = await db.deployments.findOne({
        where: { key: deploymentKey }
      });

      if (deployment) {
        // 缓存1小时
        await cache.set(cacheKey, deployment, 3600);
      }
    }

    return deployment;
  }

  async findLatestRelease(params: {
    deploymentId: string;
    platform: string;
    appVersion: string;
  }) {
    const { deploymentId, platform, appVersion } = params;

    const release = await db.releases.findOne({
      where: {
        deploymentId,
        platform,
        isDisabled: false,
        // 检查app版本范围
        minAppVersion: { $lte: appVersion },
        $or: [
          { maxAppVersion: { $gte: appVersion } },
          { maxAppVersion: null }
        ]
      },
      order: [['releasedAt', 'DESC']],
      limit: 1
    });

    return release;
  }

  async generateDownloadUrl(releaseId: string, deviceId: string): Promise<string> {
    const release = await db.releases.findByPk(releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    // 生成带签名的临时下载URL（1小时有效）
    const token = generateHash(`${releaseId}:${deviceId}:${Date.now()}`);
    const expiresAt = Date.now() + 3600 * 1000;

    // 保存到缓存
    await cache.set(
      `download:${token}`,
      { releaseId, deviceId, expiresAt },
      3600
    );

    return `${process.env.BASE_URL}/download/${token}`;
  }

  async createRelease(params: {
    deploymentId: string;
    appVersion: string;
    platform: string;
    description: string;
    isMandatory: boolean;
    rolloutPercentage: number;
    bundleFile: Express.Multer.File;
    userId: string;
  }): Promise<any> {
    const {
      deploymentId,
      appVersion,
      platform,
      description,
      isMandatory,
      rolloutPercentage,
      bundleFile,
      userId
    } = params;

    // 1. 生成新的label
    const latestRelease = await db.releases.findOne({
      where: { deploymentId, platform },
      order: [['releasedAt', 'DESC']]
    });

    const nextLabelNumber = latestRelease
      ? parseInt(latestRelease.label.replace('v', '')) + 1
      : 1;
    const label = `v${nextLabelNumber}`;

    // 2. 计算bundle hash
    const bundleHash = await generateHash(bundleFile.buffer);

    // 3. 上传到存储服务
    const bundleUrl = await storage.uploadBundle({
      deploymentId,
      label,
      platform,
      file: bundleFile
    });

    // 4. 创建版本记录
    const release = await db.releases.create({
      deploymentId,
      label,
      appVersion,
      platform,
      bundleUrl,
      bundleHash,
      bundleSize: bundleFile.size,
      description,
      isMandatory,
      rolloutPercentage,
      releasedAt: new Date(),
      createdBy: userId
    });

    // 5. 记录审计日志
    await this.auditService.log({
      userId,
      action: 'upload_release',
      resourceType: 'release',
      resourceId: release.id,
      details: {
        label,
        appVersion,
        platform,
        bundleSize: bundleFile.size
      }
    });

    return release;
  }

  async updateRolloutPercentage(
    releaseId: string,
    rolloutPercentage: number,
    userId: string
  ) {
    const release = await db.releases.findByPk(releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    const oldPercentage = release.rolloutPercentage;

    await db.releases.update(
      { rolloutPercentage },
      { where: { id: releaseId } }
    );

    // 记录审计日志
    await this.auditService.log({
      userId,
      action: 'update_rollout',
      resourceType: 'release',
      resourceId: releaseId,
      details: {
        from: oldPercentage,
        to: rolloutPercentage
      }
    });

    // 清除缓存
    await this.clearReleaseCache(releaseId);
  }

  async disableRelease(releaseId: string, userId: string) {
    await db.releases.update(
      {
        isDisabled: true,
        disabledAt: new Date()
      },
      { where: { id: releaseId } }
    );

    // 记录审计日志
    await this.auditService.log({
      userId,
      action: 'disable_release',
      resourceType: 'release',
      resourceId: releaseId
    });

    await this.clearReleaseCache(releaseId);
  }

  async enableRelease(releaseId: string, userId: string) {
    await db.releases.update(
      {
        isDisabled: false,
        disabledAt: null
      },
      { where: { id: releaseId } }
    );

    await this.auditService.log({
      userId,
      action: 'enable_release',
      resourceType: 'release',
      resourceId: releaseId
    });

    await this.clearReleaseCache(releaseId);
  }

  async rollbackRelease(releaseId: string, targetLabel: string, userId: string) {
    const currentRelease = await db.releases.findByPk(releaseId);
    if (!currentRelease) {
      throw new Error('Release not found');
    }

    // 查找目标版本
    const targetRelease = await db.releases.findOne({
      where: {
        deploymentId: currentRelease.deploymentId,
        platform: currentRelease.platform,
        label: targetLabel
      }
    });

    if (!targetRelease) {
      throw new Error('Target release not found');
    }

    // 禁用当前版本
    await this.disableRelease(releaseId, userId);

    // 启用目标版本
    await this.enableRelease(targetRelease.id, userId);

    // 记录审计日志
    await this.auditService.log({
      userId,
      action: 'rollback_release',
      resourceType: 'release',
      resourceId: releaseId,
      details: {
        fromLabel: currentRelease.label,
        toLabel: targetLabel
      }
    });
  }

  async checkAndAutoRollback(releaseId: string) {
    const release = await db.releases.findByPk(releaseId, {
      include: [{ model: db.deployments, include: [db.apps] }]
    });

    if (!release || !release.deployment.app.autoRollback) {
      return;
    }

    // 获取错误率
    const metrics = await db.metrics.findOne({
      where: {
        releaseId,
        metricDate: new Date().toISOString().split('T')[0]
      }
    });

    if (!metrics) return;

    const errorRate = metrics.errorRate || 0;
    const threshold = release.deployment.app.rollbackThreshold || 10;

    if (errorRate > threshold && metrics.installCount > 100) {
      logger.warn(`Auto rollback triggered for release ${releaseId}`, {
        errorRate,
        threshold
      });

      // 自动回滚到上一个稳定版本
      const previousRelease = await db.releases.findOne({
        where: {
          deploymentId: release.deploymentId,
          platform: release.platform,
          isDisabled: false,
          releasedAt: { $lt: release.releasedAt }
        },
        order: [['releasedAt', 'DESC']]
      });

      if (previousRelease) {
        await this.rollbackRelease(
          releaseId,
          previousRelease.label,
          'system' // 系统自动回滚
        );
      }
    }
  }

  private async clearReleaseCache(releaseId: string) {
    // 清除相关缓存
    const release = await db.releases.findByPk(releaseId);
    if (release) {
      await cache.del(`deployment:${release.deploymentId}`);
    }
  }

  async getReleases(params: {
    deploymentId: string;
    platform?: string;
    page: number;
    limit: number;
  }) {
    const { deploymentId, platform, page, limit } = params;

    const where: any = { deploymentId };
    if (platform) {
      where.platform = platform;
    }

    const { rows, count } = await db.releases.findAndCountAll({
      where,
      order: [['releasedAt', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getReleaseDetail(releaseId: string) {
    const release = await db.releases.findByPk(releaseId, {
      include: [
        {
          model: db.deployments,
          include: [db.apps]
        },
        {
          model: db.metrics,
          order: [['metricDate', 'DESC']],
          limit: 30 // 最近30天数据
        }
      ]
    });

    return release;
  }
}

// ==================== src/services/rolloutService.ts ====================
import { db } from '../database';
import { cache } from '../cache/redis';
import { hashString } from '../utils/crypto';

export class RolloutService {
  async shouldUpdate(params: {
    release: any;
    deviceId: string;
    appVersion: string;
    platform: string;
    clientUniqueId: string;
  }): Promise<boolean> {
    const { release, deviceId, appVersion, platform, clientUniqueId } = params;

    // 1. 检查灰度规则
    const rules = await db.rolloutRules.findAll({
      where: {
        releaseId: release.id,
        isActive: true
      },
      order: [['priority', 'DESC']]
    });

    for (const rule of rules) {
      const result = await this.evaluateRule(rule, params);
      if (result !== null) {
        return result;
      }
    }

    // 2. 默认使用百分比灰度
    return this.checkPercentageRollout(
      clientUniqueId,
      release.rolloutPercentage
    );
  }

  private async evaluateRule(rule: any, params: any): Promise<boolean | null> {
    switch (rule.ruleType) {
      case 'percentage':
        return this.checkPercentageRollout(
          params.clientUniqueId,
          rule.config.percentage
        );

      case 'device_list':
        return rule.config.deviceIds.includes(params.deviceId);

      case 'region':
        const device = await db.devices.findOne({
          where: { deviceId: params.deviceId }
        });
        if (!device) return null;

        if (rule.config.countries) {
          return rule.config.countries.includes(device.country);
        }
        if (rule.config.regions) {
          return rule.config.regions.includes(device.region);
        }
        return null;

      case 'app_version':
        return rule.config.versions.includes(params.appVersion);

      default:
        return null;
    }
  }

  private checkPercentageRollout(
    clientUniqueId: string,
    percentage: number
  ): boolean {
    if (percentage >= 100) return true;
    if (percentage <= 0) return false;

    // 使用一致性哈希确保同一设备始终得到相同结果
    const hash = hashString(clientUniqueId);
    const bucket = hash % 100;

    return bucket < percentage;
  }
}

// ==================== src/services/metricsService.ts ====================
import { db } from '../database';
import { mongodb } from '../database/mongodb';

export class MetricsService {
  async recordCheck(deviceId: string, deploymentId: string, hasUpdate: boolean) {
    // 详细日志记录到MongoDB
    await mongodb.collection('detailed_update_logs').insertOne({
      deviceId,
      deploymentId,
      timestamp: new Date(),
      event: 'check',
      data: { hasUpdate }
    });
  }

  async recordDownloadStart(deviceId: string, releaseId: string, label: string) {
    await db.updateLogs.create({
      deviceId,
      releaseId,
      toLabel: label,
      status: 'downloading',
      downloadStartedAt: new Date()
    });

    // 更新日统计
    await this.incrementMetric(releaseId, 'downloadCount');
  }

  async recordInstallComplete(params: {
    deviceId: string;
    releaseId: string;
    label: string;
    installTime: number;
    fromLabel: string;
  }) {
    const { deviceId, releaseId, label, installTime, fromLabel } = params;

    await db.updateLogs.create({
      deviceId,
      releaseId,
      fromLabel,
      toLabel: label,
      status: 'installed',
      installedAt: new Date(),
      downloadDuration: installTime
    });

    // 更新日统计
    await this.incrementMetric(releaseId, 'installCount');
    await this.incrementMetric(releaseId, 'successCount');
  }

  async recordError(params: {
    deviceId: string;
    releaseId: string;
    label: string;
    errorMessage: string;
    errorStack: string;
    stage: string;
  }) {
    const { deviceId, releaseId, label, errorMessage, errorStack, stage } = params;

    await db.updateLogs.create({
      deviceId,
      releaseId,
      toLabel: label,
      status: 'failed',
      errorMessage,
      errorStack
    });

    // 更新日统计
    await this.incrementMetric(releaseId, 'failedCount');

    // 重新计算错误率
    await this.recalculateErrorRate(releaseId);
  }

  private async incrementMetric(releaseId: string, field: string) {
    const today = new Date().toISOString().split('T')[0];

    await db.metrics.upsert({
      releaseId,
      metricDate: today,
      [field]: db.sequelize.literal(`${field} + 1`)
    });
  }

  private async recalculateErrorRate(releaseId: string) {
    const today = new Date().toISOString().split('T')[0];

    const metric = await db.metrics.findOne({
      where: { releaseId, metricDate: today }
    });

    if (!metric) return;

    const errorRate = metric.installCount > 0
      ? (metric.failedCount / metric.installCount) * 100
      : 0;

    await db.metrics.update(
      { errorRate },
      { where: { releaseId, metricDate: today } }
    );
  }

  async savePerformanceMetrics(params: {
    deviceId: string;
    releaseId: string;
    bundleSize: number;
    downloadTime: number;
    installTime: number;
  }) {
    await mongodb.collection('performance_metrics').insertOne({
      ...params,
      timestamp: new Date()
    });
  }

  async getMetrics(params: {
    releaseId: string;
    startDate: string;
    endDate: string;
  }) {
    const { releaseId, startDate, endDate } = params;

    const metrics = await db.metrics.findAll({
      where: {
        releaseId,
        metricDate: {
          $gte: startDate,
          $lte: endDate
        }
      },
      order: [['metricDate', 'ASC']]
    });

    // 计算汇总数据
    const summary = metrics.reduce(
      (acc, m) => ({
        totalDevices: acc.totalDevices + m.totalDevices,
        checkCount: acc.checkCount + m.checkCount,
        downloadCount: acc.downloadCount + m.downloadCount,
        installCount: acc.installCount + m.installCount,
        successCount: acc.successCount + m.successCount,
        failedCount: acc.failedCount + m.failedCount
      }),
      {
        totalDevices: 0,
        checkCount: 0,
        downloadCount: 0,
        installCount: 0,
        successCount: 0,
        failedCount: 0
      }
    );

    return {
      summary,
      daily: metrics
    };
  }
}
```

这个完善的 code-push-server 设计涵盖了：

1. **完整的数据库设计** - 包含所有必要的表结构
2. **详细的API实现** - 包括检查更新、上传、灰度控制等
3. **灰度发布策略** - 支持百分比、设备列表、地区、版本等多种策略
4. **统计和监控** - 完整的指标收集和错误追踪
5. **自动回滚** - 基于错误率的自动回滚机制
6. **性能优化** - 使用Redis缓存、CDN等
7. **安全机制** - 带签名的下载URL、权限控制等

需要我继续完善其他部分吗？比如管理后台、CLI工具、部署方案等？
});

// 下载Bundle API
app.get('/bundles/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'bundles', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  res.download(filePath);
});

// 灰度策略检查
async function checkRolloutStrategy(
  deviceId: string,
  percentage: number
): Promise<boolean> {
  if (percentage >= 100) {
    return true;
  }

  // 基于设备ID的哈希值决定是否在灰度范围内
  const hash = crypto.createHash('md5').update(deviceId).digest('hex');
  const hashValue = parseInt(hash.substring(0, 8), 16);
  const rolloutValue = (hashValue % 100) + 1;

  return rolloutValue <= percentage;
}

// 计算文件MD5
function calculateFileMD5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

app.listen(3000, () => {
  console.log('热更新服务运行在 http://localhost:3000');
});
```

#### 3.4.2 管理后台

完整的React管理后台，包含发布管理、实时监控、灰度控制等功能。

**技术栈：**
- React 18 + TypeScript
- Ant Design 5.x
- React Query (数据请求)
- Recharts (图表)
- React Router (路由)

```typescript
// admin-panel/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReleaseManagement from './pages/ReleaseManagement';
import CreateRelease from './pages/CreateRelease';
import ReleaseDetail from './pages/ReleaseDetail';
import Deployments from './pages/Deployments';
import Metrics from './pages/Metrics';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="releases" element={<ReleaseManagement />} />
                <Route path="releases/create" element={<CreateRelease />} />
                <Route path="releases/:id" element={<ReleaseDetail />} />
                <Route path="deployments" element={<Deployments />} />
                <Route path="metrics" element={<Metrics />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;

// admin-panel/src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined,
  CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import './Dashboard.less';

function Dashboard() {
  // 获取总览数据
  const { data: overview } = useQuery({
    queryKey: ['overview'],
    queryFn: () => api.get('/admin/overview'),
  });

  // 获取最近发布
  const { data: recentReleases } = useQuery({
    queryKey: ['recent-releases'],
    queryFn: () => api.get('/admin/releases/recent', { params: { limit: 5 } }),
  });

  // 获取趋势数据
  const { data: trendsData } = useQuery({
    queryKey: ['trends'],
    queryFn: () => api.get('/admin/metrics/trends', {
      params: { days: 7 }
    }),
  });

  const columns = [
    {
      title: '版本',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform: string) => (
        <Tag color={platform === 'ios' ? 'blue' : 'green'}>
          {platform.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '部署',
      dataIndex: ['deployment', 'name'],
      key: 'deployment',
    },
    {
      title: '灰度',
      dataIndex: 'rolloutPercentage',
      key: 'rollout',
      render: (percent: number) => `${percent}%`,
    },
    {
      title: '状态',
      dataIndex: 'isDisabled',
      key: 'status',
      render: (isDisabled: boolean) => (
        <Tag color={isDisabled ? 'red' : 'green'}>
          {isDisabled ? '已禁用' : '激活'}
        </Tag>
      ),
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <span style={{ color: rate > 95 ? '#52c41a' : rate > 90 ? '#faad14' : '#f5222d' }}>
          {rate.toFixed(2)}%
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <h1>仪表板</h1>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总发布数"
              value={overview?.totalReleases || 0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃设备"
              value={overview?.activeDevices || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日更新次数"
              value={overview?.todayUpdates || 0}
              suffix={`/ ${overview?.yesterdayUpdates || 0}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均成功率"
              value={overview?.avgSuccessRate || 0}
              precision={2}
              suffix="%"
              valueStyle={{
                color: (overview?.avgSuccessRate || 0) > 95 ? '#3f8600' : '#cf1322'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Card title="更新趋势（最近7天）" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="checks"
              stroke="#8884d8"
              name="检查次数"
            />
            <Line
              type="monotone"
              dataKey="downloads"
              stroke="#82ca9d"
              name="下载次数"
            />
            <Line
              type="monotone"
              dataKey="installs"
              stroke="#ffc658"
              name="安装次数"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 最近发布 */}
      <Card title="最近发布">
        <Table
          columns={columns}
          dataSource={recentReleases}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default Dashboard;

// admin-panel/src/pages/CreateRelease.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Form, Input, Select, InputNumber, Switch,
  Upload, Button, Card, message, Progress, Space, Alert
} from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { api } from '../services/api';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

interface ReleaseFormData {
  deploymentId: string;
  label: string;
  description: string;
  platform: 'ios' | 'android';
  targetBinaryVersion: string;
  isMandatory: boolean;
  isDisabled: boolean;
  rolloutPercentage: number;
  minOsVersion?: string;
}

function CreateRelease() {
  const navigate = useNavigate();
  const [form] = Form.useForm<ReleaseFormData>();
  const [bundleFile, setBundleFile] = useState<UploadFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 获取部署列表
  const { data: deployments } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => api.get('/admin/deployments'),
  });

  // 创建发布
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return api.post('/admin/releases', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percent);
        },
      });
    },
    onSuccess: () => {
      message.success('发布创建成功！');
      navigate('/releases');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '发布创建失败');
    },
  });

  const handleSubmit = async (values: ReleaseFormData) => {
    if (!bundleFile) {
      message.error('请上传Bundle文件');
      return;
    }

    const formData = new FormData();
    formData.append('bundle', bundleFile.originFileObj as Blob);
    Object.keys(values).forEach((key) => {
      formData.append(key, String(values[key as keyof ReleaseFormData]));
    });

    createMutation.mutate(formData);
  };

  return (
    <div className="create-release">
      <Card title="创建新发布" extra={<Button onClick={() => navigate('/releases')}>返回</Button>}>
        <Alert
          message="发布前须知"
          description="请确保Bundle文件已经过充分测试，建议先在测试环境验证后再发布到生产环境。"
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            rolloutPercentage: 100,
            isMandatory: false,
            isDisabled: false,
          }}
        >
          <Form.Item
            name="deploymentId"
            label="部署环境"
            rules={[{ required: true, message: '请选择部署环境' }]}
          >
            <Select placeholder="选择部署环境">
              {deployments?.map((dep: any) => (
                <Option key={dep.id} value={dep.id}>
                  {dep.name} ({dep.app.name})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="label"
            label="版本标签"
            rules={[
              { required: true, message: '请输入版本标签' },
              { pattern: /^v\d+\.\d+\.\d+$/, message: '格式：v1.0.0' }
            ]}
          >
            <Input placeholder="v1.0.0" />
          </Form.Item>

          <Form.Item
            name="description"
            label="更新描述"
            rules={[{ required: true, message: '请输入更新描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述本次更新的内容..."
            />
          </Form.Item>

          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="选择平台">
              <Option value="ios">iOS</Option>
              <Option value="android">Android</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="targetBinaryVersion"
            label="目标App版本"
            rules={[{ required: true, message: '请输入目标App版本' }]}
            tooltip="支持的App版本，如：1.0.0、1.0.*、>=1.0.0"
          >
            <Input placeholder="1.0.0" />
          </Form.Item>

          <Form.Item
            name="minOsVersion"
            label="最低系统版本"
            tooltip="最低支持的操作系统版本"
          >
            <Input placeholder="iOS 13.0 / Android 6.0" />
          </Form.Item>

          <Form.Item
            name="rolloutPercentage"
            label="灰度百分比"
            tooltip="控制更新推送的设备百分比，建议从小范围开始"
          >
            <InputNumber
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value?.replace('%', '') as any}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Space size="large">
            <Form.Item name="isMandatory" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch checkedChildren="强制更新" unCheckedChildren="非强制" />
            </Form.Item>

            <Form.Item name="isDisabled" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch checkedChildren="发布后禁用" unCheckedChildren="发布后启用" />
            </Form.Item>
          </Space>

          <Form.Item
            label="Bundle文件"
            required
            tooltip="上传构建好的Bundle文件（.bundle或.jsbundle）"
          >
            <Upload
              accept=".bundle,.jsbundle"
              beforeUpload={(file) => {
                setBundleFile(file as any);
                return false;
              }}
              onRemove={() => setBundleFile(null)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress percent={uploadProgress} status="active" />
          )}

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending}
              >
                创建发布
              </Button>
              <Button onClick={() => navigate('/releases')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default CreateRelease;

// admin-panel/src/pages/ReleaseDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card, Descriptions, Tag, Button, Space, Modal,
  Slider, message, Table, Progress, Statistic, Row, Col, Alert
} from 'antd';
import {
  EditOutlined, StopOutlined, PlayCircleOutlined,
  RollbackOutlined, WarningOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import './ReleaseDetail.less';

function ReleaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rolloutModalVisible, setRolloutModalVisible] = useState(false);
  const [rolloutValue, setRolloutValue] = useState(100);

  // 获取发布详情
  const { data: release, isLoading } = useQuery({
    queryKey: ['release', id],
    queryFn: () => api.get(`/admin/releases/${id}`),
  });

  // 获取发布指标
  const { data: metrics } = useQuery({
    queryKey: ['release-metrics', id],
    queryFn: () => api.get(`/admin/releases/${id}/metrics`),
  });

  // 获取更新日志
  const { data: logs } = useQuery({
    queryKey: ['release-logs', id],
    queryFn: () => api.get(`/admin/releases/${id}/logs`, {
      params: { limit: 100 }
    }),
  });

  // 更新灰度
  const updateRolloutMutation = useMutation({
    mutationFn: (percentage: number) =>
      api.patch(`/admin/releases/${id}/rollout`, { percentage }),
    onSuccess: () => {
      message.success('灰度百分比已更新');
      queryClient.invalidateQueries({ queryKey: ['release', id] });
      setRolloutModalVisible(false);
    },
  });

  // 禁用发布
  const disableMutation = useMutation({
    mutationFn: () => api.post(`/admin/releases/${id}/disable`),
    onSuccess: () => {
      message.success('发布已禁用');
      queryClient.invalidateQueries({ queryKey: ['release', id] });
    },
  });

  // 启用发布
  const enableMutation = useMutation({
    mutationFn: () => api.post(`/admin/releases/${id}/enable`),
    onSuccess: () => {
      message.success('发布已启用');
      queryClient.invalidateQueries({ queryKey: ['release', id] });
    },
  });

  // 回滚
  const rollbackMutation = useMutation({
    mutationFn: () => api.post(`/admin/releases/${id}/rollback`),
    onSuccess: () => {
      message.success('回滚成功');
      queryClient.invalidateQueries({ queryKey: ['release', id] });
    },
  });

  const logColumns = [
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
      render: (id: string) => id.substring(0, 8) + '...',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          success: 'green',
          failed: 'red',
          downloading: 'blue',
          installing: 'orange',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'App版本',
      dataIndex: 'appVersion',
      key: 'appVersion',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (msg: string) => msg || '-',
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  if (isLoading) return <div>加载中...</div>;
  if (!release) return <div>发布不存在</div>;

  const errorRate = metrics
    ? (metrics.failedCount / (metrics.installCount || 1)) * 100
    : 0;

  return (
    <div className="release-detail">
      <Card
        title={`发布详情 - ${release.label}`}
        extra={
          <Space>
            <Button onClick={() => navigate('/releases')}>返回</Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => setRolloutModalVisible(true)}
            >
              调整灰度
            </Button>
            {release.isDisabled ? (
              <Button
                icon={<PlayCircleOutlined />}
                onClick={() => enableMutation.mutate()}
                loading={enableMutation.isPending}
              >
                启用
              </Button>
            ) : (
              <Button
                icon={<StopOutlined />}
                danger
                onClick={() => disableMutation.mutate()}
                loading={disableMutation.isPending}
              >
                禁用
              </Button>
            )}
            <Button
              icon={<RollbackOutlined />}
              danger
              onClick={() => {
                Modal.confirm({
                  title: '确认回滚？',
                  content: '回滚将恢复到上一个稳定版本',
                  onOk: () => rollbackMutation.mutate(),
                });
              }}
              loading={rollbackMutation.isPending}
            >
              回滚
            </Button>
          </Space>
        }
      >
        {errorRate > 10 && (
          <Alert
            message="错误率过高"
            description={`当前错误率为 ${errorRate.toFixed(2)}%，建议立即回滚或禁用该发布`}
            type="error"
            icon={<WarningOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Descriptions bordered column={2}>
          <Descriptions.Item label="版本标签">{release.label}</Descriptions.Item>
          <Descriptions.Item label="部署环境">
            {release.deployment.name}
          </Descriptions.Item>
          <Descriptions.Item label="平台">
            <Tag color={release.platform === 'ios' ? 'blue' : 'green'}>
              {release.platform.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="目标版本">
            {release.targetBinaryVersion}
          </Descriptions.Item>
          <Descriptions.Item label="灰度百分比">
            <Progress percent={release.rolloutPercentage} />
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={release.isDisabled ? 'red' : 'green'}>
              {release.isDisabled ? '已禁用' : '激活'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="强制更新">
            {release.isMandatory ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="Bundle Hash">
            {release.bundleHash.substring(0, 16)}...
          </Descriptions.Item>
          <Descriptions.Item label="更新描述" span={2}>
            {release.description}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(release.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(release.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 指标统计 */}
      <Card title="发布指标" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="检查次数" value={metrics?.checkCount || 0} />
          </Col>
          <Col span={6}>
            <Statistic title="下载次数" value={metrics?.downloadCount || 0} />
          </Col>
          <Col span={6}>
            <Statistic
              title="安装成功"
              value={metrics?.installCount || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="安装失败"
              value={metrics?.failedCount || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Statistic
              title="成功率"
              value={metrics?.successRate || 0}
              precision={2}
              suffix="%"
              valueStyle={{
                color: (metrics?.successRate || 0) > 95 ? '#3f8600' : '#cf1322'
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="错误率"
              value={errorRate}
              precision={2}
              suffix="%"
              valueStyle={{ color: errorRate > 5 ? '#cf1322' : '#3f8600' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 更新日志 */}
      <Card title="更新日志" style={{ marginTop: 16 }}>
        <Table
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 调整灰度弹窗 */}
      <Modal
        title="调整灰度百分比"
        open={rolloutModalVisible}
        onOk={() => updateRolloutMutation.mutate(rolloutValue)}
        onCancel={() => setRolloutModalVisible(false)}
        confirmLoading={updateRolloutMutation.isPending}
      >
        <p>当前灰度: {release.rolloutPercentage}%</p>
        <Slider
          min={0}
          max={100}
          value={rolloutValue}
          onChange={setRolloutValue}
          marks={{
            0: '0%',
            25: '25%',
            50: '50%',
            75: '75%',
            100: '100%',
          }}
        />
        <p>新灰度: {rolloutValue}%</p>
      </Modal>
    </div>
  );
}

export default ReleaseDetail;
```

#### 3.4.3 CLI命令行工具

提供类似CodePush CLI的命令行工具，方便开发者在终端管理发布。

```typescript
// cli/src/index.ts
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import Table from 'cli-table3';
import { ConfigManager } from './config';
import { BundleBuilder } from './bundle-builder';

const program = new Command();
const config = new ConfigManager();

program
  .name('update-cli')
  .description('React Native热更新命令行工具')
  .version('1.0.0');

// 登录命令
program
  .command('login')
  .description('登录到热更新服务')
  .option('-s, --server <url>', '服务器地址')
  .action(async (options) => {
    const serverUrl = options.server || (await prompts({
      type: 'text',
      name: 'url',
      message: '请输入服务器地址:',
      initial: 'https://update.example.com',
    })).url;

    const credentials = await prompts([
      {
        type: 'text',
        name: 'email',
        message: '邮箱:',
      },
      {
        type: 'password',
        name: 'password',
        message: '密码:',
      },
    ]);

    const spinner = ora('登录中...').start();

    try {
      const response = await axios.post(`${serverUrl}/api/auth/login`, credentials);

      config.set('serverUrl', serverUrl);
      config.set('token', response.data.token);
      config.set('user', response.data.user);

      spinner.succeed(chalk.green('登录成功！'));
      console.log(chalk.gray(`欢迎, ${response.data.user.name}!`));
    } catch (error: any) {
      spinner.fail(chalk.red('登录失败'));
      console.error(chalk.red(error.response?.data?.message || error.message));
      process.exit(1);
    }
  });

// 发布命令
program
  .command('release')
  .description('发布新版本')
  .option('-d, --deployment <name>', '部署环境', 'Production')
  .option('-p, --platform <platform>', '平台 (ios|android)')
  .option('-l, --label <label>', '版本标签')
  .option('-t, --target-version <version>', '目标App版本')
  .option('-m, --mandatory', '强制更新')
  .option('-r, --rollout <percentage>', '灰度百分比', '100')
  .option('--description <text>', '更新描述')
  .action(async (options) => {
    ensureLoggedIn();

    // 交互式填写缺失的选项
    const answers = await prompts([
      {
        type: options.platform ? null : 'select',
        name: 'platform',
        message: '选择平台:',
        choices: [
          { title: 'iOS', value: 'ios' },
          { title: 'Android', value: 'android' },
        ],
      },
      {
        type: options.label ? null : 'text',
        name: 'label',
        message: '版本标签 (如 v1.0.1):',
        validate: (value: string) => /^v\d+\.\d+\.\d+$/.test(value) || '格式错误，示例: v1.0.1',
      },
      {
        type: options.targetVersion ? null : 'text',
        name: 'targetVersion',
        message: '目标App版本:',
        initial: '1.0.0',
      },
      {
        type: options.description ? null : 'text',
        name: 'description',
        message: '更新描述:',
      },
    ]);

    const releaseData = { ...options, ...answers };

    console.log(chalk.blue('\n开始构建Bundle...'));

    // 构建Bundle
    const spinner = ora('构建中...').start();

    try {
      const bundleBuilder = new BundleBuilder();
      const bundlePath = await bundleBuilder.build({
        platform: releaseData.platform,
        dev: false,
        entry: 'index.js',
        outputDir: path.join(process.cwd(), '.update-cli'),
      });

      spinner.succeed('Bundle构建完成');

      // 上传
      spinner.start('上传中...');

      const formData = new FormData();
      formData.append('bundle', fs.createReadStream(bundlePath));
      formData.append('deploymentName', releaseData.deployment);
      formData.append('label', releaseData.label);
      formData.append('platform', releaseData.platform);
      formData.append('targetBinaryVersion', releaseData.targetVersion);
      formData.append('description', releaseData.description);
      formData.append('isMandatory', releaseData.mandatory ? 'true' : 'false');
      formData.append('rolloutPercentage', releaseData.rollout);

      const response = await axios.post(
        `${config.get('serverUrl')}/api/admin/releases`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${config.get('token')}`,
          },
        }
      );

      spinner.succeed(chalk.green('发布成功！'));

      // 显示发布信息
      console.log(chalk.blue('\n发布信息:'));
      console.log(chalk.gray('  ID:'), response.data.id);
      console.log(chalk.gray('  标签:'), response.data.label);
      console.log(chalk.gray('  平台:'), response.data.platform);
      console.log(chalk.gray('  灰度:'), `${response.data.rolloutPercentage}%`);
      console.log(chalk.gray('  强制:'), response.data.isMandatory ? '是' : '否');

      // 清理临时文件
      await fs.remove(path.dirname(bundlePath));

    } catch (error: any) {
      spinner.fail(chalk.red('发布失败'));
      console.error(chalk.red(error.response?.data?.message || error.message));
      process.exit(1);
    }
  });

// 查看发布列表
program
  .command('list')
  .description('查看发布列表')
  .option('-d, --deployment <name>', '部署环境')
  .option('-l, --limit <number>', '显示数量', '10')
  .action(async (options) => {
    ensureLoggedIn();

    const spinner = ora('加载中...').start();

    try {
      const response = await axios.get(
        `${config.get('serverUrl')}/api/admin/releases`,
        {
          params: {
            deployment: options.deployment,
            limit: options.limit,
          },
          headers: {
            'Authorization': `Bearer ${config.get('token')}`,
          },
        }
      );

      spinner.stop();

      const table = new Table({
        head: ['标签', '平台', '部署', '灰度', '状态', '成功率', '创建时间'],
        colWidths: [12, 10, 15, 8, 10, 10, 20],
      });

      response.data.forEach((release: any) => {
        table.push([
          release.label,
          release.platform.toUpperCase(),
          release.deployment.name,
          `${release.rolloutPercentage}%`,
          release.isDisabled ? chalk.red('禁用') : chalk.green('激活'),
          release.metrics?.successRate
            ? `${release.metrics.successRate.toFixed(1)}%`
            : '-',
          new Date(release.createdAt).toLocaleDateString(),
        ]);
      });

      console.log(table.toString());
    } catch (error: any) {
      spinner.fail(chalk.red('加载失败'));
      console.error(chalk.red(error.response?.data?.message || error.message));
    }
  });

// 调整灰度
program
  .command('promote')
  .description('调整发布的灰度百分比')
  .argument('<release-id>', '发布ID')
  .argument('<percentage>', '灰度百分比 (0-100)')
  .action(async (releaseId, percentage) => {
    ensureLoggedIn();

    const percent = parseInt(percentage);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      console.error(chalk.red('灰度百分比必须在 0-100 之间'));
      process.exit(1);
    }

    const confirm = await prompts({
      type: 'confirm',
      name: 'value',
      message: `确认将灰度调整为 ${percent}%?`,
      initial: true,
    });

    if (!confirm.value) {
      console.log(chalk.yellow('已取消'));
      return;
    }

    const spinner = ora('更新中...').start();

    try {
      await axios.patch(
        `${config.get('serverUrl')}/api/admin/releases/${releaseId}/rollout`,
        { percentage: percent },
        {
          headers: {
            'Authorization': `Bearer ${config.get('token')}`,
          },
        }
      );

      spinner.succeed(chalk.green('灰度已更新！'));
    } catch (error: any) {
      spinner.fail(chalk.red('更新失败'));
      console.error(chalk.red(error.response?.data?.message || error.message));
    }
  });

// 回滚
program
  .command('rollback')
  .description('回滚到上一个版本')
  .argument('<release-id>', '要回滚的发布ID')
  .action(async (releaseId) => {
    ensureLoggedIn();

    const confirm = await prompts({
      type: 'confirm',
      name: 'value',
      message: chalk.yellow('确认回滚? 此操作不可撤销'),
      initial: false,
    });

    if (!confirm.value) {
      console.log(chalk.yellow('已取消'));
      return;
    }

    const spinner = ora('回滚中...').start();

    try {
      await axios.post(
        `${config.get('serverUrl')}/api/admin/releases/${releaseId}/rollback`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${config.get('token')}`,
          },
        }
      );

      spinner.succeed(chalk.green('回滚成功！'));
    } catch (error: any) {
      spinner.fail(chalk.red('回滚失败'));
      console.error(chalk.red(error.response?.data?.message || error.message));
    }
  });

// 查看指标
program
  .command('metrics')
  .description('查看发布指标')
  .argument('<release-id>', '发布ID')
  .action(async (releaseId) => {
    ensureLoggedIn();

    const spinner = ora('加载中...').start();

    try {
      const response = await axios.get(
        `${config.get('serverUrl')}/api/admin/releases/${releaseId}/metrics`,
        {
          headers: {
            'Authorization': `Bearer ${config.get('token')}`,
          },
        }
      );

      spinner.stop();

      const metrics = response.data;

      console.log(chalk.blue('\n发布指标:'));
      console.log(chalk.gray('  检查次数:'), metrics.checkCount);
      console.log(chalk.gray('  下载次数:'), metrics.downloadCount);
      console.log(chalk.gray('  安装成功:'), chalk.green(metrics.installCount));
      console.log(chalk.gray('  安装失败:'), chalk.red(metrics.failedCount));
      console.log(
        chalk.gray('  成功率:'),
        metrics.successRate > 95
          ? chalk.green(`${metrics.successRate.toFixed(2)}%`)
          : chalk.yellow(`${metrics.successRate.toFixed(2)}%`)
      );
    } catch (error: any) {
      spinner.fail(chalk.red('加载失败'));
      console.error(chalk.red(error.response?.data?.message || error.message));
    }
  });

// 禁用/启用发布
program
  .command('disable')
  .description('禁用发布')
  .argument('<release-id>', '发布ID')
  .action(async (releaseId) => {
    ensureLoggedIn();
    await toggleRelease(releaseId, 'disable');
  });

program
  .command('enable')
  .description('启用发布')
  .argument('<release-id>', '发布ID')
  .action(async (releaseId) => {
    ensureLoggedIn();
    await toggleRelease(releaseId, 'enable');
  });

// 帮助函数
function ensureLoggedIn() {
  if (!config.get('token')) {
    console.error(chalk.red('请先登录: update-cli login'));
    process.exit(1);
  }
}

async function toggleRelease(releaseId: string, action: 'disable' | 'enable') {
  const spinner = ora(`${action === 'disable' ? '禁用' : '启用'}中...`).start();

  try {
    await axios.post(
      `${config.get('serverUrl')}/api/admin/releases/${releaseId}/${action}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${config.get('token')}`,
        },
      }
    );

    spinner.succeed(chalk.green(`${action === 'disable' ? '已禁用' : '已启用'}！`));
  } catch (error: any) {
    spinner.fail(chalk.red(`${action === 'disable' ? '禁用' : '启用'}失败`));
    console.error(chalk.red(error.response?.data?.message || error.message));
  }
}

program.parse();

// cli/src/bundle-builder.ts
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';

export interface BuildOptions {
  platform: 'ios' | 'android';
  dev: boolean;
  entry: string;
  outputDir: string;
}

export class BundleBuilder {
  async build(options: BuildOptions): Promise<string> {
    const { platform, dev, entry, outputDir } = options;

    // 创建输出目录
    await fs.ensureDir(outputDir);

    const bundlePath = path.join(
      outputDir,
      `index.${platform}.bundle`
    );

    const assetsDir = path.join(outputDir, 'assets');

    // 构建命令
    const command = [
      'npx react-native bundle',
      `--platform ${platform}`,
      `--dev ${dev}`,
      `--entry-file ${entry}`,
      `--bundle-output ${bundlePath}`,
      `--assets-dest ${assetsDir}`,
      '--reset-cache',
    ].join(' ');

    // 执行构建
    execSync(command, { stdio: 'inherit' });

    // 计算hash
    const bundleContent = await fs.readFile(bundlePath);
    const hash = crypto.createHash('sha256').update(bundleContent).digest('hex');

    // 保存hash
    await fs.writeFile(
      path.join(outputDir, 'bundle.hash'),
      hash
    );

    return bundlePath;
  }
}

// cli/src/config.ts
import Conf from 'conf';

export class ConfigManager {
  private config: Conf;

  constructor() {
    this.config = new Conf({
      projectName: 'update-cli',
    });
  }

  get(key: string): any {
    return this.config.get(key);
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }

  delete(key: string): void {
    this.config.delete(key);
  }

  clear(): void {
    this.config.clear();
  }
}
```

**CLI使用示例：**

```bash
# 1. 安装CLI
npm install -g @your-org/update-cli

# 2. 登录
update-cli login --server https://update.example.com

# 3. 发布新版本
update-cli release \
  --deployment Production \
  --platform ios \
  --label v1.0.1 \
  --target-version "1.0.*" \
  --rollout 10 \
  --description "修复登录问题"

# 4. 查看发布列表
update-cli list --deployment Production

# 5. 逐步扩大灰度
update-cli promote <release-id> 50   # 扩大到50%
update-cli promote <release-id> 100  # 全量发布

# 6. 查看指标
update-cli metrics <release-id>

# 7. 回滚（如果出现问题）
update-cli rollback <release-id>

# 8. 禁用/启用
update-cli disable <release-id>
update-cli enable <release-id>
```

#### 3.4.4 生产部署方案

**1. Docker容器化**

```dockerfile
# server/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建TypeScript
RUN npm run build

# 生产镜像
FROM node:18-alpine

WORKDIR /app

# 安装生产依赖
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# 从builder复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 创建必要的目录
RUN mkdir -p /app/bundles && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API服务
  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    image: update-server:latest
    container_name: update-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/update_db
      - REDIS_URL=redis://redis:6379
      - MONGODB_URL=mongodb://mongo:27017/update_logs
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
    depends_on:
      - postgres
      - redis
      - mongo
    networks:
      - update-network
    volumes:
      - bundle-storage:/app/bundles
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL数据库
  postgres:
    image: postgres:15-alpine
    container_name: update-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=update_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./server/migrations:/docker-entrypoint-initdb.d
    networks:
      - update-network

  # Redis缓存
  redis:
    image: redis:7-alpine
    container_name: update-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - update-network

  # MongoDB日志
  mongo:
    image: mongo:6
    container_name: update-mongo
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - update-network

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    container_name: update-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx-cache:/var/cache/nginx
    depends_on:
      - api
    networks:
      - update-network

  # 管理后台
  admin-panel:
    build:
      context: ./admin-panel
      dockerfile: Dockerfile
    image: update-admin:latest
    container_name: update-admin-panel
    restart: unless-stopped
    environment:
      - REACT_APP_API_URL=https://api.update.example.com
    networks:
      - update-network

networks:
  update-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  mongo-data:
  bundle-storage:
  nginx-cache:
```

**2. Kubernetes部署**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: update-system

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: update-config
  namespace: update-system
data:
  NODE_ENV: "production"
  PORT: "3000"
  DATABASE_HOST: "postgres-service"
  REDIS_HOST: "redis-service"
  MONGODB_HOST: "mongo-service"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: update-secrets
  namespace: update-system
type: Opaque
stringData:
  JWT_SECRET: "your-jwt-secret-here"
  DATABASE_PASSWORD: "your-db-password"
  REDIS_PASSWORD: "your-redis-password"
  AWS_ACCESS_KEY_ID: "your-aws-key"
  AWS_SECRET_ACCESS_KEY: "your-aws-secret"

---
# k8s/postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: update-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: "update_db"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: update-secrets
              key: DATABASE_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc

---
# k8s/postgres-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: update-system
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432

---
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: update-api
  namespace: update-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: update-api
  template:
    metadata:
      labels:
        app: update-api
    spec:
      containers:
      - name: api
        image: your-registry/update-server:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: update-config
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: update-secrets
              key: JWT_SECRET
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: update-secrets
              key: DATABASE_PASSWORD
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: update-api-service
  namespace: update-system
spec:
  selector:
    app: update-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer

---
# k8s/api-hpa.yaml (水平自动扩展)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: update-api-hpa
  namespace: update-system
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: update-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: update-ingress
  namespace: update-system
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.update.example.com
    - admin.update.example.com
    secretName: update-tls
  rules:
  - host: api.update.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: update-api-service
            port:
              number: 80
  - host: admin.update.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: admin-panel-service
            port:
              number: 80
```

**3. Nginx配置**

```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/x-javascript;

    # 缓存配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m
                     max_size=1g inactive=60m use_temp_path=off;

    # 限流配置
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    # Upstream - API服务器
    upstream api_backend {
        least_conn;
        server api:3000 max_fails=3 fail_timeout=30s;
        # 如果有多个实例
        # server api2:3000 max_fails=3 fail_timeout=30s;
        # server api3:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # API服务器
    server {
        listen 80;
        listen [::]:80;
        server_name api.update.example.com;

        # 重定向到HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name api.update.example.com;

        # SSL证书
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API接口
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            limit_conn conn_limit 10;

            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;

            # 缓存配置（仅缓存GET请求）
            proxy_cache my_cache;
            proxy_cache_key "$scheme$request_method$host$request_uri";
            proxy_cache_valid 200 5m;
            proxy_cache_valid 404 1m;
            proxy_cache_bypass $http_cache_control;
            add_header X-Cache-Status $upstream_cache_status;
        }

        # Bundle下载（启用缓存和断点续传）
        location /bundles/ {
            alias /app/bundles/;

            # 启用sendfile加速
            sendfile on;
            tcp_nopush on;
            tcp_nodelay on;

            # 支持断点续传
            add_header Accept-Ranges bytes;

            # 缓存控制
            expires 7d;
            add_header Cache-Control "public, immutable";

            # 安全防护
            valid_referers none blocked server_names;
            if ($invalid_referer) {
                return 403;
            }
        }

        # 健康检查
        location /health {
            access_log off;
            proxy_pass http://api_backend;
        }

        # 错误页面
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }

    # 管理后台
    server {
        listen 80;
        listen [::]:80;
        server_name admin.update.example.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name admin.update.example.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;

        root /usr/share/nginx/html/admin;
        index index.html;

        # SPA路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**4. 监控和日志**

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # API服务监控
  - job_name: 'update-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'

  # Nginx监控
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']

  # PostgreSQL监控
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Redis监控
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

---
# monitoring/grafana-dashboard.json
{
  "dashboard": {
    "title": "热更新系统监控",
    "panels": [
      {
        "title": "API请求速率",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "响应时间",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "错误率",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "数据库连接池",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends"
          }
        ]
      }
    ]
  }
}
```

```typescript
// server/src/middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';
import promClient from 'prom-client';

// 创建指标
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const updateCheckTotal = new promClient.Counter({
  name: 'update_check_total',
  help: 'Total number of update checks',
  labelNames: ['platform', 'deployment'],
});

const updateDownloadTotal = new promClient.Counter({
  name: 'update_download_total',
  help: 'Total number of update downloads',
  labelNames: ['platform', 'deployment', 'label'],
});

// 注册默认指标
promClient.collectDefaultMetrics();

// 监控中间件
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
      },
      duration
    );

    httpRequestTotal.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });
  });

  next();
}

// 暴露指标端点
export async function metricsHandler(req: Request, res: Response) {
  res.set('Content-Type', promClient.register.contentType);
  res.send(await promClient.register.metrics());
}

// 业务指标记录
export const metrics = {
  recordUpdateCheck: (platform: string, deployment: string) => {
    updateCheckTotal.inc({ platform, deployment });
  },

  recordUpdateDownload: (platform: string, deployment: string, label: string) => {
    updateDownloadTotal.inc({ platform, deployment, label });
  },
};
```

**5. CI/CD流程**

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./server
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.update.example.com

    steps:
      - uses: actions/checkout@v3

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=./kubeconfig

      - name: Deploy to Staging
        run: |
          kubectl set image deployment/update-api \
            api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:staging \
            -n update-system-staging

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/update-api \
            -n update-system-staging

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://update.example.com

    steps:
      - uses: actions/checkout@v3

      - name: Setup kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=./kubeconfig

      - name: Deploy to Production
        run: |
          kubectl set image deployment/update-api \
            api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n update-system

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/update-api \
            -n update-system

      - name: Create Sentry release
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: your-org
          SENTRY_PROJECT: update-server
        with:
          environment: production
          version: ${{ github.sha }}
```

**部署步骤：**

```bash
# 1. 准备环境变量
cp .env.example .env
# 编辑.env文件，填写必要的配置

# 2. 本地Docker Compose部署
docker-compose up -d

# 3. 检查服务状态
docker-compose ps
docker-compose logs -f api

# 4. 运行数据库迁移
docker-compose exec api npm run migrate

# 5. Kubernetes部署
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# 6. 检查Pod状态
kubectl get pods -n update-system
kubectl logs -f deployment/update-api -n update-system

# 7. 扩容/缩容
kubectl scale deployment/update-api --replicas=5 -n update-system

# 8. 滚动更新
kubectl set image deployment/update-api \
  api=your-registry/update-server:v1.0.1 \
  -n update-system

# 9. 回滚
kubectl rollout undo deployment/update-api -n update-system
```

---

## 第四章：差异化更新策略

### 4.1 什么是差异化更新

完整Bundle可能有几MB大小，每次都下载完整Bundle浪费流量和时间。差异化更新只下载变化的部分。

```typescript
/*
差异化更新原理：

完整更新：
  旧Bundle (3MB) → 新Bundle (3.2MB)
  下载大小：3.2MB

差异化更新：
  旧Bundle (3MB) + 差异补丁 (200KB) = 新Bundle (3.2MB)
  下载大小：200KB

节省流量：94%
*/
```

### 4.2 生成差异补丁

```bash
# 使用bsdiff工具生成补丁

# 安装bsdiff
# macOS
brew install bsdiff

# Ubuntu
sudo apt-get install bsdiff

# 生成补丁
bsdiff old.bundle new.bundle patch.diff

# 应用补丁
bspatch old.bundle new.bundle patch.diff

# 示例
cd bundles/
bsdiff v1.0.0/index.bundle v1.0.1/index.bundle v1.0.0-to-v1.0.1.patch

# 结果：
# v1.0.0/index.bundle: 3.0MB
# v1.0.1/index.bundle: 3.2MB
# v1.0.0-to-v1.0.1.patch: 180KB (节省94%)
```

### 4.3 客户端应用补丁

```typescript
// 使用react-native-bsdiff包
import { patch } from 'react-native-bsdiff';

async function applyPatch(
  oldBundlePath: string,
  patchPath: string,
  newBundlePath: string
): Promise<void> {
  try {
    await patch(oldBundlePath, newBundlePath, patchPath);
    console.log('补丁应用成功');
  } catch (error) {
    console.error('补丁应用失败:', error);
    // 失败时回退到完整下载
    throw error;
  }
}

// 更新流程中集成补丁
class UpdateManager {
  async downloadUpdate(updateInfo: UpdateInfo): Promise<string> {
    // 检查是否有差异补丁
    if (updateInfo.patchUrl && this.currentVersion) {
      try {
        // 下载补丁
        const patchPath = await this.downloadPatch(updateInfo.patchUrl);

        // 应用补丁
        const oldBundlePath = this.getCurrentBundlePath();
        const newBundlePath = this.getNewBundlePath(updateInfo.version);

        await applyPatch(oldBundlePath, patchPath, newBundlePath);

        return newBundlePath;
      } catch (error) {
        console.warn('补丁更新失败，回退到完整下载', error);
        // 回退到完整下载
      }
    }

    // 完整下载
    return this.downloadFullBundle(updateInfo.downloadUrl);
  }
}
```

### 4.4 服务端支持差异更新

```typescript
// 生成并存储补丁
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generatePatch(
  oldBundlePath: string,
  newBundlePath: string,
  patchPath: string
): Promise<void> {
  await execAsync(`bsdiff ${oldBundlePath} ${newBundlePath} ${patchPath}`);
}

// 发布新版本时自动生成补丁
app.post('/api/update/upload', upload.single('bundle'), async (req, res) => {
  // ... 上传新Bundle

  // 查找所有历史版本
  const previousVersions = await BundleVersion.find({
    platform: req.body.platform,
    version: { $lt: req.body.version },
    isActive: true,
  });

  // 为每个历史版本生成补丁
  for (const prevVersion of previousVersions) {
    const patchPath = path.join(
      __dirname,
      'patches',
      `${prevVersion.version}-to-${req.body.version}.patch`
    );

    await generatePatch(
      path.join(__dirname, 'bundles', prevVersion.bundleUrl),
      storagePath,
      patchPath
    );

    // 保存补丁信息到数据库
    await Patch.create({
      fromVersion: prevVersion.version,
      toVersion: req.body.version,
      platform: req.body.platform,
      patchUrl: `/patches/${path.basename(patchPath)}`,
      size: fs.statSync(patchPath).size,
    });
  }

  res.json({ success: true });
});

// 检查更新时返回补丁信息
app.post('/api/update/check', async (req, res) => {
  const { currentBundleVersion, platform } = req.body;

  const latestVersion = await BundleVersion.findOne({
    platform,
    isActive: true,
  }).sort({ createdAt: -1 });

  if (!latestVersion) {
    return res.json({ hasUpdate: false });
  }

  // 查找补丁
  const patch = await Patch.findOne({
    fromVersion: currentBundleVersion,
    toVersion: latestVersion.version,
    platform,
  });

  res.json({
    hasUpdate: true,
    updateInfo: {
      version: latestVersion.version,
      downloadUrl: latestVersion.bundleUrl,
      patchUrl: patch?.patchUrl, // 如果有补丁就返回
      patchSize: patch?.size,
      fullSize: latestVersion.size,
      // ...
    },
  });
});
```

---

## 第五章：灰度发布与AB测试

### 5.1 灰度发布策略

```typescript
// 灰度发布策略

// 策略1：基于百分比
// 先推送给10%用户，观察稳定后逐步扩大
interface RolloutStrategy {
  percentage: number; // 0-100
}

// 策略2：基于用户分组
// 指定用户ID列表
interface UserListStrategy {
  userIds: string[];
}

// 策略3：基于设备信息
// 根据设备型号、系统版本等
interface DeviceStrategy {
  osVersions?: string[];     // ['14.0', '15.0']
  deviceModels?: string[];   // ['iPhone12,1', 'iPhone13,2']
  regions?: string[];        // ['cn', 'us']
}

// 策略4：基于渠道
// 内部测试、beta用户、正式用户
interface ChannelStrategy {
  channels: ('internal' | 'beta' | 'production')[];
}

// 组合策略
interface CombinedStrategy {
  percentage?: number;
  userIds?: string[];
  channels?: string[];
  deviceStrategy?: DeviceStrategy;
}
```

### 5.2 实现灰度逻辑

```typescript
// server.ts
class GrayReleaseManager {
  // 检查用户是否在灰度范围内
  async shouldUpdate(
    deviceId: string,
    userId: string,
    deviceInfo: any,
    strategy: CombinedStrategy
  ): Promise<boolean> {
    // 1. 检查用户ID白名单
    if (strategy.userIds?.includes(userId)) {
      return true;
    }

    // 2. 检查渠道
    if (strategy.channels?.includes(deviceInfo.channel)) {
      // 渠道匹配，继续检查其他条件
    } else if (strategy.channels) {
      return false; // 渠道不匹配
    }

    // 3. 检查设备策略
    if (strategy.deviceStrategy) {
      if (!this.matchDeviceStrategy(deviceInfo, strategy.deviceStrategy)) {
        return false;
      }
    }

    // 4. 检查百分比
    if (strategy.percentage !== undefined) {
      return this.checkPercentage(deviceId, strategy.percentage);
    }

    return true;
  }

  // 基于设备ID的一致性哈希
  private checkPercentage(deviceId: string, percentage: number): boolean {
    if (percentage >= 100) return true;
    if (percentage <= 0) return false;

    const hash = crypto.createHash('md5').update(deviceId).digest('hex');
    const hashValue = parseInt(hash.substring(0, 8), 16);
    const bucket = (hashValue % 100) + 1;

    return bucket <= percentage;
  }

  // 匹配设备策略
  private matchDeviceStrategy(
    deviceInfo: any,
    strategy: DeviceStrategy
  ): boolean {
    if (strategy.osVersions) {
      if (!strategy.osVersions.includes(deviceInfo.osVersion)) {
        return false;
      }
    }

    if (strategy.deviceModels) {
      if (!strategy.deviceModels.includes(deviceInfo.deviceModel)) {
        return false;
      }
    }

    if (strategy.regions) {
      if (!strategy.regions.includes(deviceInfo.region)) {
        return false;
      }
    }

    return true;
  }
}

// API中使用
app.post('/api/update/check', async (req, res) => {
  const { deviceId, userId, deviceInfo, currentBundleVersion } = req.body;

  const latestVersion = await BundleVersion.findOne({
    platform: req.body.platform,
    isActive: true,
  }).sort({ createdAt: -1 });

  if (!latestVersion) {
    return res.json({ hasUpdate: false });
  }

  // 检查灰度策略
  const grayManager = new GrayReleaseManager();
  const shouldUpdate = await grayManager.shouldUpdate(
    deviceId,
    userId,
    deviceInfo,
    latestVersion.grayStrategy
  );

  if (!shouldUpdate) {
    return res.json({ hasUpdate: false });
  }

  res.json({
    hasUpdate: true,
    updateInfo: latestVersion,
  });
});
```

### 5.3 AB测试

```typescript
// AB测试：同时发布多个版本，分流用户

interface ABTestConfig {
  testId: string;
  variants: {
    id: string;
    bundleVersion: string;
    percentage: number;
  }[];
}

// 示例：测试两个不同的UI版本
const abTest: ABTestConfig = {
  testId: 'homepage-redesign',
  variants: [
    { id: 'control', bundleVersion: 'v1.0.0', percentage: 50 },
    { id: 'variant-a', bundleVersion: 'v1.0.1-test', percentage: 50 },
  ],
};

// 分配用户到测试组
function assignToVariant(deviceId: string, config: ABTestConfig): string {
  const hash = crypto.createHash('md5').update(deviceId + config.testId).digest('hex');
  const hashValue = parseInt(hash.substring(0, 8), 16);
  const bucket = hashValue % 100;

  let cumulative = 0;
  for (const variant of config.variants) {
    cumulative += variant.percentage;
    if (bucket < cumulative) {
      return variant.bundleVersion;
    }
  }

  return config.variants[0].bundleVersion;
}

// 记录AB测试数据
interface ABTestEvent {
  testId: string;
  variantId: string;
  userId: string;
  eventType: 'view' | 'click' | 'conversion';
  timestamp: Date;
  metadata?: any;
}

// 分析AB测试结果
async function analyzeABTest(testId: string) {
  const events = await ABTestEvent.find({ testId });

  const variantStats = {};
  for (const event of events) {
    if (!variantStats[event.variantId]) {
      variantStats[event.variantId] = {
        views: 0,
        clicks: 0,
        conversions: 0,
      };
    }

    variantStats[event.variantId][event.eventType + 's']++;
  }

  console.log('AB测试结果:', variantStats);
  // {
  //   control: { views: 10000, clicks: 500, conversions: 50 },
  //   'variant-a': { views: 10000, clicks: 600, conversions: 70 }
  // }
}
```

---

## 第六章：安全性与版本管理

### 6.1 安全措施

```typescript
// 1. Bundle签名验证

// 生成签名（服务端）
import crypto from 'crypto';
import fs from 'fs';

function signBundle(bundlePath: string, privateKey: string): string {
  const bundleContent = fs.readFileSync(bundlePath);
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(bundleContent);
  const signature = sign.sign(privateKey, 'hex');
  return signature;
}

// 验证签名（客户端）
async function verifySignature(
  bundlePath: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  const bundleContent = await RNFS.readFile(bundlePath, 'utf8');
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(bundleContent);
  return verify.verify(publicKey, signature, 'hex');
}

// 2. HTTPS传输
// 所有API都必须使用HTTPS

// 3. 证书固定（Certificate Pinning）
import { fetch } from 'react-native-ssl-pinning';

const certificateHash = 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

await fetch('https://your-api.com/update/check', {
  method: 'POST',
  sslPinning: {
    certs: [certificateHash],
  },
});

// 4. 加密存储
import { encrypt, decrypt } from 'react-native-aes-crypto';

async function saveEncryptedBundle(bundlePath: string, password: string) {
  const content = await RNFS.readFile(bundlePath, 'base64');
  const encrypted = await encrypt(password, content);
  await RNFS.writeFile(bundlePath + '.encrypted', encrypted, 'utf8');
}
```

### 6.2 版本管理策略

```typescript
// 语义化版本管理

interface Version {
  major: number; // 重大更新，不兼容
  minor: number; // 功能更新，向下兼容
  patch: number; // Bug修复
}

function parseVersion(versionString: string): Version {
  const [major, minor, patch] = versionString.split('.').map(Number);
  return { major, minor, patch };
}

function compareVersions(v1: string, v2: string): number {
  const version1 = parseVersion(v1);
  const version2 = parseVersion(v2);

  if (version1.major !== version2.major) {
    return version1.major - version2.major;
  }
  if (version1.minor !== version2.minor) {
    return version1.minor - version2.minor;
  }
  return version1.patch - version2.patch;
}

// 检查版本兼容性
function isCompatible(appVersion: string, bundleVersion: string): boolean {
  const app = parseVersion(appVersion);
  const bundle = parseVersion(bundleVersion);

  // 主版本号必须一致
  return app.major === bundle.major;
}

// 版本依赖关系
interface BundleVersion {
  version: string;
  minAppVersion: string;  // 最小App版本
  maxAppVersion: string;  // 最大App版本
  dependencies?: {
    [packageName: string]: string; // 依赖的原生模块版本
  };
}

// 示例
const bundle: BundleVersion = {
  version: '1.2.3',
  minAppVersion: '1.0.0',
  maxAppVersion: '1.9.9',
  dependencies: {
    'react-native-camera': '4.0.0',
    'react-native-maps': '0.29.0',
  },
};
```

---

## 第七章：监控与回滚机制

### 7.1 更新统计

```typescript
// 上报更新事件
interface UpdateEvent {
  eventType:
    | 'check_start'
    | 'check_complete'
    | 'download_start'
    | 'download_complete'
    | 'install_start'
    | 'install_complete'
    | 'update_success'
    | 'update_failed';
  deviceId: string;
  userId: string;
  fromVersion: string;
  toVersion: string;
  timestamp: Date;
  error?: string;
  duration?: number; // 毫秒
}

// 客户端上报
class UpdateReporter {
  private startTime: number = 0;

  async reportEvent(eventType: UpdateEvent['eventType'], data: Partial<UpdateEvent>) {
    if (eventType.includes('start')) {
      this.startTime = Date.now();
    }

    const duration = this.startTime ? Date.now() - this.startTime : undefined;

    await fetch(`${API_BASE}/update/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        duration,
        ...data,
        timestamp: new Date(),
      }),
    });
  }
}

// 服务端统计
app.post('/api/update/report', async (req, res) => {
  await UpdateEvent.create(req.body);
  res.json({ success: true });
});

// 生成统计报告
async function generateUpdateReport(version: string) {
  const events = await UpdateEvent.find({ toVersion: version });

  const stats = {
    totalAttempts: 0,
    successCount: 0,
    failureCount: 0,
    avgDownloadDuration: 0,
    avgInstallDuration: 0,
    errorDistribution: {} as { [error: string]: number },
  };

  for (const event of events) {
    if (event.eventType === 'check_complete') {
      stats.totalAttempts++;
    }
    if (event.eventType === 'update_success') {
      stats.successCount++;
    }
    if (event.eventType === 'update_failed') {
      stats.failureCount++;
      const error = event.error || 'unknown';
      stats.errorDistribution[error] = (stats.errorDistribution[error] || 0) + 1;
    }
  }

  stats.avgDownloadDuration = await calculateAvgDuration('download_complete');
  stats.avgInstallDuration = await calculateAvgDuration('install_complete');

  return stats;
}
```

### 7.2 自动回滚

```typescript
// 监控异常并自动回滚

class AutoRollbackMonitor {
  private thresholds = {
    crashRate: 0.05,      // 崩溃率 > 5%
    errorRate: 0.1,       // 错误率 > 10%
    minSampleSize: 100,   // 最小样本量
  };

  async checkAndRollback(version: string): Promise<boolean> {
    const stats = await this.collectStats(version);

    if (stats.sampleSize < this.thresholds.minSampleSize) {
      console.log('样本量不足，继续观察');
      return false;
    }

    const crashRate = stats.crashes / stats.sampleSize;
    const errorRate = stats.errors / stats.sampleSize;

    if (
      crashRate > this.thresholds.crashRate ||
      errorRate > this.thresholds.errorRate
    ) {
      console.error(`版本${version}异常，触发自动回滚`);
      console.error(`崩溃率: ${(crashRate * 100).toFixed(2)}%`);
      console.error(`错误率: ${(errorRate * 100).toFixed(2)}%`);

      await this.rollback(version);
      return true;
    }

    return false;
  }

  private async collectStats(version: string) {
    // 从监控系统获取数据
    const sampleSize = await UpdateEvent.countDocuments({
      toVersion: version,
      eventType: 'update_success',
    });

    const crashes = await CrashReport.countDocuments({
      version,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const errors = await ErrorLog.countDocuments({
      version,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    return { sampleSize, crashes, errors };
  }

  private async rollback(version: string) {
    // 1. 标记当前版本为不活跃
    await BundleVersion.updateOne(
      { version },
      { isActive: false, rolledBack: true }
    );

    // 2. 激活上一个稳定版本
    const previousVersion = await BundleVersion.findOne({
      version: { $lt: version },
      platform: await this.getPlatform(version),
      isActive: false,
      rolledBack: false,
    }).sort({ createdAt: -1 });

    if (previousVersion) {
      await BundleVersion.updateOne(
        { _id: previousVersion._id },
        { isActive: true }
      );
    }

    // 3. 发送告警通知
    await this.sendAlert(version, previousVersion?.version);
  }

  private async sendAlert(failedVersion: string, rollbackToVersion?: string) {
    // 发送邮件、Slack、企业微信等通知
    console.log(`
      ⚠️ 自动回滚告警
      失败版本: ${failedVersion}
      回滚至版本: ${rollbackToVersion || '内置版本'}
      时间: ${new Date().toISOString()}
    `);
  }
}

// 定时任务，每小时检查一次
setInterval(async () => {
  const monitor = new AutoRollbackMonitor();
  const latestVersion = await BundleVersion.findOne({ isActive: true })
    .sort({ createdAt: -1 });

  if (latestVersion) {
    await monitor.checkAndRollback(latestVersion.version);
  }
}, 60 * 60 * 1000);
```

### 7.3 崩溃监控集成

```typescript
// 集成Sentry等崩溃监控

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
});

// 更新后上报版本信息
async function onUpdateComplete(newVersion: string) {
  Sentry.setTag('bundle_version', newVersion);
  Sentry.setContext('update', {
    version: newVersion,
    timestamp: new Date().toISOString(),
  });

  // 埋点：更新成功
  Sentry.captureMessage('Update Success', {
    level: 'info',
    tags: { version: newVersion },
  });
}

// 更新失败时上报
async function onUpdateFailed(error: Error, version: string) {
  Sentry.captureException(error, {
    tags: {
      update_version: version,
      update_phase: 'download', // or 'install'
    },
  });
}
```

---

## 第八章：实战案例与最佳实践

### 8.1 完整更新流程示例

```typescript
// App.tsx - 完整的热更新集成
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import UpdateManager from './UpdateManager';

function App() {
  const [updateModal, setUpdateModal] = useState({
    visible: false,
    type: 'optional' as 'optional' | 'mandatory',
    description: '',
    version: '',
  });

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      const updateInfo = await UpdateManager.checkForUpdate();

      if (updateInfo) {
        setUpdateModal({
          visible: true,
          type: updateInfo.mandatory ? 'mandatory' : 'optional',
          description: updateInfo.description,
          version: updateInfo.version,
        });

        // 强制更新：立即下载
        if (updateInfo.mandatory) {
          handleUpdate();
        }
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  };

  const handleUpdate = async () => {
    setIsDownloading(true);

    try {
      await UpdateManager.update({
        onDownloadProgress: (progress) => {
          setDownloadProgress(progress);
        },
        onInstallComplete: () => {
          // 重启应用
        },
      });
    } catch (error) {
      console.error('更新失败:', error);
      Alert.alert('更新失败', '请稍后重试');
    } finally {
      setIsDownloading(false);
      setUpdateModal({ ...updateModal, visible: false });
    }
  };

  const handleCancel = () => {
    if (updateModal.type === 'mandatory') {
      // 强制更新不允许取消
      return;
    }
    setUpdateModal({ ...updateModal, visible: false });
  };

  return (
    <>
      <YourMainApp />

      {/* 更新弹窗 */}
      <Modal
        visible={updateModal.visible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>发现新版本</Text>
            <Text style={styles.version}>v{updateModal.version}</Text>
            <Text style={styles.description}>{updateModal.description}</Text>

            {isDownloading ? (
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.progressText}>
                  下载中: {(downloadProgress * 100).toFixed(0)}%
                </Text>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                {updateModal.type === 'optional' && (
                  <Button title="稍后" onPress={handleCancel} />
                )}
                <Button title="立即更新" onPress={handleUpdate} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
```

### 8.2 最佳实践

#### 1. 更新时机选择

```typescript
// ❌ 不好的做法：在用户使用时强制更新
useEffect(() => {
  checkAndUpdate(); // 立即检查并更新
}, []);

// ✅ 好的做法：选择合适的时机
useEffect(() => {
  // 1. App启动时检查，但下次启动才应用
  checkUpdateOnLaunch();

  // 2. App从后台切换到前台时检查
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      checkUpdateOnResume();
    }
  });

  return () => subscription.remove();
}, []);

// 在用户空闲时下载
function checkUpdateOnLaunch() {
  setTimeout(async () => {
    const update = await checkForUpdate();
    if (update) {
      // 静默下载
      await downloadUpdate(update);
      // 提示用户重启生效
      showUpdateReadyNotification();
    }
  }, 3000); // 延迟3秒，避免影响启动体验
}
```

#### 2. 错误处理和重试

```typescript
class UpdateManager {
  private maxRetries = 3;
  private retryDelay = 5000;

  async downloadWithRetry(url: string, attempt = 0): Promise<string> {
    try {
      return await this.download(url);
    } catch (error) {
      if (attempt < this.maxRetries) {
        console.log(`下载失败，${this.retryDelay / 1000}秒后重试 (${attempt + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.downloadWithRetry(url, attempt + 1);
      }
      throw error;
    }
  }
}
```

#### 3. 网络状态检测

```typescript
import NetInfo from '@react-native-community/netinfo';

async function shouldDownloadNow(): Promise<boolean> {
  const state = await NetInfo.fetch();

  // 只在WiFi下自动下载
  if (state.type === 'wifi') {
    return true;
  }

  // 移动网络下询问用户
  if (state.type === 'cellular') {
    return await askUserConsent();
  }

  return false;
}

function askUserConsent(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      '使用移动网络',
      '当前使用移动网络，是否继续下载更新？',
      [
        { text: '取消', onPress: () => resolve(false) },
        { text: '继续', onPress: () => resolve(true) },
      ]
    );
  });
}
```

#### 4. 存储空间检查

```typescript
import { getFreeSpace } from 'react-native-fs';

async function checkStorageSpace(requiredSize: number): Promise<boolean> {
  const freeSpace = await getFreeSpace();

  // 需要至少2倍的空间（下载+解压）
  const requiredWithBuffer = requiredSize * 2;

  if (freeSpace < requiredWithBuffer) {
    Alert.alert(
      '存储空间不足',
      `需要至少 ${(requiredWithBuffer / 1024 / 1024).toFixed(2)}MB 可用空间`,
      [{ text: '确定' }]
    );
    return false;
  }

  return true;
}
```

#### 5. 版本管理

```typescript
// package.json
{
  "name": "MyApp",
  "version": "1.2.3",  // App版本
  "bundleVersion": "1.2.3.5"  // Bundle版本（可选）
}

// 命名规范
// App版本：主版本.次版本.修订版本 (1.2.3)
// Bundle版本：App版本.热更新次数 (1.2.3.5)

// 示例：
// 1.0.0 - 初始版本
// 1.0.0.1 - 第1次热更新
// 1.0.0.2 - 第2次热更新
// 1.0.1 - App更新（需发版）
// 1.0.1.1 - 1.0.1的第1次热更新
```

---

## 总结

### 热更新核心要点

1. **原理理解**
   - Bundle替换机制
   - 更新检查流程
   - 本地存储管理

2. **技术选择**
   - CodePush：快速集成，适合中小型项目
   - 自建方案：完全掌控，适合大型项目

3. **性能优化**
   - 差异化更新：节省流量
   - 灰度发布：降低风险
   - 静默下载：提升体验

4. **安全保障**
   - Bundle签名验证
   - HTTPS传输
   - 证书固定

5. **监控运维**
   - 更新统计
   - 自动回滚
   - 崩溃监控

### 实践建议

1. **开发阶段**
   - 先用CodePush快速验证
   - 建立完整的测试流程
   - 准备回滚预案

2. **发布阶段**
   - 从小范围灰度开始
   - 密切监控数据
   - 及时响应问题

3. **运维阶段**
   - 定期清理旧版本
   - 维护版本兼容性
   - 优化更新体验

---

**热更新能力是React Native应用的核心竞争力，希望这份指南能帮你构建稳定高效的热更新系统！** 🚀

---

*推荐阅读*
- CodePush官方文档：https://github.com/microsoft/react-native-code-push
- React Native更新机制：https://reactnative.dev/docs/ram-bundles-inline-requires
- Hermes引擎：https://hermesengine.dev/
