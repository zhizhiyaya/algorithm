# React Hooks 原理与源码解析

> 深入理解Hooks底层实现机制 - 基于React 18.2源码

## 目录

- [第一章：Fiber架构基础](#第一章fiber架构基础)
- [第二章：Hooks数据结构](#第二章hooks数据结构)
- [第三章：useState源码解析](#第三章usestate源码解析)
- [第四章：useEffect源码解析](#第四章useeffect源码解析)
- [第五章：useReducer源码解析](#第五章usereducer源码解析)
- [第六章：Hooks调用链路](#第六章hooks调用链路)
- [第七章：为什么要遵守Hooks规则](#第七章为什么要遵守hooks规则)
- [第八章：调度和更新机制](#第八章调度和更新机制)

---

## 第一章：Fiber架构基础

### 1.1 什么是Fiber

Fiber是React 16引入的全新架构，解决了React 15的以下问题：

```javascript
// React 15 - Stack Reconciler
// 问题：递归遍历，无法中断
function reconcile(element) {
  // 递归调用，一旦开始无法停止
  const children = element.children;
  for (let child of children) {
    reconcile(child); // 深度优先，同步递归
  }
  // 长任务会阻塞主线程，导致卡顿
}

// React 16+ - Fiber Reconciler
// 解决方案：可中断的遍历
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // 时间片用完
  }

  // 如果还有工作，继续调度
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
}
```

### 1.2 Fiber数据结构

```typescript
// packages/react-reconciler/src/ReactInternalTypes.js
export type Fiber = {
  // 类型信息
  tag: WorkTag, // 标识fiber类型：函数组件、类组件、原生DOM等
  type: any,    // 对于函数组件，就是函数本身
  key: null | string,

  // 结构信息（树形结构）
  return: Fiber | null,        // 父fiber
  child: Fiber | null,         // 第一个子fiber
  sibling: Fiber | null,       // 下一个兄弟fiber
  index: number,

  // 状态信息
  memoizedState: any,    // 当前状态（对于函数组件，是Hooks链表）
  memoizedProps: any,    // 当前props
  pendingProps: any,     // 新的props

  // 副作用信息
  flags: Flags,          // 副作用标记：更新、删除、插入等
  subtreeFlags: Flags,   // 子树的副作用
  deletions: Array<Fiber> | null,

  // 更新队列
  updateQueue: any,      // 存储state更新

  // 双缓存
  alternate: Fiber | null, // 指向另一棵树的对应fiber
};
```

### 1.3 双缓存机制

```javascript
// React维护两棵Fiber树：current树和workInProgress树

// current树：当前屏幕上显示的UI对应的Fiber树
// workInProgress树：正在构建的新Fiber树

function render() {
  // 1. 从current树创建workInProgress树
  workInProgress = createWorkInProgress(current);

  // 2. 在workInProgress树上进行更新
  performWork(workInProgress);

  // 3. commit阶段：将workInProgress树切换为current树
  root.current = workInProgress;
}

// 示例：更新流程
/*
初始渲染：
  null  ----→  Fiber A (workInProgress)
                ↓
               Fiber B
                ↓
               Fiber C

渲染完成（提交后）：
  Fiber A (current)  ←----  Fiber A (workInProgress, 已废弃)
    ↓
  Fiber B
    ↓
  Fiber C

下次更新：
  Fiber A (current)  ←→  Fiber A' (workInProgress, 复用或创建)
    ↓                      ↓
  Fiber B                Fiber B' (新建或复用)
    ↓                      ↓
  Fiber C                Fiber C' (新建或复用)

通过alternate字段连接：current.alternate = workInProgress
*/
```

### 1.4 函数组件的Fiber节点

```javascript
// 对于函数组件
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// 对应的Fiber节点
const fiber = {
  tag: FunctionComponent, // 标识这是函数组件
  type: Counter,          // 函数本身
  memoizedState: {        // Hooks链表
    // Hook 0: useState
    memoizedState: 0,     // 当前状态值
    next: {               // 下一个Hook
      // Hook 1: 如果有第二个Hook
      memoizedState: ...,
      next: null
    }
  },
  memoizedProps: {},      // props
  // ...其他字段
};
```

---

## 第二章：Hooks数据结构

### 2.1 Hook对象结构

```typescript
// packages/react-reconciler/src/ReactFiberHooks.js
export type Hook = {
  memoizedState: any,      // 当前状态值
  baseState: any,          // 基础状态
  baseQueue: Update<any, any> | null,  // 基础更新队列
  queue: UpdateQueue<any, any> | null, // 更新队列
  next: Hook | null,       // 指向下一个Hook
};

// 不同Hook的memoizedState存储不同内容：
// - useState/useReducer: state值
// - useEffect: effect对象
// - useMemo: [cachedValue, deps]
// - useRef: { current: value }
```

### 2.2 Hooks链表

```javascript
// Hooks通过链表存储在fiber.memoizedState上

function Component() {
  const [count, setCount] = useState(0);        // Hook 0
  const [name, setName] = useState('Alice');    // Hook 1
  useEffect(() => {}, [count]);                 // Hook 2
  const value = useMemo(() => count * 2, [count]); // Hook 3
}

// 对应的Hooks链表
/*
fiber.memoizedState
  ↓
Hook 0 (useState: count)
  memoizedState: 0
  queue: { pending: null, dispatch: setCount }
  next: ↓

Hook 1 (useState: name)
  memoizedState: 'Alice'
  queue: { pending: null, dispatch: setName }
  next: ↓

Hook 2 (useEffect)
  memoizedState: {
    tag: HookHasEffect,
    create: () => {},
    destroy: undefined,
    deps: [0],
    next: null
  }
  next: ↓

Hook 3 (useMemo)
  memoizedState: [0, [0]]  // [cachedValue, deps]
  next: null
*/
```

### 2.3 全局状态

```javascript
// React内部维护的全局状态
let currentlyRenderingFiber = null;  // 当前正在渲染的fiber
let currentHook = null;              // 当前正在处理的Hook
let workInProgressHook = null;       // 正在工作的Hook

// 渲染阶段切换
let ReactCurrentDispatcher = {
  current: null
};

// mount阶段使用的Hooks实现
const HooksDispatcherOnMount = {
  useState: mountState,
  useEffect: mountEffect,
  useReducer: mountReducer,
  // ...
};

// update阶段使用的Hooks实现
const HooksDispatcherOnUpdate = {
  useState: updateState,
  useEffect: updateEffect,
  useReducer: updateReducer,
  // ...
};
```

---

## 第三章：useState源码解析

### 3.1 mountState - 首次渲染

```javascript
// packages/react-reconciler/src/ReactFiberHooks.js

function mountState(initialState) {
  // 1. 创建Hook对象
  const hook = mountWorkInProgressHook();

  // 2. 处理初始state（可能是函数）
  if (typeof initialState === 'function') {
    initialState = initialState();
  }

  // 3. 保存初始state
  hook.memoizedState = initialState;
  hook.baseState = initialState;

  // 4. 创建更新队列
  const queue = {
    pending: null,           // 待处理的更新
    lanes: NoLanes,
    dispatch: null,          // dispatch函数
    lastRenderedReducer: basicStateReducer, // 基础reducer
    lastRenderedState: initialState,
  };
  hook.queue = queue;

  // 5. 创建dispatch函数（绑定queue和fiber）
  const dispatch = (queue.dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber, // 闭包保存当前fiber
    queue
  ));

  // 6. 返回[state, setState]
  return [hook.memoizedState, dispatch];
}

// 创建新的Hook对象
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // 第一个Hook，挂载到fiber上
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 后续Hook，连接到链表
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}
```

### 3.2 dispatchSetState - 触发更新

```javascript
function dispatchSetState(fiber, queue, action) {
  // 1. 获取当前渲染的lane（优先级）
  const lane = requestUpdateLane(fiber);

  // 2. 创建update对象
  const update = {
    lane,              // 优先级
    action,            // setState的参数（新值或函数）
    hasEagerState: false,  // 是否已计算
    eagerState: null,  // 提前计算的state
    next: null,        // 指向下一个update
  };

  // 3. 判断是否在渲染阶段
  if (fiber === currentlyRenderingFiber) {
    // 在渲染阶段调用setState，加入队列等待
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    // 4. 尝试提前计算（eagerState优化）
    const alternate = fiber.alternate;

    // 如果fiber没有更新，且队列为空
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      const lastRenderedReducer = queue.lastRenderedReducer;

      if (lastRenderedReducer !== null) {
        try {
          const currentState = queue.lastRenderedState;
          // 提前计算新state
          const eagerState = lastRenderedReducer(currentState, action);

          update.hasEagerState = true;
          update.eagerState = eagerState;

          // 如果state没变化，直接返回
          if (Object.is(eagerState, currentState)) {
            return; // 🎯 性能优化：避免无意义的更新
          }
        } catch (error) {
          // 计算失败，正常流程处理
        }
      }
    }

    // 5. 将update加入队列
    const pending = queue.pending;

    if (pending === null) {
      // 第一个update，创建环形链表
      update.next = update;
    } else {
      // 插入到环形链表
      update.next = pending.next;
      pending.next = update;
    }
    queue.pending = update;

    // 6. 调度更新
    scheduleUpdateOnFiber(fiber, lane);
  }
}
```

### 3.3 updateState - 重新渲染

```javascript
function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function updateReducer(reducer, initialArg) {
  // 1. 获取当前Hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  // 2. 处理更新队列
  const pending = queue.pending;

  if (pending !== null) {
    // 2.1 合并baseQueue和pending
    const first = pending.next; // 环形链表的第一个
    let newState = hook.baseState; // 从baseState开始计算

    let update = first;
    do {
      // 2.2 应用每个update
      const action = update.action;

      if (typeof action === 'function') {
        // setState(prev => prev + 1)
        newState = action(newState);
      } else {
        // setState(5)
        newState = action;
      }

      update = update.next;
    } while (update !== first);

    // 2.3 保存计算结果
    hook.memoizedState = newState;
    hook.baseState = newState;
    queue.pending = null;
  }

  // 3. 返回[state, dispatch]
  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

// 获取已有的Hook
function updateWorkInProgressHook() {
  // 从current树复制Hook到workInProgress树
  let nextCurrentHook;

  if (currentHook === null) {
    // 第一个Hook
    const current = currentlyRenderingFiber.alternate;
    nextCurrentHook = current.memoizedState;
  } else {
    // 后续Hook
    nextCurrentHook = currentHook.next;
  }

  currentHook = nextCurrentHook;

  // 创建新的Hook对象（复用或创建）
  const newHook = {
    memoizedState: currentHook.memoizedState,
    baseState: currentHook.baseState,
    baseQueue: currentHook.baseQueue,
    queue: currentHook.queue,
    next: null,
  };

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }

  return workInProgressHook;
}
```

### 3.4 批量更新机制

```javascript
// React 18自动批处理

function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // React 18之前：事件处理中批量
    setCount(c => c + 1);  // update 1
    setFlag(f => !f);      // update 2
    // 只触发一次重渲染

    // React 18之前：Promise中不批量
    fetch('/api').then(() => {
      setCount(c => c + 1);  // update 1 -> 渲染1
      setFlag(f => !f);      // update 2 -> 渲染2
    });

    // React 18：所有更新都自动批量
    setTimeout(() => {
      setCount(c => c + 1);  // update 1
      setFlag(f => !f);      // update 2
      // 只触发一次重渲染
    }, 1000);
  }

  return <button onClick={handleClick}>Click</button>;
}

// 实现原理：executionContext标记
let executionContext = NoContext;

function batchedUpdates(fn) {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext; // 设置批处理标记

  try {
    return fn(); // 执行用户代码
  } finally {
    executionContext = prevExecutionContext;

    // 批处理结束，统一触发更新
    if (executionContext === NoContext) {
      flushSyncCallbackQueue();
    }
  }
}
```

---

## 第四章：useEffect源码解析

### 4.1 Effect数据结构

```typescript
type Effect = {
  tag: HookFlags,          // effect类型标记
  create: () => (() => void) | void, // effect函数
  destroy: (() => void) | void,      // 清理函数
  deps: Array<any> | null, // 依赖数组
  next: Effect,            // 下一个effect（环形链表）
};

// Effect标记
const NoFlags = 0b0000;
const HasEffect = 0b0001;  // 有副作用需要执行
const Layout = 0b0010;     // useLayoutEffect
const Passive = 0b0100;    // useEffect
```

### 4.2 mountEffect - 首次渲染

```javascript
function mountEffect(create, deps) {
  return mountEffectImpl(
    PassiveEffect | PassiveStaticEffect, // 副作用标记
    HookPassive,                         // Hook标记
    create,
    deps
  );
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  // 1. 创建Hook
  const hook = mountWorkInProgressHook();

  const nextDeps = deps === undefined ? null : deps;

  // 2. 给fiber添加副作用标记
  currentlyRenderingFiber.flags |= fiberFlags;

  // 3. 创建effect对象并存储
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags, // 标记需要执行
    create,
    undefined, // mount阶段没有destroy
    nextDeps
  );
}

function pushEffect(tag, create, destroy, deps) {
  // 创建effect对象
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next: null,
  };

  // 获取fiber的updateQueue（effect链表）
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue;

  if (componentUpdateQueue === null) {
    // 第一个effect
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = componentUpdateQueue;

    componentUpdateQueue.lastEffect = effect.next = effect; // 环形链表
  } else {
    // 添加到effect链表
    const lastEffect = componentUpdateQueue.lastEffect;

    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }

  return effect;
}
```

### 4.3 updateEffect - 重新渲染

```javascript
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  // 1. 获取当前Hook
  const hook = updateWorkInProgressHook();

  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    // 2. 获取上一次的effect
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy; // 上一次的清理函数

    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;

      // 3. 🎯 核心：比较依赖是否变化
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 依赖没变，不需要执行effect
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return; // 注意：没有HookHasEffect标记
      }
    }
  }

  // 4. 依赖变化了，需要执行effect
  currentlyRenderingFiber.flags |= fiberFlags;

  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags, // 标记需要执行
    create,
    destroy,
    nextDeps
  );
}

// 比较依赖数组
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return false;
  }

  // 逐个比较（使用Object.is）
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }

  return true;
}
```

### 4.4 执行Effect - Commit阶段

```javascript
// Commit阶段执行effect

function commitRoot(root) {
  // 1. before mutation阶段
  commitBeforeMutationEffects(root);

  // 2. mutation阶段 - 操作DOM
  commitMutationEffects(root);

  // 3. layout阶段 - useLayoutEffect执行
  commitLayoutEffects(root);

  // 4. 调度useEffect（异步执行）
  scheduleCallback(NormalPriority, () => {
    flushPassiveEffects(); // 执行useEffect
  });
}

function flushPassiveEffects() {
  // 1. 先执行所有effect的destroy（上一次的清理函数）
  commitPassiveUnmountEffects(root);

  // 2. 再执行所有effect的create（新的副作用）
  commitPassiveMountEffects(root);
}

function commitPassiveUnmountEffects(fiber) {
  // 遍历fiber树
  if (fiber.tag === FunctionComponent) {
    const updateQueue = fiber.updateQueue;

    if (updateQueue !== null) {
      const lastEffect = updateQueue.lastEffect;

      if (lastEffect !== null) {
        const firstEffect = lastEffect.next;
        let effect = firstEffect;

        // 遍历effect链表
        do {
          const { tag, destroy } = effect;

          if ((tag & HookHasEffect) !== NoFlags) {
            if ((tag & HookPassive) !== NoFlags) {
              // 执行清理函数
              if (destroy !== undefined) {
                try {
                  destroy();
                } catch (error) {
                  captureCommitPhaseError(fiber, error);
                }
              }
            }
          }

          effect = effect.next;
        } while (effect !== firstEffect);
      }
    }
  }

  // 递归子节点
  if (fiber.child !== null) {
    commitPassiveUnmountEffects(fiber.child);
  }

  if (fiber.sibling !== null) {
    commitPassiveUnmountEffects(fiber.sibling);
  }
}

function commitPassiveMountEffects(fiber) {
  // 类似unmount，但执行create函数
  if (fiber.tag === FunctionComponent) {
    const updateQueue = fiber.updateQueue;

    if (updateQueue !== null) {
      const lastEffect = updateQueue.lastEffect;

      if (lastEffect !== null) {
        const firstEffect = lastEffect.next;
        let effect = firstEffect;

        do {
          const { tag, create } = effect;

          if ((tag & HookHasEffect) !== NoFlags) {
            if ((tag & HookPassive) !== NoFlags) {
              // 执行副作用函数
              try {
                const destroy = create();
                effect.destroy = destroy; // 保存清理函数
              } catch (error) {
                captureCommitPhaseError(fiber, error);
              }
            }
          }

          effect = effect.next;
        } while (effect !== firstEffect);
      }
    }
  }

  // 递归
  if (fiber.child !== null) {
    commitPassiveMountEffects(fiber.child);
  }

  if (fiber.sibling !== null) {
    commitPassiveMountEffects(fiber.sibling);
  }
}
```

### 4.5 useLayoutEffect vs useEffect

```javascript
// 执行时机不同

// useLayoutEffect: 同步执行，阻塞渲染
function commitLayoutEffects(root) {
  let fiber = root.current;

  while (fiber !== null) {
    if (fiber.tag === FunctionComponent) {
      const updateQueue = fiber.updateQueue;

      if (updateQueue !== null) {
        const lastEffect = updateQueue.lastEffect;

        if (lastEffect !== null) {
          const firstEffect = lastEffect.next;
          let effect = firstEffect;

          do {
            const { tag, create, destroy } = effect;

            // useLayoutEffect标记
            if ((tag & HookLayout) !== NoFlags) {
              // 同步执行destroy
              if (destroy !== undefined) {
                destroy();
              }

              // 同步执行create
              const nextDestroy = create();
              effect.destroy = nextDestroy;
            }

            effect = effect.next;
          } while (effect !== firstEffect);
        }
      }
    }

    fiber = fiber.child;
  }
}

// 执行顺序示例
function Component() {
  useLayoutEffect(() => {
    console.log('3. useLayoutEffect - 同步执行');
    return () => console.log('6. useLayoutEffect cleanup');
  });

  useEffect(() => {
    console.log('4. useEffect - 异步执行');
    return () => console.log('7. useEffect cleanup');
  });

  console.log('1. render');
  return <div>Hello</div>;
}

/*
首次渲染：
1. render
2. DOM更新
3. useLayoutEffect - 同步执行
4. 浏览器绘制
5. useEffect - 异步执行

更新时：
1. render
2. DOM更新
3. useLayoutEffect cleanup
4. useLayoutEffect - 同步执行
5. 浏览器绘制
6. useEffect cleanup
7. useEffect - 异步执行
*/
```

---

## 第五章：useReducer源码解析

### 5.1 mountReducer

```javascript
function mountReducer(reducer, initialArg, init) {
  // 1. 创建Hook
  const hook = mountWorkInProgressHook();

  // 2. 处理初始state
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg); // 惰性初始化
  } else {
    initialState = initialArg;
  }

  hook.memoizedState = initialState;
  hook.baseState = initialState;

  // 3. 创建更新队列
  const queue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState,
  };
  hook.queue = queue;

  // 4. 创建dispatch
  const dispatch = (queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));

  return [hook.memoizedState, dispatch];
}
```

### 5.2 dispatchReducerAction

```javascript
function dispatchReducerAction(fiber, queue, action) {
  const lane = requestUpdateLane(fiber);

  // 创建update
  const update = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: null,
  };

  // 判断是否在渲染阶段
  if (fiber === currentlyRenderingFiber) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    // 加入更新队列
    const pending = queue.pending;

    if (pending === null) {
      update.next = update;
    } else {
      update.next = pending.next;
      pending.next = update;
    }
    queue.pending = update;

    // 调度更新
    scheduleUpdateOnFiber(fiber, lane);
  }
}
```

### 5.3 updateReducer

```javascript
function updateReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  queue.lastRenderedReducer = reducer;

  const current = currentHook;
  let baseQueue = current.baseQueue;

  // 合并pending和baseQueue
  const pendingQueue = queue.pending;

  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      // 两个队列都有更新，合并
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }

    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  // 处理更新队列
  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;

    do {
      const updateLane = update.lane;

      // 检查优先级
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // 优先级不够，跳过这个update
        const clone = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: null,
        };

        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane
        );
      } else {
        // 优先级足够，应用update
        if (newBaseQueueLast !== null) {
          const clone = {
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null,
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        // 🎯 核心：调用reducer计算新state
        if (update.hasEagerState) {
          newState = update.eagerState;
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }

      update = update.next;
    } while (update !== null && update !== first);

    // 保存结果
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }

    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}
```

---

## 第六章：Hooks调用链路

### 6.1 渲染流程

```javascript
// 完整的Hooks调用链路

// 1. 开始渲染函数组件
function renderWithHooks(
  current,           // current树的fiber
  workInProgress,    // workInProgress树的fiber
  Component,         // 组件函数
  props,             // props
  secondArg,
  nextRenderLanes    // 优先级
) {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber = workInProgress;

  // 清空状态
  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes;

  // 2. 🎯 关键：根据mount/update切换Hooks实现
  ReactCurrentDispatcher.current =
    current === null || current.memoizedState === null
      ? HooksDispatcherOnMount    // 首次渲染
      : HooksDispatcherOnUpdate;  // 更新渲染

  // 3. 执行组件函数
  let children = Component(props, secondArg);

  // 4. 重置状态
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  currentlyRenderingFiber = null;
  currentHook = null;
  workInProgressHook = null;

  renderLanes = NoLanes;

  return children;
}

// 2. Hooks调用
export function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState); // 根据阶段调用不同实现
}

function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;

  if (dispatcher === null) {
    throw new Error(
      'Hooks can only be called inside the body of a function component.'
    );
  }

  return dispatcher;
}
```

### 6.2 完整示例

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Alice');

  useEffect(() => {
    document.title = `${name}: ${count}`;
  }, [name, count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {name}: {count}
    </button>
  );
}

/*
首次渲染流程：

1. renderWithHooks开始
   - currentlyRenderingFiber = fiber
   - ReactCurrentDispatcher.current = HooksDispatcherOnMount

2. 执行Counter()
   2.1 useState(0)
       → dispatcher.useState (mountState)
       → 创建Hook 0
       → 返回 [0, setCount]

   2.2 useState('Alice')
       → dispatcher.useState (mountState)
       → 创建Hook 1
       → 返回 ['Alice', setName]

   2.3 useEffect(...)
       → dispatcher.useEffect (mountEffect)
       → 创建Hook 2
       → 创建Effect对象

   2.4 返回JSX

3. renderWithHooks结束
   - 重置全局状态

4. Commit阶段
   - DOM更新
   - 异步执行useEffect

Hooks链表结构：
fiber.memoizedState → Hook 0 (count) → Hook 1 (name) → Hook 2 (effect) → null

更新流程：

1. 用户点击按钮
   → setCount(c => c + 1)
   → dispatchSetState
   → 创建update对象
   → scheduleUpdateOnFiber

2. 开始新的渲染
   - ReactCurrentDispatcher.current = HooksDispatcherOnUpdate

3. 执行Counter()
   3.1 useState(0)
       → dispatcher.useState (updateState)
       → 从Hook 0读取state
       → 应用update
       → 返回 [1, setCount]

   3.2 useState('Alice')
       → dispatcher.useState (updateState)
       → 从Hook 1读取state
       → 返回 ['Alice', setName]

   3.3 useEffect(...)
       → dispatcher.useEffect (updateEffect)
       → 比较依赖 [name, count]
       → 依赖变化，标记需要执行

4. Commit阶段
   - DOM更新
   - 异步执行useEffect
*/
```

---

## 第七章：为什么要遵守Hooks规则

### 7.1 规则1：只在顶层调用

```javascript
// ❌ 错误：条件调用导致Hooks顺序不一致
function BadComponent({ show }) {
  if (show) {
    const [a, setA] = useState(0); // 💥 Hook 0 或 不存在
  }
  const [b, setB] = useState(1);   // 💥 Hook 0 或 Hook 1

  return <div />;
}

/*
首次渲染 (show = true):
  Hook 0: useState(a)
  Hook 1: useState(b)

第二次渲染 (show = false):
  Hook 0: useState(b)  💥 错位！

React内部：
  - updateWorkInProgressHook按顺序从链表读取
  - 顺序错乱导致读取到错误的Hook
  - 类型不匹配，state混乱
*/

// ✅ 正确：Hooks在顶层，顺序一致
function GoodComponent({ show }) {
  const [a, setA] = useState(0);   // 始终是 Hook 0
  const [b, setB] = useState(1);   // 始终是 Hook 1

  if (show) {
    // 在条件中使用state，而不是声明Hook
    setA(10);
  }

  return <div />;
}
```

### 7.2 规则2：只在React函数中调用

```javascript
// ❌ 错误：在普通函数中调用
function fetchData() {
  const [data, setData] = useState(null); // 💥 没有currentlyRenderingFiber
  // ...
}

function Component() {
  fetchData(); // 💥 错误
  return <div />;
}

/*
问题：
  - currentlyRenderingFiber = null
  - 无法挂载Hook到fiber上
  - React无法追踪状态
*/

// ✅ 正确：在组件或自定义Hook中调用
function useFetchData() {
  const [data, setData] = useState(null);
  // ...
  return data;
}

function Component() {
  const data = useFetchData(); // ✅ 正确
  return <div />;
}
```

### 7.3 顺序一致性原理

```javascript
// React内部通过链表和索引维护Hooks

// Mount阶段
function mountState(initialState) {
  const hook = {
    memoizedState: initialState,
    queue: ...,
    next: null,
  };

  // 按顺序连接到链表
  if (workInProgressHook === null) {
    // 第一个Hook
    workInProgressHook = hook;
  } else {
    // 后续Hook
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }

  return [hook.memoizedState, dispatch];
}

// Update阶段
function updateState() {
  // 🎯 核心：按顺序从链表读取
  let nextCurrentHook;

  if (currentHook === null) {
    nextCurrentHook = currentlyRenderingFiber.alternate.memoizedState; // 第一个
  } else {
    nextCurrentHook = currentHook.next; // 下一个
  }

  currentHook = nextCurrentHook;

  // 如果顺序不一致，这里就会读取到错误的Hook
  // 例如：期望useState，实际读到useEffect
}
```

---

## 第八章：调度和更新机制

### 8.1 Lane模型（优先级）

```javascript
// React 18使用Lane模型管理优先级

export const NoLanes = 0b0000000000000000000000000000000;
export const SyncLane = 0b0000000000000000000000000000001;

export const InputContinuousLane = 0b0000000000000000000000000000100;

export const DefaultLane = 0b0000000000000000000000000010000;

export const IdleLane = 0b0100000000000000000000000000000;

// 优先级划分：
// 1. 同步优先级：用户输入、点击等
// 2. 连续输入优先级：滚动、拖拽等
// 3. 默认优先级：数据请求、setTimeout等
// 4. 空闲优先级：分析、日志等

// 获取更新优先级
function requestUpdateLane(fiber) {
  const mode = fiber.mode;

  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane; // 同步模式
  }

  // 从事件优先级映射到Lane
  const eventPriority = getCurrentEventPriority();

  switch (eventPriority) {
    case DiscreteEventPriority:
      return SyncLane;
    case ContinuousEventPriority:
      return InputContinuousLane;
    case DefaultEventPriority:
      return DefaultLane;
    case IdleEventPriority:
      return IdleLane;
    default:
      return DefaultLane;
  }
}
```

### 8.2 调度更新

```javascript
function scheduleUpdateOnFiber(fiber, lane) {
  // 1. 标记fiber的lanes
  fiber.lanes = mergeLanes(fiber.lanes, lane);

  // 2. 向上标记祖先的childLanes
  let node = fiber.return;
  while (node !== null) {
    node.childLanes = mergeLanes(node.childLanes, lane);
    node = node.return;
  }

  // 3. 标记root的pendingLanes
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  root.pendingLanes |= lane;

  // 4. 调度渲染
  if (lane === SyncLane) {
    // 同步更新：立即执行
    performSyncWorkOnRoot(root);
  } else {
    // 并发更新：调度异步任务
    ensureRootIsScheduled(root);
  }
}

function ensureRootIsScheduled(root) {
  // 获取最高优先级的lane
  const nextLanes = getNextLanes(root, NoLanes);

  if (nextLanes === NoLanes) {
    return; // 没有待处理的更新
  }

  // 获取对应的Scheduler优先级
  const schedulerPriority = lanesToSchedulerPriority(nextLanes);

  // 使用Scheduler调度
  const callback = performConcurrentWorkOnRoot.bind(null, root);
  scheduleCallback(schedulerPriority, callback);
}
```

### 8.3 并发渲染

```javascript
// React 18的并发特性

// Transition API
import { startTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  function handleChange(e) {
    // 高优先级：立即更新input
    setInput(e.target.value);

    // 低优先级：可中断的更新
    startTransition(() => {
      setList(generateList(e.target.value)); // 可能很慢
    });
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <Spinner />}
      <List items={list} />
    </div>
  );
}

// useDeferredValue
function SearchResults({ query }) {
  // 延迟更新，保持响应性
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    return expensiveSearch(deferredQuery); // 基于延迟值计算
  }, [deferredQuery]);

  return <ResultList results={results} />;
}
```

### 8.4 批量更新原理

```javascript
// React 18自动批处理

let executionContext = NoContext;
const BatchedContext = 0b0001;
const RenderContext = 0b0010;
const CommitContext = 0b0100;

// 批处理实现
function batchedUpdates(fn, a) {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;

  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // 批处理结束，刷新所有更新
      flushSyncCallbacksOnlyInLegacyMode();
    }
  }
}

// 示例：多个setState
function handleClick() {
  // 所有setState都在同一个批次
  setCount(c => c + 1);    // 不触发渲染
  setName('Bob');          // 不触发渲染
  setFlag(f => !f);        // 不触发渲染

  // batchedUpdates结束后，统一触发一次渲染
}

// React 18自动批处理Promise
fetch('/api').then(() => {
  // React 18之前：每个setState触发一次渲染
  // React 18：自动批处理
  setCount(c => c + 1);
  setName('Bob');
  // 只触发一次渲染
});
```

---

## 总结

### Hooks底层核心原理

1. **Fiber树**：双缓存机制，支持可中断渲染
2. **Hooks链表**：按顺序存储在fiber.memoizedState
3. **Dispatcher切换**：mount/update使用不同实现
4. **更新队列**：环形链表存储state更新
5. **Effect链表**：环形链表存储副作用
6. **Lane优先级**：位掩码管理更新优先级
7. **批量更新**：executionContext控制批处理

### 为什么有这些规则

1. **顶层调用**：保证Hooks顺序一致，链表读取正确
2. **React函数中调用**：需要currentlyRenderingFiber挂载状态
3. **依赖数组**：手动声明依赖，React无法自动追踪闭包

### 性能优化点

1. **eagerState**：相同state不触发更新
2. **批量更新**：多个setState合并为一次渲染
3. **依赖比较**：Object.is判断effect是否执行
4. **优先级调度**：高优先级更新优先执行

---

**推荐阅读**
- React源码：https://github.com/facebook/react
- React Fiber架构：https://github.com/acdlite/react-fiber-architecture
- Lane模型：https://github.com/facebook/react/pull/18796
- Concurrent模式：https://react.dev/blog/2022/03/29/react-v18

下一章：自定义Hooks开发实战
