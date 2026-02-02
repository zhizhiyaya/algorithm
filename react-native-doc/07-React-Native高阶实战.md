# React Native 高阶实战

> 原生模块开发、性能优化、动画系统与实际项目经验

## 目录

- [第一章：原生模块开发](#第一章原生模块开发)
- [第二章：原生UI组件开发](#第二章原生ui组件开发)
- [第三章：性能优化实战](#第三章性能优化实战)
- [第四章：动画系统](#第四章动画系统)
- [第五章：手势处理](#第五章手势处理)
- [第六章：导航优化](#第六章导航优化)
- [第七章：离线与缓存](#第七章离线与缓存)
- [第八章：实战项目案例](#第八章实战项目案例)

---

## 第一章：原生模块开发

### 1.1 iOS原生模块（Objective-C）

```objc
// RNDeviceInfo.h
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNDeviceInfo : RCTEventEmitter <RCTBridgeModule>
@end

// RNDeviceInfo.m
#import "RNDeviceInfo.h"
#import <UIKit/UIKit.h>
#import <sys/utsname.h>

@implementation RNDeviceInfo

// 注册模块名称
RCT_EXPORT_MODULE(DeviceInfo);

// 导出同步方法
- (NSDictionary *)constantsToExport {
  return @{
    @"appVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
    @"buildNumber": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"],
    @"bundleId": [[NSBundle mainBundle] bundleIdentifier],
    @"systemName": [[UIDevice currentDevice] systemName],
    @"systemVersion": [[UIDevice currentDevice] systemVersion],
  };
}

// 导出异步方法
RCT_EXPORT_METHOD(getDeviceId:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *deviceId = [[[UIDevice currentDevice] identifierForVendor] UUIDString];

  if (deviceId) {
    resolve(deviceId);
  } else {
    reject(@"device_id_error", @"Could not get device ID", nil);
  }
}

// 导出带回调的方法
RCT_EXPORT_METHOD(getBatteryLevel:(RCTResponseSenderBlock)callback) {
  UIDevice *device = [UIDevice currentDevice];
  device.batteryMonitoringEnabled = YES;

  float batteryLevel = device.batteryLevel;
  UIDeviceBatteryState batteryState = device.batteryState;

  NSDictionary *result = @{
    @"level": @(batteryLevel),
    @"isCharging": @(batteryState == UIDeviceBatteryStateCharging ||
                     batteryState == UIDeviceBatteryStateFull)
  };

  callback(@[[NSNull null], result]);
}

// 复杂对象传递
RCT_EXPORT_METHOD(getSystemInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  struct utsname systemInfo;
  uname(&systemInfo);

  NSString *deviceModel = [NSString stringWithCString:systemInfo.machine
                                            encoding:NSUTF8StringEncoding];

  NSDictionary *info = @{
    @"model": deviceModel,
    @"name": [[UIDevice currentDevice] name],
    @"systemName": [[UIDevice currentDevice] systemName],
    @"systemVersion": [[UIDevice currentDevice] systemVersion],
    @"localizedModel": [[UIDevice currentDevice] localizedModel],
    @"userInterfaceIdiom": @([[UIDevice currentDevice] userInterfaceIdiom]),
  };

  resolve(info);
}

// 支持事件发送
- (NSArray<NSString *> *)supportedEvents {
  return @[@"BatteryLevelChanged", @"MemoryWarning"];
}

// 监听电池变化
- (void)startObserving {
  [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(batteryLevelChanged:)
                                               name:UIDeviceBatteryLevelDidChangeNotification
                                             object:nil];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(memoryWarning:)
                                               name:UIApplicationDidReceiveMemoryWarningNotification
                                             object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)batteryLevelChanged:(NSNotification *)notification {
  float level = [[UIDevice currentDevice] batteryLevel];
  [self sendEventWithName:@"BatteryLevelChanged" body:@{@"level": @(level)}];
}

- (void)memoryWarning:(NSNotification *)notification {
  [self sendEventWithName:@"MemoryWarning" body:@{}];
}

@end
```

### 1.2 Android原生模块（Java）

```java
// DeviceInfoModule.java
package com.myapp.modules;

import android.content.Context;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.os.BatteryManager;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class DeviceInfoModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private BroadcastReceiver batteryReceiver;

  public DeviceInfoModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "DeviceInfo";
  }

  // 导出常量
  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    constants.put("appVersion", BuildConfig.VERSION_NAME);
    constants.put("buildNumber", String.valueOf(BuildConfig.VERSION_CODE));
    constants.put("bundleId", reactContext.getPackageName());
    constants.put("systemName", "Android");
    constants.put("systemVersion", Build.VERSION.RELEASE);
    constants.put("brand", Build.BRAND);
    constants.put("model", Build.MODEL);

    return constants;
  }

  // Promise方法
  @ReactMethod
  public void getDeviceId(Promise promise) {
    try {
      String deviceId = Settings.Secure.getString(
        reactContext.getContentResolver(),
        Settings.Secure.ANDROID_ID
      );
      promise.resolve(deviceId);
    } catch (Exception e) {
      promise.reject("DEVICE_ID_ERROR", "Could not get device ID", e);
    }
  }

  // 回调方法
  @ReactMethod
  public void getBatteryLevel(Callback callback) {
    IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
    Intent batteryStatus = reactContext.registerReceiver(null, filter);

    int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
    int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
    int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);

    float batteryPct = level / (float) scale;
    boolean isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                        status == BatteryManager.BATTERY_STATUS_FULL;

    WritableMap result = Arguments.createMap();
    result.putDouble("level", batteryPct);
    result.putBoolean("isCharging", isCharging);

    callback.invoke(null, result);
  }

  // 复杂对象
  @ReactMethod
  public void getSystemInfo(Promise promise) {
    try {
      WritableMap info = Arguments.createMap();

      info.putString("brand", Build.BRAND);
      info.putString("model", Build.MODEL);
      info.putString("manufacturer", Build.MANUFACTURER);
      info.putString("systemName", "Android");
      info.putString("systemVersion", Build.VERSION.RELEASE);
      info.putInt("apiLevel", Build.VERSION.SDK_INT);
      info.putString("device", Build.DEVICE);
      info.putString("hardware", Build.HARDWARE);

      promise.resolve(info);
    } catch (Exception e) {
      promise.reject("SYSTEM_INFO_ERROR", "Could not get system info", e);
    }
  }

  // 发送事件
  private void sendEvent(String eventName, WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  // 监听电池变化
  @ReactMethod
  public void startBatteryMonitoring() {
    batteryReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        float batteryPct = level / (float) scale;

        WritableMap params = Arguments.createMap();
        params.putDouble("level", batteryPct);

        sendEvent("BatteryLevelChanged", params);
      }
    };

    IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
    reactContext.registerReceiver(batteryReceiver, filter);
  }

  @ReactMethod
  public void stopBatteryMonitoring() {
    if (batteryReceiver != null) {
      reactContext.unregisterReceiver(batteryReceiver);
      batteryReceiver = null;
    }
  }
}

// DeviceInfoPackage.java
package com.myapp.modules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DeviceInfoPackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new DeviceInfoModule(reactContext));
    return modules;
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
```

### 1.3 JavaScript使用原生模块

```typescript
// DeviceInfo.ts - TypeScript封装
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

interface DeviceInfoConstants {
  appVersion: string;
  buildNumber: string;
  bundleId: string;
  systemName: string;
  systemVersion: string;
  brand?: string;
  model?: string;
}

interface BatteryInfo {
  level: number;
  isCharging: boolean;
}

interface SystemInfo {
  brand: string;
  model: string;
  manufacturer?: string;
  systemName: string;
  systemVersion: string;
  apiLevel?: number;
  device?: string;
  hardware?: string;
  name?: string;
  localizedModel?: string;
  userInterfaceIdiom?: number;
}

interface IDeviceInfo {
  // 常量
  appVersion: string;
  buildNumber: string;
  bundleId: string;
  systemName: string;
  systemVersion: string;

  // 方法
  getDeviceId(): Promise<string>;
  getBatteryLevel(callback: (error: Error | null, result?: BatteryInfo) => void): void;
  getSystemInfo(): Promise<SystemInfo>;
  startBatteryMonitoring(): void;
  stopBatteryMonitoring(): void;
}

const { DeviceInfo: NativeDeviceInfo } = NativeModules as {
  DeviceInfo: IDeviceInfo;
};

const deviceInfoEmitter = new NativeEventEmitter(NativeDeviceInfo as any);

class DeviceInfoManager {
  // 获取常量
  static get appVersion() {
    return NativeDeviceInfo.appVersion;
  }

  static get buildNumber() {
    return NativeDeviceInfo.buildNumber;
  }

  static get bundleId() {
    return NativeDeviceInfo.bundleId;
  }

  static get systemName() {
    return NativeDeviceInfo.systemName;
  }

  static get systemVersion() {
    return NativeDeviceInfo.systemVersion;
  }

  // Promise方式
  static async getDeviceId(): Promise<string> {
    return await NativeDeviceInfo.getDeviceId();
  }

  static async getSystemInfo(): Promise<SystemInfo> {
    return await NativeDeviceInfo.getSystemInfo();
  }

  // 回调方式
  static getBatteryLevel(): Promise<BatteryInfo> {
    return new Promise((resolve, reject) => {
      NativeDeviceInfo.getBatteryLevel((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      });
    });
  }

  // 事件监听
  static addBatteryLevelListener(
    callback: (info: { level: number }) => void
  ) {
    if (Platform.OS === 'ios') {
      NativeDeviceInfo.startBatteryMonitoring?.();
    } else {
      NativeDeviceInfo.startBatteryMonitoring();
    }

    return deviceInfoEmitter.addListener('BatteryLevelChanged', callback);
  }

  static addMemoryWarningListener(callback: () => void) {
    return deviceInfoEmitter.addListener('MemoryWarning', callback);
  }

  static removeAllListeners() {
    if (Platform.OS === 'android') {
      NativeDeviceInfo.stopBatteryMonitoring();
    }
    deviceInfoEmitter.removeAllListeners('BatteryLevelChanged');
    deviceInfoEmitter.removeAllListeners('MemoryWarning');
  }
}

export default DeviceInfoManager;

// 使用示例
async function Example() {
  // 获取常量
  console.log('App Version:', DeviceInfoManager.appVersion);
  console.log('System:', DeviceInfoManager.systemName, DeviceInfoManager.systemVersion);

  // Promise方式
  try {
    const deviceId = await DeviceInfoManager.getDeviceId();
    console.log('Device ID:', deviceId);

    const systemInfo = await DeviceInfoManager.getSystemInfo();
    console.log('System Info:', systemInfo);

    const batteryInfo = await DeviceInfoManager.getBatteryLevel();
    console.log('Battery:', batteryInfo);
  } catch (error) {
    console.error('Error:', error);
  }

  // 事件监听
  const batterySubscription = DeviceInfoManager.addBatteryLevelListener((info) => {
    console.log('Battery level changed:', info.level);
  });

  const memorySubscription = DeviceInfoManager.addMemoryWarningListener(() => {
    console.warn('Memory warning!');
  });

  // 清理
  return () => {
    batterySubscription.remove();
    memorySubscription.remove();
    DeviceInfoManager.removeAllListeners();
  };
}
```

---

## 第二章：原生UI组件开发

### 2.1 iOS原生UI组件

```objc
// RNCustomMapView.h
#import <React/RCTViewManager.h>
#import <MapKit/MapKit.h>

@interface RNCustomMapView : RCTViewManager
@end

// RNCustomMapViewImpl.h
@interface RNCustomMapViewImpl : MKMapView
@property (nonatomic, copy) RCTBubblingEventBlock onRegionChange;
@property (nonatomic, copy) RCTBubblingEventBlock onMarkerPress;
@end

// RNCustomMapView.m
#import "RNCustomMapView.h"
#import "RNCustomMapViewImpl.h"

@implementation RNCustomMapView

RCT_EXPORT_MODULE(CustomMapView)

- (UIView *)view {
  RNCustomMapViewImpl *mapView = [[RNCustomMapViewImpl alloc] init];
  mapView.delegate = mapView;
  return mapView;
}

// 导出属性
RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMarkerPress, RCTBubblingEventBlock)

// 自定义属性设置
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, RNCustomMapViewImpl) {
  if (json) {
    MKCoordinateRegion region = MKCoordinateRegionMake(
      CLLocationCoordinate2DMake(
        [RCTConvert double:json[@"latitude"]],
        [RCTConvert double:json[@"longitude"]]
      ),
      MKCoordinateSpanMake(
        [RCTConvert double:json[@"latitudeDelta"]],
        [RCTConvert double:json[@"longitudeDelta"]]
      )
    );

    [view setRegion:region animated:YES];
  }
}

// 导出方法
RCT_EXPORT_METHOD(animateToRegion:(nonnull NSNumber *)reactTag
                  region:(NSDictionary *)region) {
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    RNCustomMapViewImpl *view = (RNCustomMapViewImpl *)viewRegistry[reactTag];

    if ([view isKindOfClass:[RNCustomMapViewImpl class]]) {
      MKCoordinateRegion newRegion = MKCoordinateRegionMake(
        CLLocationCoordinate2DMake(
          [region[@"latitude"] doubleValue],
          [region[@"longitude"] doubleValue]
        ),
        MKCoordinateSpanMake(
          [region[@"latitudeDelta"] doubleValue],
          [region[@"longitudeDelta"] doubleValue]
        )
      );

      [view setRegion:newRegion animated:YES];
    }
  }];
}

@end

// RNCustomMapViewImpl.m
#import "RNCustomMapViewImpl.h"

@implementation RNCustomMapViewImpl

- (void)mapView:(MKMapView *)mapView regionDidChangeAnimated:(BOOL)animated {
  if (self.onRegionChange) {
    MKCoordinateRegion region = mapView.region;

    self.onRegionChange(@{
      @"latitude": @(region.center.latitude),
      @"longitude": @(region.center.longitude),
      @"latitudeDelta": @(region.span.latitudeDelta),
      @"longitudeDelta": @(region.span.longitudeDelta)
    });
  }
}

- (void)mapView:(MKMapView *)mapView didSelectAnnotationView:(MKAnnotationView *)view {
  if (self.onMarkerPress) {
    self.onMarkerPress(@{
      @"id": view.annotation.title ?: @"",
      @"coordinate": @{
        @"latitude": @(view.annotation.coordinate.latitude),
        @"longitude": @(view.annotation.coordinate.longitude)
      }
    });
  }
}

@end
```

### 2.2 Android原生UI组件

```java
// CustomMapView.java
package com.myapp.views;

import android.content.Context;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.CameraUpdateFactory;

public class CustomMapView extends MapView implements OnMapReadyCallback {

  private GoogleMap googleMap;
  private CustomMapViewManager.OnRegionChangeListener onRegionChangeListener;
  private CustomMapViewManager.OnMarkerPressListener onMarkerPressListener;

  public CustomMapView(Context context) {
    super(context);
    onCreate(null);
    getMapAsync(this);
  }

  @Override
  public void onMapReady(GoogleMap map) {
    this.googleMap = map;

    // 监听地图移动
    googleMap.setOnCameraIdleListener(() -> {
      if (onRegionChangeListener != null) {
        CameraPosition position = googleMap.getCameraPosition();
        onRegionChangeListener.onRegionChange(
          position.target.latitude,
          position.target.longitude,
          position.zoom
        );
      }
    });

    // 监听标记点击
    googleMap.setOnMarkerClickListener(marker -> {
      if (onMarkerPressListener != null) {
        onMarkerPressListener.onMarkerPress(
          marker.getId(),
          marker.getPosition().latitude,
          marker.getPosition().longitude
        );
      }
      return false;
    });
  }

  public void setRegion(double latitude, double longitude, double zoom) {
    if (googleMap != null) {
      LatLng latLng = new LatLng(latitude, longitude);
      googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, (float) zoom));
    }
  }

  public void setOnRegionChangeListener(CustomMapViewManager.OnRegionChangeListener listener) {
    this.onRegionChangeListener = listener;
  }

  public void setOnMarkerPressListener(CustomMapViewManager.OnMarkerPressListener listener) {
    this.onMarkerPressListener = listener;
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    onDestroy();
  }
}

// CustomMapViewManager.java
package com.myapp.views;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

public class CustomMapViewManager extends SimpleViewManager<CustomMapView> {

  public static final String REACT_CLASS = "CustomMapView";

  @Override
  @NonNull
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  @NonNull
  protected CustomMapView createViewInstance(@NonNull ThemedReactContext reactContext) {
    return new CustomMapView(reactContext);
  }

  // 导出属性
  @ReactProp(name = "region")
  public void setRegion(CustomMapView view, @Nullable ReadableMap region) {
    if (region != null) {
      double latitude = region.getDouble("latitude");
      double longitude = region.getDouble("longitude");
      double zoom = region.hasKey("zoom") ? region.getDouble("zoom") : 10.0;

      view.setRegion(latitude, longitude, zoom);
    }
  }

  @ReactProp(name = "showsUserLocation", defaultBoolean = false)
  public void setShowsUserLocation(CustomMapView view, boolean showsUserLocation) {
    // 实现显示用户位置
  }

  @ReactProp(name = "zoomEnabled", defaultBoolean = true)
  public void setZoomEnabled(CustomMapView view, boolean zoomEnabled) {
    // 实现缩放控制
  }

  // 导出事件
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
      .put("onRegionChange", MapBuilder.of("registrationName", "onRegionChange"))
      .put("onMarkerPress", MapBuilder.of("registrationName", "onMarkerPress"))
      .build();
  }

  // 事件监听器
  public interface OnRegionChangeListener {
    void onRegionChange(double latitude, double longitude, double zoom);
  }

  public interface OnMarkerPressListener {
    void onMarkerPress(String id, double latitude, double longitude);
  }

  @Override
  protected void addEventEmitters(@NonNull ThemedReactContext reactContext, @NonNull CustomMapView view) {
    view.setOnRegionChangeListener((latitude, longitude, zoom) -> {
      WritableMap event = Arguments.createMap();
      event.putDouble("latitude", latitude);
      event.putDouble("longitude", longitude);
      event.putDouble("zoom", zoom);

      reactContext
        .getJSModule(RCTEventEmitter.class)
        .receiveEvent(view.getId(), "onRegionChange", event);
    });

    view.setOnMarkerPressListener((id, latitude, longitude) -> {
      WritableMap event = Arguments.createMap();
      event.putString("id", id);

      WritableMap coordinate = Arguments.createMap();
      coordinate.putDouble("latitude", latitude);
      coordinate.putDouble("longitude", longitude);
      event.putMap("coordinate", coordinate);

      reactContext
        .getJSModule(RCTEventEmitter.class)
        .receiveEvent(view.getId(), "onMarkerPress", event);
    });
  }
}
```

### 2.3 JavaScript组件封装

```typescript
// CustomMapView.tsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  Platform,
  ViewProps,
  NativeSyntheticEvent,
} from 'react-native';

// 类型定义
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  zoom?: number;
}

interface RegionChangeEvent {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  zoom?: number;
}

interface MarkerPressEvent {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

interface CustomMapViewProps extends ViewProps {
  region?: Region;
  showsUserLocation?: boolean;
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
  onRegionChange?: (event: NativeSyntheticEvent<RegionChangeEvent>) => void;
  onMarkerPress?: (event: NativeSyntheticEvent<MarkerPressEvent>) => void;
}

export interface CustomMapViewRef {
  animateToRegion: (region: Region) => void;
}

// 获取原生组件
const NativeCustomMapView = requireNativeComponent<CustomMapViewProps>('CustomMapView');

// 命令配置
const Commands = UIManager.getViewManagerConfig?.('CustomMapView')?.Commands;

const CustomMapView = forwardRef<CustomMapViewRef, CustomMapViewProps>(
  (props, ref) => {
    const nativeRef = useRef(null);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      animateToRegion: (region: Region) => {
        const handle = findNodeHandle(nativeRef.current);

        if (handle && Commands?.animateToRegion) {
          UIManager.dispatchViewManagerCommand(
            handle,
            Commands.animateToRegion,
            [region]
          );
        }
      },
    }));

    return <NativeCustomMapView ref={nativeRef} {...props} />;
  }
);

CustomMapView.displayName = 'CustomMapView';

export default CustomMapView;

// 使用示例
function MapExample() {
  const mapRef = useRef<CustomMapViewRef>(null);

  const handleRegionChange = (event: NativeSyntheticEvent<RegionChangeEvent>) => {
    console.log('Region changed:', event.nativeEvent);
  };

  const handleMarkerPress = (event: NativeSyntheticEvent<MarkerPressEvent>) => {
    console.log('Marker pressed:', event.nativeEvent);
  };

  const animateToSanFrancisco = () => {
    mapRef.current?.animateToRegion({
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomMapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        zoomEnabled={true}
        scrollEnabled={true}
        onRegionChange={handleRegionChange}
        onMarkerPress={handleMarkerPress}
      />

      <Button title="Go to SF" onPress={animateToSanFrancisco} />
    </View>
  );
}
```

---

## 第三章：性能优化实战

### 3.1 列表优化

```typescript
// FlatList优化最佳实践

import React, { useCallback, useMemo, memo } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  ListRenderItem,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

// 1. 使用memo优化列表项
const ProductItem = memo<{ item: Product; onPress: (id: string) => void }>(
  ({ item, onPress }) => {
    console.log(`Rendering ${item.name}`);

    const handlePress = useCallback(() => {
      onPress(item.id);
    }, [item.id, onPress]);

    return (
      <View style={styles.item}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          // 懒加载图片
          resizeMode="cover"
          // 降低图片质量
          defaultSource={require('./placeholder.png')}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text>Buy</Text>
        </TouchableOpacity>
      </View>
    );
  },
  // 自定义比较函数
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.price === nextProps.item.price &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

function OptimizedProductList({ products }: { products: Product[] }) {
  // 2. 使用useCallback稳定回调
  const handlePress = useCallback((id: string) => {
    console.log('Product pressed:', id);
    // 导航或其他操作
  }, []);

  // 3. 提取renderItem
  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => <ProductItem item={item} onPress={handlePress} />,
    [handlePress]
  );

  // 4. 使用keyExtractor
  const keyExtractor = useCallback((item: Product) => item.id, []);

  // 5. getItemLayout优化（固定高度时）
  const getItemLayout = useCallback(
    (data: Product[] | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // 性能优化配置
      initialNumToRender={10} // 初始渲染数量
      maxToRenderPerBatch={10} // 每批渲染数量
      windowSize={5} // 视窗大小
      removeClippedSubviews={true} // 移除屏幕外视图
      updateCellsBatchingPeriod={50} // 批量更新周期
      // 避免闪烁
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
      // 优化滚动性能
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
      // 列表头尾
      ListHeaderComponent={<ListHeader />}
      ListFooterComponent={<ListFooter />}
      ListEmptyComponent={<EmptyState />}
      // 分隔线
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const ITEM_HEIGHT = 120;

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  button: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
```

### 3.2 图片优化

```typescript
// 图片加载优化

import React, { useState, useCallback } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

// 1. 使用Fast Image (原生缓存)
function OptimizedImage({ uri, style }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
  }, []);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  return (
    <View style={style}>
      <FastImage
        source={{
          uri,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        style={StyleSheet.absoluteFill}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text>Failed to load</Text>
        </View>
      )}
    </View>
  );
}

// 2. 图片预加载
function preloadImages(urls: string[]) {
  FastImage.preload(
    urls.map(url => ({
      uri: url,
      priority: FastImage.priority.high,
    }))
  );
}

// 使用示例
function ProductGallery({ images }) {
  useEffect(() => {
    // 预加载即将显示的图片
    preloadImages(images.slice(0, 5));
  }, [images]);

  return (
    <FlatList
      data={images}
      renderItem={({ item }) => (
        <OptimizedImage uri={item.url} style={styles.image} />
      )}
      horizontal
      pagingEnabled
    />
  );
}

// 3. 响应式图片（根据屏幕密度选择）
import { PixelRatio, Dimensions } from 'react-native';

function getOptimalImageSize(baseWidth: number) {
  const pixelRatio = PixelRatio.get();
  const screenWidth = Dimensions.get('window').width;

  // 根据设备选择合适的图片尺寸
  if (pixelRatio >= 3) {
    return baseWidth * 3; // @3x
  } else if (pixelRatio >= 2) {
    return baseWidth * 2; // @2x
  } else {
    return baseWidth; // @1x
  }
}

function ResponsiveImage({ baseUrl, width }) {
  const optimalWidth = getOptimalImageSize(width);
  const uri = `${baseUrl}?w=${optimalWidth}&q=80`; // 添加质量参数

  return <FastImage source={{ uri }} style={{ width, height: width }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 300,
  },
});
```

### 3.3 内存优化

```typescript
// 内存泄漏预防

import { useEffect, useRef, useState } from 'react';

// 1. 正确清理事件监听
function useEventListener(eventName: string, handler: Function) {
  useEffect(() => {
    const subscription = EventEmitter.addListener(eventName, handler);

    // 组件卸载时清理
    return () => {
      subscription.remove();
    };
  }, [eventName, handler]);
}

// 2. 清理定时器
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

// 3. 取消未完成的异步请求
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);

    fetch(url, { signal: abortController.signal })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}

// 4. 清理大对象引用
function LargeDataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 加载大量数据
    const largeData = loadHugeDataset();
    setData(largeData);

    return () => {
      // 清理引用
      setData(null);
    };
  }, []);

  return <View>{/* 渲染 */}</View>;
}

// 5. 监控内存使用
import { useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';

function useMemoryWarning() {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const subscription = NativeModules.DeviceEventEmitter.addListener(
        'memoryWarning',
        () => {
          console.warn('Memory warning received!');
          // 清理缓存、释放资源
          clearCaches();
        }
      );

      return () => subscription.remove();
    }
  }, []);
}

function clearCaches() {
  // 清理图片缓存
  FastImage.clearMemoryCache();
  FastImage.clearDiskCache();

  // 清理其他缓存
  // ...
}
```

---

## 第四章：动画系统

### 4.1 Reanimated 2基础

```typescript
// Reanimated 2 - 高性能动画库

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// 1. 基础动画
function BasicAnimation() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const handlePress = () => {
    // 弹簧动画
    offset.value = withSpring(Math.random() * 200);
  };

  return (
    <View>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button title="Animate" onPress={handlePress} />
    </View>
  );
}

// 2. 复杂动画序列
function SequenceAnimation() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  const startAnimation = () => {
    // 串行动画
    scale.value = withSequence(
      withTiming(1.5, { duration: 500 }),
      withTiming(1, { duration: 500 })
    );

    // 并行动画
    rotation.value = withTiming(360, { duration: 1000 });

    // 延迟动画
    opacity.value = withDelay(
      500,
      withTiming(0.5, { duration: 500 })
    );
  };

  return (
    <View>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button title="Start" onPress={startAnimation} />
    </View>
  );
}

// 3. 手势驱动动画
function DraggableBox() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      // 回弹到原位
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.box, animatedStyles]} />
    </GestureDetector>
  );
}

// 4. 插值动画
function ScrollAnimation() {
  const scrollY = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 200],
      [200, 60],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
      opacity,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -50],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale }
      ],
    };
  });

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Text style={[styles.title, titleStyle]}>
          Header Title
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        {/* 内容 */}
      </Animated.ScrollView>
    </View>
  );
}

// 5. 循环动画
function LoadingAnimation() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1, // 无限循环
      false // 不反向
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.spinner, animatedStyles]} />
  );
}
```

### 4.2 实战动画案例

```typescript
// 底部抽屉动画
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

function BottomSheet({ children }) {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        event.translationY + context.value.y,
        MAX_TRANSLATE_Y
      );
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(0, { damping: 50 });
        runOnJS(setIsOpen)(false);
      } else {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
        runOnJS(setIsOpen)(true);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const toggleSheet = () => {
    if (isOpen) {
      translateY.value = withSpring(0, { damping: 50 });
      setIsOpen(false);
    } else {
      translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      setIsOpen(true);
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        {/* 主内容 */}
        <Button title="Toggle Sheet" onPress={toggleSheet} />
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 2,
  },
});
```

---

由于篇幅限制，我将继续完成剩余章节并创建最后一个文档。让我继续...