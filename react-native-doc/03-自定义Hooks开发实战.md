# 自定义Hooks开发实战

> 20+实用自定义Hooks实现与设计模式

## 目录

1. [设计原则与最佳实践](#设计原则与最佳实践)
2. [状态管理类Hooks](#状态管理类hooks)
3. [副作用管理类Hooks](#副作用管理类hooks)
4. [数据获取类Hooks](#数据获取类hooks)
5. [DOM/BOM操作类Hooks](#dombom操作类hooks)
6. [性能优化类Hooks](#性能优化类hooks)
7. [工具类Hooks](#工具类hooks)
8. [React Native专用Hooks](#react-native专用hooks)
9. [测试自定义Hooks](#测试自定义hooks)

---

## 设计原则与最佳实践

### 命名规范
```typescript
// ✅ 使用use前缀
function useWindowSize() {}
function useLocalStorage() {}
function usePrevious() {}

// ❌ 不要省略use
function getWindowSize() {}  // 错误
function localStorage() {}   // 错误
```

### 单一职责
```typescript
// ❌ Hook做太多事情
function useBadHook() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  // 太多无关的状态
}

// ✅ 每个Hook专注一件事
function useUser() {
  const [user, setUser] = useState(null);
  // ...
  return user;
}

function usePosts(userId) {
  const [posts, setPosts] = useState([]);
  // ...
  return posts;
}
```

### 返回值设计
```typescript
// 模式1：数组返回（类似useState）
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle] as const;
}

// 模式2：对象返回（提供更多信息）
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ...

  return { data, loading, error, refetch };
}

// 模式3：单一值返回
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  // ...
  return width;
}
```

---

## 状态管理类Hooks

### 1. useToggle - 布尔切换

```typescript
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse }] as const;
}

// 使用
function Modal() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle();

  return (
    <>
      <button onClick={setTrue}>打开</button>
      <button onClick={toggle}>切换</button>
      {isOpen && <div>Modal Content</div>}
    </>
  );
}
```

### 2. useLocalStorage - 本地存储同步

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 从localStorage读取初始值
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 更新localStorage和状态
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 监听storage事件（跨tab同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// 使用
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      当前主题: {theme}
    </button>
  );
}
```

### 3. useSetState - 对象状态管理

```typescript
function useSetState<T extends object>(
  initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] {
  const [state, setState] = useState<T>(initialState);

  const setMergedState = useCallback(
    (patch: Partial<T> | ((prevState: T) => Partial<T>)) => {
      setState(prevState => {
        const newState = typeof patch === 'function' ? patch(prevState) : patch;
        return { ...prevState, ...newState };
      });
    },
    []
  );

  return [state, setMergedState];
}

// 使用
function UserForm() {
  const [form, setForm] = useSetState({
    name: '',
    email: '',
    age: 0
  });

  return (
    <div>
      <input
        value={form.name}
        onChange={e => setForm({ name: e.target.value })}
      />
      <input
        value={form.email}
        onChange={e => setForm({ email: e.target.value })}
      />
      <input
        type="number"
        value={form.age}
        onChange={e => setForm({ age: parseInt(e.target.value) })}
      />
    </div>
  );
}
```

### 4. useList - 列表操作

```typescript
interface UseListActions<T> {
  push: (item: T) => void;
  remove: (index: number) => void;
  clear: () => void;
  insert: (index: number, item: T) => void;
  update: (index: number, item: T) => void;
  filter: (predicate: (item: T) => boolean) => void;
}

function useList<T>(initialList: T[] = []): [T[], UseListActions<T>] {
  const [list, setList] = useState(initialList);

  const actions: UseListActions<T> = useMemo(() => ({
    push: (item) => setList(prev => [...prev, item]),

    remove: (index) => setList(prev => prev.filter((_, i) => i !== index)),

    clear: () => setList([]),

    insert: (index, item) => setList(prev => [
      ...prev.slice(0, index),
      item,
      ...prev.slice(index)
    ]),

    update: (index, item) => setList(prev =>
      prev.map((val, i) => i === index ? item : val)
    ),

    filter: (predicate) => setList(prev => prev.filter(predicate))
  }), []);

  return [list, actions];
}

// 使用
function TodoList() {
  const [todos, { push, remove, update }] = useList([
    { id: 1, text: '学习React', done: false }
  ]);

  return (
    <div>
      {todos.map((todo, index) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => update(index, { ...todo, done: !todo.done })}
          />
          <span>{todo.text}</span>
          <button onClick={() => remove(index)}>删除</button>
        </div>
      ))}
      <button onClick={() => push({ id: Date.now(), text: '新任务', done: false })}>
        添加
      </button>
    </div>
  );
}
```

---

## 副作用管理类Hooks

### 5. useDebounce - 防抖

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // 调用API搜索
      console.log('搜索:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### 6. useThrottle - 节流

```typescript
function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// 使用
function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 200);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>滚动位置: {throttledScrollY}px</div>;
}
```

### 7. useInterval - 定时器

```typescript
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // 保持callback最新
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// 使用
function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => setCount(c => c + 1),
    isRunning ? 1000 : null
  );

  return (
    <div>
      <p>计时: {count}秒</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '暂停' : '开始'}
      </button>
    </div>
  );
}
```

### 8. useEventListener - 事件监听

```typescript
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: HTMLElement | Window = window
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: WindowEventMap[K]) => {
      savedHandler.current(event);
    };

    element.addEventListener(eventName, eventListener as any);

    return () => {
      element.removeEventListener(eventName, eventListener as any);
    };
  }, [eventName, element]);
}

// 使用
function KeyLogger() {
  const [key, setKey] = useState('');

  useEventListener('keydown', (e: KeyboardEvent) => {
    setKey(e.key);
  });

  return <div>按下的键: {key}</div>;
}
```

---

## 数据获取类Hooks

### 9. useFetch - 数据获取

```typescript
interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: BodyInit;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    let cancelled = false;

    fetchData().then(() => {
      if (cancelled) return;
    });

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// 使用
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  if (!data) return null;

  return <div>{data.name}</div>;
}
```

### 10. useAsync - 异步操作

```typescript
interface UseAsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    loading: immediate,
    error: null,
    data: null
  });

  const execute = useCallback(async () => {
    setState({ loading: true, error: null, data: null });

    try {
      const response = await asyncFunction();
      setState({ loading: false, error: null, data: response });
      return response;
    } catch (error) {
      setState({ loading: false, error: error as Error, data: null });
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}

// 使用
function DataLoader() {
  const { data, loading, error, execute } = useAsync(
    () => fetch('/api/data').then(r => r.json()),
    false // 不立即执行
  );

  return (
    <div>
      <button onClick={execute} disabled={loading}>
        加载数据
      </button>
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error.message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

---

## DOM/BOM操作类Hooks

### 11. useWindowSize - 窗口尺寸

```typescript
interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 使用
function ResponsiveComponent() {
  const { width } = useWindowSize();

  return (
    <div>
      {width < 768 ? '移动端' : '桌面端'}
      宽度: {width}px
    </div>
  );
}
```

### 12. useClickOutside - 点击外部

```typescript
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;

      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// 使用
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => {
    setIsOpen(false);
  });

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>打开</button>
      {isOpen && (
        <div ref={modalRef} className="modal">
          Modal Content
        </div>
      )}
    </div>
  );
}
```

### 13. useIntersectionObserver - 可见性检测

```typescript
function useIntersectionObserver(
  ref: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isVisible;
}

// 使用
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imgRef, {
    threshold: 0.1
  });

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      style={{ minHeight: '200px' }}
    />
  );
}
```

---

## 性能优化类Hooks

### 14. usePrevious - 保存上一个值

```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// 使用
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前: {count}</p>
      <p>之前: {prevCount}</p>
      <p>变化: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

### 15. useWhyDidYouUpdate - 调试重渲染

```typescript
function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, any> = {};

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

// 使用
function ExpensiveComponent(props: { count: number; name: string }) {
  useWhyDidYouUpdate('ExpensiveComponent', props);

  return <div>{props.count} - {props.name}</div>;
}
```

---

## 工具类Hooks

### 16. useMediaQuery - 媒体查询

```typescript
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// 使用
function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

### 17. useCopyToClipboard - 复制到剪贴板

```typescript
function useCopyToClipboard(): [string | null, (text: string) => Promise<void>] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
    }
  }, []);

  return [copiedText, copy];
}

// 使用
function CopyButton({ text }: { text: string }) {
  const [copiedText, copy] = useCopyToClipboard();

  return (
    <button onClick={() => copy(text)}>
      {copiedText === text ? '已复制!' : '复制'}
    </button>
  );
}
```

---

## React Native专用Hooks

### 18. useKeyboard - 键盘状态

```typescript
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showHandler = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardVisible(true);
    };

    const hideHandler = () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
    };

    const showSubscription = Keyboard.addListener('keyboardWillShow', showHandler);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', hideHandler);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
}
```

### 19. useAppState - 应用状态

```typescript
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  return appState;
}

// 使用
function Component() {
  const appState = useAppState();

  useEffect(() => {
    if (appState === 'active') {
      console.log('应用进入前台');
      // 刷新数据
    }
  }, [appState]);

  return <View />;
}
```

---

## 测试自定义Hooks

### 使用@testing-library/react-hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('应该初始化为false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('应该切换值', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(true);
  });

  it('应该设置为true', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1].setTrue();
    });

    expect(result.current[0]).toBe(true);
  });
});
```

### 测试异步Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  it('应该获取数据', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Alice' })
      } as Response)
    );

    const { result } = renderHook(() => useFetch('/api/user'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ name: 'Alice' });
    expect(result.current.error).toBeNull();
  });

  it('应该处理错误', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useFetch('/api/user'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });
});
```

---

## 总结

### 设计模式总结

1. **单一职责**：每个Hook只做一件事
2. **组合优于继承**：通过组合多个小Hook实现复杂功能
3. **依赖注入**：通过参数传递依赖
4. **关注点分离**：状态管理、副作用、业务逻辑分离
5. **可测试性**：Hook应该易于单元测试

### 命名约定

- `useXxx`: 普通Hook
- `useXxxState`: 状态管理类
- `useXxxEffect`: 副作用类
- `useXxxQuery/Mutation`: 数据获取类

### 优秀Hooks库推荐

- **ahooks**: https://ahooks.js.org/
- **react-use**: https://github.com/streamich/react-use
- **usehooks-ts**: https://usehooks-ts.com/
- **@tanstack/react-query**: 数据获取
- **swr**: 数据获取与缓存

下一章：React性能优化深度指南
