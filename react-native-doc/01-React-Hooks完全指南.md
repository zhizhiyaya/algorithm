# React Hooks 完全指南

> 适合10年前端开发者的深度学习教程 - 从基础到精通

## 目录

- [第一章：Hooks 概述与设计哲学](#第一章hooks-概述与设计哲学)
- [第二章：核心 Hooks 详解](#第二章核心-hooks-详解)
- [第三章：额外 Hooks 详解](#第三章额外-hooks-详解)
- [第四章：Hooks 规则与最佳实践](#第四章hooks-规则与最佳实践)
- [第五章：从 Class 组件迁移](#第五章从-class-组件迁移)
- [第六章：Hooks vs Vue 3 Composition API](#第六章hooks-vs-vue-3-composition-api)
- [第七章：常见问题与反模式](#第七章常见问题与反模式)

---

## 第一章：Hooks 概述与设计哲学

### 1.1 为什么需要 Hooks？

#### Class 组件的痛点

```javascript
// ❌ Class 组件的问题
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: [],
      loading: true
    };
  }

  componentDidMount() {
    // 问题1：逻辑分散 - 订阅逻辑
    this.fetchUser();
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  }

  componentDidUpdate(prevProps) {
    // 问题2：重复代码 - 需要判断props变化
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser();
    }
  }

  componentWillUnmount() {
    // 问题3：清理逻辑远离订阅 - 容易忘记
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  }

  fetchUser = async () => {
    // 问题4：this绑定混乱
    const { userId } = this.props;
    const user = await api.fetchUser(userId);
    this.setState({ user, loading: false });
  }

  handleResize = () => {
    // 问题5：难以复用逻辑 - 需要HOC或Render Props
    this.setState({ width: window.innerWidth });
  }

  render() {
    // 问题6：render中包含大量逻辑
    return <div>...</div>;
  }
}
```

#### Hooks 解决方案

```javascript
// ✅ Hooks 优雅解决
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 优势1：相关逻辑聚合在一起
  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const userData = await api.fetchUser(userId);
      if (!cancelled) {
        setUser(userData);
        setLoading(false);
      }
    }

    fetchUser();

    // 优势2：订阅和清理在一起
    return () => {
      cancelled = true;
    };
  }, [userId]); // 优势3：自动响应依赖变化

  // 优势4：逻辑复用变简单
  const windowWidth = useWindowWidth();

  // 优势5：没有this绑定问题
  // 优势6：逻辑更清晰，代码更少

  return <div>...</div>;
}
```

### 1.2 Hooks 设计哲学

#### 核心理念

1. **函数式编程**：组件即函数，状态通过闭包管理
2. **关注点分离**：按功能组织代码，而非生命周期
3. **逻辑复用**：通过自定义Hooks优雅复用
4. **渐进式采用**：可以与Class组件共存

#### Hooks 的三大原则

```javascript
// 原则1：只在顶层调用 Hooks
function Component() {
  // ✅ 正确
  const [state, setState] = useState(0);

  // ❌ 错误 - 不能在条件语句中
  if (someCondition) {
    const [error, setError] = useState(null); // 💥 违反规则
  }

  // ❌ 错误 - 不能在循环中
  for (let i = 0; i < 10; i++) {
    const [item, setItem] = useState(null); // 💥 违反规则
  }

  // ❌ 错误 - 不能在嵌套函数中
  function handleClick() {
    const [clicked, setClicked] = useState(false); // 💥 违反规则
  }

  return <div />;
}

// 原则2：只在 React 函数中调用 Hooks
// ✅ 可以在函数组件中
function MyComponent() {
  const value = useCustomHook();
  return <div />;
}

// ✅ 可以在自定义 Hook 中
function useCustomHook() {
  const [state, setState] = useState(0);
  return state;
}

// ❌ 不能在普通函数中
function normalFunction() {
  const [state, setState] = useState(0); // 💥 违反规则
}

// 原则3：Hooks 调用顺序必须一致
function Component({ condition }) {
  // ❌ 错误 - 顺序可能改变
  if (condition) {
    const [a, setA] = useState(0); // Hook 1
  }
  const [b, setB] = useState(1);   // Hook 2 或 Hook 1？

  // ✅ 正确 - 顺序始终一致
  const [a, setA] = useState(0);   // 始终是 Hook 1
  const [b, setB] = useState(1);   // 始终是 Hook 2

  if (condition) {
    // 在条件中使用状态，而不是声明
    setA(10);
  }
}
```

---

## 第二章：核心 Hooks 详解

### 2.1 useState - 状态管理

#### 基础用法

```typescript
import { useState } from 'react';

function Counter() {
  // 基础类型
  const [count, setCount] = useState(0);

  // 对象类型
  const [user, setUser] = useState({ name: '', age: 0 });

  // 数组类型
  const [items, setItems] = useState<string[]>([]);

  // 函数初始化（惰性初始化）
  const [expensive, setExpensive] = useState(() => {
    // 这个函数只在初始渲染时执行一次
    return computeExpensiveValue();
  });

  return <div />;
}
```

#### 深入理解

```typescript
function StateDemo() {
  const [count, setCount] = useState(0);

  // 🔍 知识点1：状态更新是异步的
  function handleClick() {
    setCount(count + 1);
    console.log(count); // 输出旧值！还是 0

    setCount(count + 1); // 仍然基于旧值
    setCount(count + 1); // 最终count只会变成1，而不是3
  }

  // ✅ 解决方案：使用函数式更新
  function handleClickCorrect() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // count 会变成 3
  }

  // 🔍 知识点2：对象/数组更新必须是不可变的
  const [user, setUser] = useState({ name: 'Alice', age: 25 });

  function updateAge() {
    // ❌ 错误 - 直接修改
    user.age = 26;
    setUser(user); // React 认为没有变化！

    // ✅ 正确 - 创建新对象
    setUser({ ...user, age: 26 });

    // 或使用 immer 库
    setUser(produce(draft => {
      draft.age = 26;
    }));
  }

  // 🔍 知识点3：useState 的批量更新
  function batchUpdate() {
    // React 18之前：在事件处理中自动批量更新
    setCount(c => c + 1);  // 这3个更新会被批量处理
    setUser({ ...user });  // 只触发一次重渲染
    setItems([...items]);

    // React 18：所有更新都自动批量（包括Promise、setTimeout）
    setTimeout(() => {
      setCount(c => c + 1);  // 也会批量！
      setUser({ ...user });
    }, 1000);
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

#### 实战案例：表单管理

```typescript
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 通用的输入处理函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 表单验证
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (formData.password.length < 8) {
      newErrors.password = '密码至少8位';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await api.register(formData);
      alert('注册成功！');
      // 重置表单
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ submit: '注册失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="用户名"
      />
      {errors.username && <span className="error">{errors.username}</span>}

      {/* 其他字段... */}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '注册中...' : '注册'}
      </button>
    </form>
  );
}
```

---

### 2.2 useEffect - 副作用管理

#### 基础概念

```typescript
import { useEffect } from 'react';

function EffectDemo() {
  const [count, setCount] = useState(0);

  // 1️⃣ 无依赖：每次渲染后执行
  useEffect(() => {
    console.log('每次渲染都执行');
  }); // 注意：没有依赖数组

  // 2️⃣ 空依赖：只在挂载时执行一次
  useEffect(() => {
    console.log('组件挂载');

    return () => {
      console.log('组件卸载');
    };
  }, []); // 空数组

  // 3️⃣ 有依赖：依赖变化时执行
  useEffect(() => {
    console.log('count变化了:', count);
  }, [count]); // count变化时执行

  return <div />;
}
```

#### 执行时机详解

```typescript
function ExecutionOrder() {
  const [count, setCount] = useState(0);

  console.log('1. 渲染阶段 - 每次都执行');

  useEffect(() => {
    console.log('2. 提交阶段 - DOM更新后执行');

    return () => {
      console.log('3. 清理阶段 - 下次effect前或卸载时');
    };
  });

  // 执行顺序：
  // 首次渲染：1 -> 2
  // 更新渲染：1 -> 3 -> 2
  // 卸载：3

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

#### 常见场景

##### 场景1：数据获取

```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 🔍 重点：防止竞态条件
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        // 只有当前effect没被取消时才更新状态
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    // 清理函数：组件卸载或userId变化时执行
    return () => {
      cancelled = true;
    };
  }, [userId]); // userId变化时重新获取

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  if (!user) return null;

  return <div>{user.name}</div>;
}
```

##### 场景2：事件订阅

```typescript
function WindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // 订阅
    window.addEventListener('resize', handleResize);

    // 清理：组件卸载时取消订阅
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖，只订阅一次

  return <div>{size.width} x {size.height}</div>;
}
```

##### 场景3：定时器

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // 清理定时器
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]); // isRunning变化时重新设置定时器

  return (
    <div>
      <p>{seconds}秒</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '暂停' : '开始'}
      </button>
      <button onClick={() => setSeconds(0)}>重置</button>
    </div>
  );
}
```

##### 场景4：依赖外部库

```typescript
import Chart from 'chart.js';

function ChartComponent({ data }: { data: number[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 创建图表实例
    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data: data,
          borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });

    // 清理：销毁图表实例
    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []); // 只创建一次

  // 数据变化时更新图表
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.datasets[0].data = data;
      chartInstanceRef.current.update();
    }
  }, [data]);

  return <canvas ref={chartRef} />;
}
```

#### 常见陷阱

```typescript
function EffectPitfalls() {
  const [count, setCount] = useState(0);

  // ❌ 陷阱1：缺少依赖
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 永远是0！
      setCount(count + 1); // 基于旧值更新
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 缺少count依赖

  // ✅ 解决方案1：添加依赖
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count);
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count]); // 但这会导致频繁重建定时器

  // ✅ 解决方案2：使用函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => {
        console.log(c);
        return c + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 不需要count依赖

  // ❌ 陷阱2：在effect中修改依赖
  useEffect(() => {
    setCount(count + 1); // 修改了依赖
  }, [count]); // 💥 无限循环！

  // ❌ 陷阱3：对象/数组作为依赖
  const options = { interval: 1000 }; // 每次渲染都是新对象

  useEffect(() => {
    console.log('effect运行'); // 每次渲染都执行！
  }, [options]); // 对象引用每次都不同

  // ✅ 解决方案：使用useMemo或提取到外部
  const options = useMemo(() => ({ interval: 1000 }), []);

  return <div />;
}
```

---

### 2.3 useContext - 跨组件通信

#### 基础用法

```typescript
import { createContext, useContext, useState } from 'react';

// 1. 创建Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider组件
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 自定义Hook简化使用
function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

// 4. 消费组件
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff'
      }}
    >
      Toggle Theme
    </button>
  );
}

// 5. 使用
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

#### 实战案例：用户认证

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化：检查本地token
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetchCurrentUser(token)
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await api.updateProfile(data);
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义Hook
function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// 使用示例
function UserProfile() {
  const { user, updateProfile, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={logout}>退出登录</button>
    </div>
  );
}
```

#### Context 性能优化

```typescript
// ❌ 问题：Provider的value每次都是新对象
function BadProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
  // 每次渲染 value 都是新对象，导致所有消费者重渲染
}

// ✅ 优化1：使用useMemo缓存value
function GoodProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ 优化2：分离频繁变化的状态
const ThemeStateContext = createContext(null);
const ThemeDispatchContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={setTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

// 只需要读取的组件
function ThemeDisplay() {
  const theme = useContext(ThemeStateContext);
  // 不会因为setTheme变化而重渲染
  return <div>Current: {theme}</div>;
}

// 只需要更新的组件
function ThemeToggle() {
  const setTheme = useContext(ThemeDispatchContext);
  // 不会因为theme变化而重渲染
  return <button onClick={() => setTheme('dark')}>Set Dark</button>;
}
```

---

### 2.4 useReducer - 复杂状态管理

#### 基础概念

```typescript
import { useReducer } from 'react';

// 1. 定义状态类型
interface State {
  count: number;
  error: string | null;
}

// 2. 定义Action类型
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number }
  | { type: 'error'; payload: string };

// 3. Reducer函数
function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, error: null };
    case 'decrement':
      return { ...state, count: state.count - 1, error: null };
    case 'reset':
      return { count: 0, error: null };
    case 'set':
      return { ...state, count: action.payload, error: null };
    case 'error':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// 4. 使用
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, error: null });

  return (
    <div>
      <p>Count: {state.count}</p>
      {state.error && <p>Error: {state.error}</p>}

      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'set', payload: 100 })}>Set 100</button>
    </div>
  );
}
```

#### 实战案例：购物车

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      let newItems: CartItem[];
      if (existingItem) {
        // 如果已存在，增加数量
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // 如果不存在，添加新项
        newItems = [...state.items, action.payload];
      }

      return calculateTotals(newItems);
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals(newItems);
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      return calculateTotals(newItems);
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
}

// 辅助函数：计算总价
function calculateTotals(items: CartItem[]): CartState {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, total, itemCount };
}

// 购物车组件
function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div>
      <h2>购物车 ({state.itemCount} 件商品)</h2>

      {state.items.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <h3>{item.name}</h3>
          <p>¥{item.price}</p>

          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="0"
          />

          <button onClick={() => removeItem(item.id)}>删除</button>
        </div>
      ))}

      <div className="cart-total">
        <h3>总计: ¥{state.total.toFixed(2)}</h3>
        <button onClick={clearCart}>清空购物车</button>
      </div>
    </div>
  );
}
```

#### useReducer vs useState

```typescript
// 何时使用 useState
function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}

// 何时使用 useReducer
// 1. 多个相关状态
// 2. 复杂的状态更新逻辑
// 3. 需要测试状态逻辑
// 4. 状态更新依赖前一个状态

function ComplexForm() {
  // ❌ 用 useState 太复杂
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 用 useReducer 更清晰
  const [state, dispatch] = useReducer(formReducer, initialFormState);
}
```

---

## 第三章：额外 Hooks 详解

### 3.1 useRef - 持久化引用

#### 基础用法

```typescript
import { useRef, useEffect } from 'react';

function RefDemo() {
  // 1. 访问DOM元素
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 自动聚焦
    inputRef.current?.focus();
  }, []);

  // 2. 存储可变值（不触发重渲染）
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`渲染次数: ${renderCount.current}`);
  });

  // 3. 存储上一次的值
  const [count, setCount] = useState(0);
  const prevCountRef = useRef<number>();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  const prevCount = prevCountRef.current;

  return (
    <div>
      <input ref={inputRef} />
      <p>当前: {count}, 之前: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>增加</button>
    </div>
  );
}
```

#### 实战场景

##### 场景1：防抖和节流

```typescript
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const timerRef = useRef<NodeJS.Timeout>();

  // 保持callback最新
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

// 使用
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    console.log('搜索:', value);
    // 调用API
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
}
```

##### 场景2：保存上一个props/state

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
      <p>当前值: {count}</p>
      <p>之前值: {prevCount}</p>
      <p>变化: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

##### 场景3：跨渲染保存值

```typescript
function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 保存播放进度
  const progressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveProgress = () => {
      progressRef.current = video.currentTime;
      localStorage.setItem('videoProgress', String(video.currentTime));
    };

    // 定期保存进度
    const interval = setInterval(saveProgress, 1000);

    return () => {
      clearInterval(interval);
      saveProgress(); // 卸载时保存
    };
  }, []);

  // 恢复播放进度
  useEffect(() => {
    const savedProgress = localStorage.getItem('videoProgress');
    if (savedProgress && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedProgress);
    }
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={togglePlay}>
        {isPlaying ? '暂停' : '播放'}
      </button>
    </div>
  );
}
```

---

### 3.2 useMemo - 计算缓存

#### 基础用法

```typescript
import { useMemo } from 'react';

function ExpensiveComponent({ items }: { items: number[] }) {
  // 昂贵的计算
  const expensiveValue = useMemo(() => {
    console.log('计算中...');
    return items.reduce((sum, item) => sum + item, 0);
  }, [items]); // 只有items变化时才重新计算

  return <div>总和: {expensiveValue}</div>;
}
```

#### 何时使用

```typescript
function UseMemoDemo() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 2, 3]);

  // ❌ 不必要的 useMemo - 简单计算
  const doubleCount = useMemo(() => count * 2, [count]);

  // ✅ 需要 useMemo - 昂贵计算
  const sortedItems = useMemo(() => {
    console.log('排序...');
    return [...items].sort((a, b) => b - a);
  }, [items]);

  // ✅ 需要 useMemo - 对象/数组引用稳定性
  const config = useMemo(() => ({
    items: sortedItems,
    count: count
  }), [sortedItems, count]);

  return (
    <div>
      <ChildComponent config={config} />
    </div>
  );
}

const ChildComponent = React.memo(({ config }) => {
  // config引用稳定，避免不必要的重渲染
  return <div>...</div>;
});
```

#### 实战案例：过滤和排序

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
}

function ProductList({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 过滤商品
  const filteredProducts = useMemo(() => {
    console.log('过滤商品...');

    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // 排序商品
  const sortedProducts = useMemo(() => {
    console.log('排序商品...');

    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else {
        return b.rating - a.rating;
      }
    });
  }, [filteredProducts, sortBy]);

  // 统计信息
  const stats = useMemo(() => {
    return {
      total: sortedProducts.length,
      avgPrice: sortedProducts.reduce((sum, p) => sum + p.price, 0) / sortedProducts.length,
      avgRating: sortedProducts.reduce((sum, p) => sum + p.rating, 0) / sortedProducts.length
    };
  }, [sortedProducts]);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="搜索商品..."
      />

      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="all">全部分类</option>
        <option value="electronics">电子产品</option>
        <option value="clothing">服装</option>
      </select>

      <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
        <option value="price">按价格</option>
        <option value="rating">按评分</option>
      </select>

      <div className="stats">
        <p>共 {stats.total} 件商品</p>
        <p>平均价格: ¥{stats.avgPrice.toFixed(2)}</p>
        <p>平均评分: {stats.avgRating.toFixed(1)}</p>
      </div>

      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### 3.3 useCallback - 函数缓存

#### 基础用法

```typescript
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染都创建新函数
  const handleClick = () => {
    console.log('clicked');
  };

  // ✅ 缓存函数引用
  const handleClickMemoized = useCallback(() => {
    console.log('clicked');
  }, []); // 空依赖，函数永不变化

  // 有依赖的情况
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []); // setCount稳定，不需要依赖

  const incrementBy = useCallback((amount: number) => {
    setCount(c => c + amount);
  }, []); // 也不需要依赖count

  return (
    <div>
      <ChildComponent onClick={handleClickMemoized} />
      <button onClick={increment}>+1</button>
    </div>
  );
}

// 子组件用memo包裹，避免不必要的重渲染
const ChildComponent = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('ChildComponent 渲染');
  return <button onClick={onClick}>点击</button>;
});
```

#### useCallback vs useMemo

```typescript
function CallbackVsMemo() {
  const [count, setCount] = useState(0);

  // useCallback 缓存函数
  const handleClick = useCallback(() => {
    console.log(count);
  }, [count]);

  // useMemo 缓存函数 - 等价写法
  const handleClick2 = useMemo(() => {
    return () => {
      console.log(count);
    };
  }, [count]);

  // 实际上：
  // useCallback(fn, deps) === useMemo(() => fn, deps)
}
```

#### 实战案例：表格操作

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function UserTable({ users }: { users: User[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 处理单个选择
  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []); // 不需要依赖selectedIds

  // 全选/取消全选
  const handleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.size === users.length) {
        return new Set();
      } else {
        return new Set(users.map(u => u.id));
      }
    });
  }, [users]); // 依赖users

  // 删除选中项
  const handleDeleteSelected = useCallback(() => {
    // 调用API删除
    const idsToDelete = Array.from(selectedIds);
    api.deleteUsers(idsToDelete);
    setSelectedIds(new Set());
  }, [selectedIds]);

  // 导出选中项
  const handleExportSelected = useCallback(() => {
    const selectedUsers = users.filter(u => selectedIds.has(u.id));
    exportToCSV(selectedUsers);
  }, [users, selectedIds]);

  return (
    <div>
      <div className="actions">
        <button onClick={handleSelectAll}>
          {selectedIds.size === users.length ? '取消全选' : '全选'}
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.size === 0}
        >
          删除选中 ({selectedIds.size})
        </button>
        <button
          onClick={handleExportSelected}
          disabled={selectedIds.size === 0}
        >
          导出选中
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>角色</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              selected={selectedIds.has(user.id)}
              onSelect={handleSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 优化的行组件
const UserRow = React.memo(({
  user,
  selected,
  onSelect
}: {
  user: User;
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(user.id);
  }, [user.id, onSelect]);

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={selected}
          onChange={handleClick}
        />
      </td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </tr>
  );
});
```

---

### 3.4 useImperativeHandle - 暴露子组件方法

#### 基础用法

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface InputHandle {
  focus: () => void;
  blur: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}

const CustomInput = forwardRef<InputHandle, { placeholder?: string }>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');

    // 暴露自定义方法给父组件
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      getValue: () => {
        return value;
      },
      setValue: (newValue: string) => {
        setValue(newValue);
      }
    }), [value]);

    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={props.placeholder}
      />
    );
  }
);

// 使用
function ParentComponent() {
  const inputRef = useRef<InputHandle>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.getValue();
    console.log('提交:', value);
  };

  const handleClear = () => {
    inputRef.current?.setValue('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <CustomInput ref={inputRef} placeholder="输入内容..." />
      <button onClick={handleSubmit}>提交</button>
      <button onClick={handleClear}>清空</button>
    </div>
  );
}
```

---

### 3.5 useLayoutEffect - 同步副作用

#### useEffect vs useLayoutEffect

```typescript
// useEffect: 异步执行，DOM更新后
useEffect(() => {
  // 在浏览器绘制完成后执行
  // 用户可能看到闪烁
}, []);

// useLayoutEffect: 同步执行，DOM更新前
useLayoutEffect(() => {
  // 在浏览器绘制前执行
  // 阻塞渲染，但避免闪烁
}, []);
```

#### 使用场景

```typescript
// 场景1：测量DOM尺寸
function TooltipDemo() {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 在浏览器绘制前测量，避免闪烁
    if (tooltipRef.current) {
      const height = tooltipRef.current.offsetHeight;
      setTooltipHeight(height);
    }
  }, []);

  return (
    <div
      ref={tooltipRef}
      style={{
        top: `calc(100% - ${tooltipHeight}px)` // 基于测量结果定位
      }}
    >
      Tooltip
    </div>
  );
}

// 场景2：动画初始化
function AnimatedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 在渲染前设置初始状态
    if (elementRef.current) {
      elementRef.current.style.opacity = '0';
      elementRef.current.style.transform = 'translateY(-20px)';

      // 然后触发动画
      requestAnimationFrame(() => {
        elementRef.current!.style.transition = 'all 0.3s';
        elementRef.current!.style.opacity = '1';
        elementRef.current!.style.transform = 'translateY(0)';
      });
    }
  }, []);

  return <div ref={elementRef}>Content</div>;
}
```

---

## 第四章：Hooks 规则与最佳实践

### 4.1 Hooks 规则

```typescript
// ✅ 规则1：只在顶层调用
function GoodComponent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);

  // Hook调用顺序始终一致
  return <div />;
}

// ❌ 违反规则1
function BadComponent({ condition }) {
  if (condition) {
    const [a, setA] = useState(0); // 💥 顺序不一致
  }
  const [b, setB] = useState(1);

  return <div />;
}

// ✅ 规则2：只在React函数中调用
function CustomHook() {
  const [state, setState] = useState(0); // ✓ 在自定义Hook中
  return state;
}

function Component() {
  const value = CustomHook(); // ✓ 在组件中
  return <div />;
}

// ❌ 违反规则2
function regularFunction() {
  const [state, setState] = useState(0); // 💥 在普通函数中
}
```

### 4.2 依赖数组最佳实践

```typescript
function DependenciesBestPractices() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'Alice', age: 25 });

  // ✅ 推荐：使用函数式更新避免依赖
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1); // 不依赖count
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 空依赖

  // ✅ 推荐：提取需要的值
  const userName = user.name;
  useEffect(() => {
    document.title = userName;
  }, [userName]); // 只依赖需要的值

  // ❌ 不推荐：依赖整个对象
  useEffect(() => {
    document.title = user.name;
  }, [user]); // user每次都是新对象

  // ✅ 推荐：使用useCallback稳定函数引用
  const fetchData = useCallback(async () => {
    const data = await api.fetch();
    // ...
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData引用稳定

  return <div />;
}
```

### 4.3 自定义Hooks命名约定

```typescript
// ✅ 正确：use开头
function useWindowSize() {
  // ...
}

function useLocalStorage(key: string) {
  // ...
}

// ❌ 错误：不以use开头
function getWindowSize() { // ESLint会报错
  const [size, setSize] = useState(window.innerWidth);
  // ...
}
```

---

## 第五章：从 Class 组件迁移

### 5.1 生命周期对应关系

```typescript
// Class组件
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    // 挂载后
  }

  componentDidUpdate(prevProps, prevState) {
    // 更新后
  }

  componentWillUnmount() {
    // 卸载前
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}

// Hooks组件
function HooksComponent() {
  const [count, setCount] = useState(0);

  // componentDidMount
  useEffect(() => {
    console.log('挂载');
  }, []);

  // componentDidUpdate
  useEffect(() => {
    console.log('count更新');
  }, [count]);

  // componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('卸载');
    };
  }, []);

  return <div>{count}</div>;
}
```

### 5.2 常见模式转换

```typescript
// Class: shouldComponentUpdate
class OptimizedClass extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value;
  }

  render() {
    return <div>{this.props.value}</div>;
  }
}

// Hooks: React.memo
const OptimizedHooks = React.memo(
  function Component({ value }) {
    return <div>{value}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value; // 注意：返回true表示不更新
  }
);
```

---

## 第六章：Hooks vs Vue 3 Composition API

### 对比分析

```typescript
// React Hooks
function ReactCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('count changed:', count);
  }, [count]);

  const increment = () => setCount(c => c + 1);

  return (
    <button onClick={increment}>
      {count}
    </button>
  );
}

// Vue 3 Composition API
import { ref, watch } from 'vue';

export default {
  setup() {
    const count = ref(0);

    watch(count, (newVal) => {
      console.log('count changed:', newVal);
    });

    const increment = () => count.value++;

    return { count, increment };
  },

  template: `
    <button @click="increment">
      {{ count }}
    </button>
  `
};
```

### 主要区别

| 特性 | React Hooks | Vue 3 Composition API |
|------|-------------|---------------------|
| **响应式** | 手动触发(setState) | 自动(Proxy) |
| **依赖追踪** | 手动声明依赖数组 | 自动追踪 |
| **调用限制** | 只能在顶层 | 无限制 |
| **组件更新** | 整个组件重新执行 | 只更新变化部分 |
| **闭包陷阱** | 容易出现 | 不存在 |

---

## 第七章：常见问题与反模式

### 7.1 闭包陷阱

```typescript
// ❌ 问题代码
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 永远是0
      setCount(count + 1); // 基于旧值
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 缺少count依赖

  return <div>{count}</div>;
}

// ✅ 解决方案1：添加依赖
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [count]); // 但会频繁重建定时器

// ✅ 解决方案2：函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1); // 使用最新值
  }, 1000);

  return () => clearInterval(timer);
}, []); // 不需要依赖

// ✅ 解决方案3：useRef
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
  const timer = setInterval(() => {
    console.log(countRef.current); // 最新值
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

### 7.2 无限循环

```typescript
// ❌ 问题1：依赖变化导致无限循环
function InfiniteLoop() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // 修改依赖
  }, [count]); // 💥 无限循环
}

// ❌ 问题2：对象依赖
function ObjectDependency() {
  const options = { interval: 1000 }; // 每次渲染都是新对象

  useEffect(() => {
    console.log('effect');
  }, [options]); // 💥 每次都执行
}

// ✅ 解决：useMemo缓存对象
const options = useMemo(() => ({ interval: 1000 }), []);
```

### 7.3 性能问题

```typescript
// ❌ 不必要的渲染
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <ExpensiveChild /> {/* 每次都重渲染 */}
    </div>
  );
}

// ✅ 使用React.memo
const ExpensiveChild = React.memo(function Child() {
  console.log('渲染');
  return <div>Child</div>;
});
```

---

**本章小结**

React Hooks 彻底改变了React组件的编写方式，主要优势：
1. 更简洁的代码
2. 更好的逻辑复用
3. 更清晰的关注点分离
4. 无需关心this绑定

但也需要注意：
1. 遵守Hooks规则
2. 正确管理依赖
3. 理解闭包陷阱
4. 合理使用性能优化

下一章我们将深入探讨Hooks的底层原理和源码实现。

---

*学习资源推荐*
- React官方文档：https://react.dev
- React Hooks RFC：https://github.com/reactjs/rfcs/pull/68
- useHooks：https://usehooks.com/
