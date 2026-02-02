# React 性能优化深度指南

> 从原理到实践，掌握React性能优化的所有技巧

## 目录

- [第一章：性能优化基础](#第一章性能优化基础)
- [第二章：虚拟DOM与Diff算法](#第二章虚拟dom与diff算法)
- [第三章：组件优化技巧](#第三章组件优化技巧)
- [第四章：代码分割与懒加载](#第四章代码分割与懒加载)
- [第五章：列表渲染优化](#第五章列表渲染优化)
- [第六章：性能分析工具](#第六章性能分析工具)
- [第七章：并发渲染](#第七章并发渲染)
- [第八章：实战优化案例](#第八章实战优化案例)

---

## 第一章：性能优化基础

### 1.1 React性能瓶颈

```typescript
/*
React性能问题的三大根源：

1. 不必要的重新渲染 (Unnecessary Re-renders)
   - 父组件更新导致所有子组件重新渲染
   - Props没变化但组件依然渲染
   - Context变化导致所有消费者重新渲染

2. 复杂的计算 (Expensive Calculations)
   - 每次渲染都执行昂贵的计算
   - 大数据量的处理
   - 复杂的数据转换

3. 大量的DOM操作 (Massive DOM Updates)
   - 长列表渲染
   - 频繁的DOM更新
   - 大型表单处理
*/
```

### 1.2 性能优化原则

```typescript
// ❌ 错误示例：过度优化
function BadComponent() {
  // 为所有东西添加memo和useCallback - 过度优化
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  const simpleValue = useMemo(() => 1 + 1, []); // 没必要

  return <div onClick={handleClick}>{simpleValue}</div>;
}

// ✅ 正确示例：按需优化
function GoodComponent() {
  // 简单计算不需要memo
  const simpleValue = 1 + 1;

  // 简单函数不需要useCallback
  const handleClick = () => {
    console.log('clicked');
  };

  return <div onClick={handleClick}>{simpleValue}</div>;
}

/*
优化原则：
1. 先测量，后优化 - 使用Profiler找出真正的瓶颈
2. 避免过早优化 - 不要为了优化而优化
3. 关注用户体验 - 优化用户能感知到的部分
4. 权衡成本 - 优化的复杂度 vs 性能提升
*/
```

### 1.3 性能指标

```typescript
// 使用性能API测量组件渲染时间
function measurePerformance() {
  // 标记开始
  performance.mark('component-render-start');

  // 组件渲染...

  // 标记结束
  performance.mark('component-render-end');

  // 测量时间
  performance.measure(
    'component-render',
    'component-render-start',
    'component-render-end'
  );

  // 获取测量结果
  const measure = performance.getEntriesByName('component-render')[0];
  console.log(`渲染时间: ${measure.duration}ms`);
}

// 关键性能指标
interface PerformanceMetrics {
  FCP: number;  // First Contentful Paint - 首次内容绘制
  LCP: number;  // Largest Contentful Paint - 最大内容绘制
  FID: number;  // First Input Delay - 首次输入延迟
  CLS: number;  // Cumulative Layout Shift - 累积布局偏移
  TTI: number;  // Time to Interactive - 可交互时间
}
```

---

## 第二章：虚拟DOM与Diff算法

### 2.1 虚拟DOM原理

```typescript
// 虚拟DOM节点结构
interface VNode {
  type: string | Function;      // 元素类型或组件
  props: Record<string, any>;   // 属性
  children: VNode[];            // 子节点
  key?: string | number;        // 唯一标识
}

// 创建虚拟DOM
function createElement(
  type: string | Function,
  props: Record<string, any>,
  ...children: VNode[]
): VNode {
  return {
    type,
    props: props || {},
    children: children.flat(),
  };
}

// 示例：JSX转虚拟DOM
// JSX:
// <div className="container">
//   <h1>Title</h1>
//   <p>Content</p>
// </div>

// 转换后的虚拟DOM:
const vnode: VNode = {
  type: 'div',
  props: { className: 'container' },
  children: [
    {
      type: 'h1',
      props: {},
      children: [{ type: 'text', props: { value: 'Title' }, children: [] }]
    },
    {
      type: 'p',
      props: {},
      children: [{ type: 'text', props: { value: 'Content' }, children: [] }]
    }
  ]
};
```

### 2.2 Diff算法详解

```typescript
/*
React的Diff算法三大策略：

1. 树的分层比较 (Tree Diff)
   - 只比较同层级节点
   - 不跨层级比较
   - 时间复杂度：O(n)

2. 组件类型比较 (Component Diff)
   - 相同类型组件，继续比较Virtual DOM树
   - 不同类型组件，直接替换整个组件

3. 元素的Key比较 (Element Diff)
   - 通过key识别元素是否相同
   - 优化列表渲染
*/

// Diff算法核心实现（简化版）
function diff(oldVNode: VNode, newVNode: VNode): Patch[] {
  const patches: Patch[] = [];

  // 1. 节点类型不同，直接替换
  if (oldVNode.type !== newVNode.type) {
    patches.push({
      type: 'REPLACE',
      vNode: newVNode
    });
    return patches;
  }

  // 2. 比较属性
  const propsPatches = diffProps(oldVNode.props, newVNode.props);
  if (propsPatches.length > 0) {
    patches.push({
      type: 'PROPS',
      patches: propsPatches
    });
  }

  // 3. 比较子节点（使用key优化）
  const childrenPatches = diffChildren(
    oldVNode.children,
    newVNode.children
  );
  patches.push(...childrenPatches);

  return patches;
}

// 属性对比
function diffProps(
  oldProps: Record<string, any>,
  newProps: Record<string, any>
): PropPatch[] {
  const patches: PropPatch[] = [];

  // 找出变化的属性
  for (const key in newProps) {
    if (oldProps[key] !== newProps[key]) {
      patches.push({ key, value: newProps[key] });
    }
  }

  // 找出删除的属性
  for (const key in oldProps) {
    if (!(key in newProps)) {
      patches.push({ key, value: undefined });
    }
  }

  return patches;
}

// 子节点对比（使用key优化）
function diffChildren(
  oldChildren: VNode[],
  newChildren: VNode[]
): Patch[] {
  const patches: Patch[] = [];

  // 使用双端比较算法
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    const oldStartNode = oldChildren[oldStartIdx];
    const oldEndNode = oldChildren[oldEndIdx];
    const newStartNode = newChildren[newStartIdx];
    const newEndNode = newChildren[newEndIdx];

    if (sameVNode(oldStartNode, newStartNode)) {
      // 头头比较
      patches.push(...diff(oldStartNode, newStartNode));
      oldStartIdx++;
      newStartIdx++;
    } else if (sameVNode(oldEndNode, newEndNode)) {
      // 尾尾比较
      patches.push(...diff(oldEndNode, newEndNode));
      oldEndIdx--;
      newEndIdx--;
    } else if (sameVNode(oldStartNode, newEndNode)) {
      // 头尾比较
      patches.push(...diff(oldStartNode, newEndNode));
      patches.push({ type: 'MOVE', from: oldStartIdx, to: newEndIdx });
      oldStartIdx++;
      newEndIdx--;
    } else if (sameVNode(oldEndNode, newStartNode)) {
      // 尾头比较
      patches.push(...diff(oldEndNode, newStartNode));
      patches.push({ type: 'MOVE', from: oldEndIdx, to: newStartIdx });
      oldEndIdx--;
      newStartIdx++;
    } else {
      // 乱序比较 - 使用key建立映射
      const keyMap = createKeyMap(oldChildren, oldStartIdx, oldEndIdx);
      const idxInOld = keyMap.get(newStartNode.key);

      if (idxInOld === undefined) {
        // 新节点
        patches.push({ type: 'INSERT', vNode: newStartNode, index: newStartIdx });
      } else {
        // 移动节点
        patches.push(...diff(oldChildren[idxInOld], newStartNode));
        patches.push({ type: 'MOVE', from: idxInOld, to: newStartIdx });
      }
      newStartIdx++;
    }
  }

  return patches;
}

function sameVNode(a: VNode, b: VNode): boolean {
  return a.key === b.key && a.type === b.type;
}
```

### 2.3 Key的正确使用

```typescript
// ❌ 错误示例1：使用index作为key
function BadList1({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        // 使用index作为key会导致性能问题和bug
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// 问题演示
const items1 = ['A', 'B', 'C'];
// 删除B后
const items2 = ['A', 'C'];
// React认为：
// - index 0 (A) 不变
// - index 1 (B → C) 内容变化，需要更新
// - index 2 删除
// 实际上应该是：
// - A不变
// - B删除
// - C不变

// ❌ 错误示例2：使用随机值作为key
function BadList2({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        // Math.random()每次渲染都会变化
        <li key={Math.random()}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ 正确示例：使用稳定的唯一标识
function GoodList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        // 使用数据的唯一标识
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ 如果没有唯一ID，可以生成稳定的key
import { nanoid } from 'nanoid';

interface ItemWithKey extends Item {
  _key: string;
}

function GoodList2({ items }: { items: Item[] }) {
  // 在数据加载时生成key，而不是在渲染时
  const itemsWithKey = useMemo<ItemWithKey[]>(() =>
    items.map(item => ({
      ...item,
      _key: item.id || nanoid()
    })),
    [items]
  );

  return (
    <ul>
      {itemsWithKey.map(item => (
        <li key={item._key}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## 第三章：组件优化技巧

### 3.1 React.memo

```typescript
// React.memo：浅比较props，避免不必要的重新渲染

// ❌ 未优化的组件
function ExpensiveComponent({ data, count }: Props) {
  console.log('ExpensiveComponent渲染');

  // 复杂的计算
  const result = heavyComputation(data);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Result: {result}</p>
    </div>
  );
}

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(0);
  const data = { value: 100 };

  return (
    <div>
      {/* 即使data和count没变，点击按钮也会导致重新渲染 */}
      <ExpensiveComponent data={data} count={count} />
      <button onClick={() => setUnrelatedState(s => s + 1)}>
        Unrelated Update
      </button>
    </div>
  );
}

// ✅ 使用React.memo优化
const MemoizedComponent = React.memo(function ExpensiveComponent({
  data,
  count
}: Props) {
  console.log('ExpensiveComponent渲染');
  const result = heavyComputation(data);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Result: {result}</p>
    </div>
  );
});

// ✅ 自定义比较函数
const MemoizedWithCustomCompare = React.memo(
  ExpensiveComponent,
  (prevProps, nextProps) => {
    // 返回true表示props相等，不需要重新渲染
    // 返回false表示props不同，需要重新渲染
    return (
      prevProps.count === nextProps.count &&
      prevProps.data.value === nextProps.data.value
    );
  }
);

// 注意：React.memo只进行浅比较
function DeepCompareExample() {
  const [state, setState] = useState(0);

  // ❌ 每次渲染都创建新对象，即使内容相同
  const data = { value: 100, nested: { count: 1 } };

  return <MemoizedComponent data={data} count={state} />;
  // MemoizedComponent每次都会重新渲染，因为data引用变了
}

// ✅ 使用useMemo保持引用稳定
function DeepCompareFixed() {
  const [state, setState] = useState(0);

  // 只在依赖变化时创建新对象
  const data = useMemo(() => ({
    value: 100,
    nested: { count: 1 }
  }), []);

  return <MemoizedComponent data={data} count={state} />;
}
```

### 3.2 useMemo

```typescript
// useMemo：缓存计算结果

// ❌ 每次渲染都执行昂贵计算
function WithoutMemo({ items }: { items: number[] }) {
  // 即使items没变，每次渲染都会重新计算
  const sortedItems = [...items].sort((a, b) => b - a);
  const total = items.reduce((sum, item) => sum + item, 0);
  const average = total / items.length;

  return (
    <div>
      <p>Total: {total}</p>
      <p>Average: {average}</p>
      <ul>
        {sortedItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

// ✅ 使用useMemo缓存计算结果
function WithMemo({ items }: { items: number[] }) {
  // 只在items变化时重新计算
  const sortedItems = useMemo(() => {
    console.log('计算sortedItems');
    return [...items].sort((a, b) => b - a);
  }, [items]);

  const statistics = useMemo(() => {
    console.log('计算statistics');
    const total = items.reduce((sum, item) => sum + item, 0);
    return {
      total,
      average: total / items.length
    };
  }, [items]);

  return (
    <div>
      <p>Total: {statistics.total}</p>
      <p>Average: {statistics.average}</p>
      <ul>
        {sortedItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

// 实际案例：复杂数据转换
interface RawData {
  id: number;
  name: string;
  category: string;
  price: number;
  tags: string[];
}

function DataTable({ data }: { data: RawData[] }) {
  // 复杂的数据处理
  const processedData = useMemo(() => {
    console.log('处理数据...');

    // 1. 按类别分组
    const groupedByCategory = data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, RawData[]>);

    // 2. 计算每个类别的统计信息
    const categoryStats = Object.entries(groupedByCategory).map(([category, items]) => ({
      category,
      count: items.length,
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
      avgPrice: items.reduce((sum, item) => sum + item.price, 0) / items.length,
    }));

    // 3. 按平均价格排序
    return categoryStats.sort((a, b) => b.avgPrice - a.avgPrice);
  }, [data]);

  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Count</th>
          <th>Total Price</th>
          <th>Avg Price</th>
        </tr>
      </thead>
      <tbody>
        {processedData.map(stat => (
          <tr key={stat.category}>
            <td>{stat.category}</td>
            <td>{stat.count}</td>
            <td>${stat.totalPrice}</td>
            <td>${stat.avgPrice.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ⚠️ 注意：不要过度使用useMemo
// 简单计算不需要memo
function SimpleMath({ a, b }: { a: number; b: number }) {
  // ❌ 过度优化
  const sum = useMemo(() => a + b, [a, b]);

  // ✅ 直接计算即可
  const sum2 = a + b;

  return <div>{sum2}</div>;
}
```

### 3.3 useCallback

```typescript
// useCallback：缓存函数引用

// ❌ 每次渲染都创建新函数
function WithoutCallback() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  // 每次渲染都创建新函数
  const handleAddItem = (item: string) => {
    setItems(prev => [...prev, item]);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* 即使items没变，MemoizedChild也会重新渲染 */}
      <MemoizedChild onAddItem={handleAddItem} />
    </div>
  );
}

// ✅ 使用useCallback保持函数引用稳定
function WithCallback() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  // 函数引用保持稳定
  const handleAddItem = useCallback((item: string) => {
    setItems(prev => [...prev, item]);
  }, []); // 空依赖数组，函数永不改变

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      {/* count变化时，MemoizedChild不会重新渲染 */}
      <MemoizedChild onAddItem={handleAddItem} />
    </div>
  );
}

const MemoizedChild = React.memo(({ onAddItem }: {
  onAddItem: (item: string) => void
}) => {
  console.log('MemoizedChild渲染');
  return <button onClick={() => onAddItem('new item')}>Add Item</button>;
});

// useCallback vs useMemo
function CallbackVsMemo() {
  const [count, setCount] = useState(0);

  // useCallback
  const handleClick1 = useCallback(() => {
    console.log(count);
  }, [count]);

  // 等价于
  const handleClick2 = useMemo(() => {
    return () => {
      console.log(count);
    };
  }, [count]);

  // useCallback就是useMemo的语法糖
  // useCallback(fn, deps) === useMemo(() => fn, deps)
}

// 实际案例：事件处理优化
interface Item {
  id: number;
  name: string;
}

function ItemList({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ❌ 错误：在循环中创建函数
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {/* 每个item都有不同的函数 */}
          <button onClick={() => setSelectedId(item.id)}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ✅ 优化1：使用事件委托
function ItemListOptimized1({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const id = target.dataset.id;
    if (id) {
      setSelectedId(Number(id));
    }
  }, []);

  return (
    <ul onClick={handleClick}>
      {items.map(item => (
        <li key={item.id}>
          <button data-id={item.id}>{item.name}</button>
        </li>
      ))}
    </ul>
  );
}

// ✅ 优化2：使用稳定的回调
const ItemRow = React.memo(({
  item,
  onSelect
}: {
  item: Item;
  onSelect: (id: number) => void;
}) => {
  console.log(`ItemRow ${item.id} 渲染`);

  // 创建针对当前item的回调
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [item.id, onSelect]);

  return (
    <li>
      <button onClick={handleClick}>{item.name}</button>
    </li>
  );
});

function ItemListOptimized2({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 使用useCallback保持函数引用稳定
  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  return (
    <ul>
      {items.map(item => (
        <ItemRow key={item.id} item={item} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

### 3.4 组件拆分

```typescript
// 组件拆分：减小渲染粒度

// ❌ 大组件：所有状态混在一起
function BigComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState<string[]>([]);

  // 复杂的计算
  const expensiveValue = heavyComputation(items);

  return (
    <div>
      {/* count变化时，整个组件重新渲染 */}
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>

      {/* text变化时，整个组件重新渲染 */}
      <div>
        <input value={text} onChange={e => setText(e.target.value)} />
      </div>

      {/* 即使items不变，也会重新计算 */}
      <div>
        <p>Expensive Value: {expensiveValue}</p>
        <ExpensiveList items={items} />
      </div>
    </div>
  );
}

// ✅ 拆分成小组件：状态隔离
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

function TextInput() {
  const [text, setText] = useState('');

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
    </div>
  );
}

function ExpensiveSection({ items }: { items: string[] }) {
  // 只在items变化时重新计算
  const expensiveValue = useMemo(() => heavyComputation(items), [items]);

  return (
    <div>
      <p>Expensive Value: {expensiveValue}</p>
      <ExpensiveList items={items} />
    </div>
  );
}

function SmallComponents() {
  const [items, setItems] = useState<string[]>([]);

  return (
    <div>
      {/* 各自独立，互不影响 */}
      <Counter />
      <TextInput />
      <ExpensiveSection items={items} />
    </div>
  );
}

// 实际案例：表单优化
// ❌ 未优化：每个输入都导致整个表单重新渲染
function UnoptimizedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form>
      {/* 任何字段变化都会导致所有Input重新渲染 */}
      <Input
        label="Name"
        value={formData.name}
        onChange={v => handleChange('name', v)}
      />
      <Input
        label="Email"
        value={formData.email}
        onChange={v => handleChange('email', v)}
      />
      <Input
        label="Phone"
        value={formData.phone}
        onChange={v => handleChange('phone', v)}
      />
      <Input
        label="Address"
        value={formData.address}
        onChange={v => handleChange('address', v)}
      />
      <Input
        label="City"
        value={formData.city}
        onChange={v => handleChange('city', v)}
      />
      <Input
        label="Country"
        value={formData.country}
        onChange={v => handleChange('country', v)}
      />
    </form>
  );
}

// ✅ 优化：将每个字段拆分成独立组件
const FormField = React.memo(({
  label,
  name,
  value,
  onChange
}: FormFieldProps) => {
  console.log(`${name} field渲染`);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  }, [name, onChange]);

  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={handleChange} />
    </div>
  );
});

function OptimizedForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <form>
      {/* 每个字段只在自己变化时重新渲染 */}
      <FormField label="Name" name="name" value={formData.name} onChange={handleChange} />
      <FormField label="Email" name="email" value={formData.email} onChange={handleChange} />
      <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
      <FormField label="Address" name="address" value={formData.address} onChange={handleChange} />
      <FormField label="City" name="city" value={formData.city} onChange={handleChange} />
      <FormField label="Country" name="country" value={formData.country} onChange={handleChange} />
    </form>
  );
}
```

---

## 第四章：代码分割与懒加载

### 4.1 React.lazy与Suspense

```typescript
// 基础用法
import React, { lazy, Suspense } from 'react';

// 动态导入组件
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

// 多个lazy组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function AppWithRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
}

// 嵌套Suspense
function NestedSuspense() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Header />

      <main>
        <Suspense fallback={<SectionLoader />}>
          <HeavyComponent />
        </Suspense>
      </main>

      <Suspense fallback={<SidebarLoader />}>
        <Sidebar />
      </Suspense>
    </Suspense>
  );
}
```

### 4.2 路由级代码分割

```typescript
// 使用React Router实现路由级代码分割
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 懒加载所有页面
const pages = {
  Home: lazy(() => import('./pages/Home')),
  Dashboard: lazy(() => import('./pages/Dashboard')),
  Profile: lazy(() => import('./pages/Profile')),
  Settings: lazy(() => import('./pages/Settings')),
  Products: lazy(() => import('./pages/Products')),
  ProductDetail: lazy(() => import('./pages/ProductDetail')),
};

// 加载状态组件
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="spinner" />
      <p>Loading page...</p>
    </div>
  );
}

// 错误边界
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error loading component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<pages.Home />} />
            <Route path="/dashboard" element={<pages.Dashboard />} />
            <Route path="/profile" element={<pages.Profile />} />
            <Route path="/settings" element={<pages.Settings />} />
            <Route path="/products" element={<pages.Products />} />
            <Route path="/products/:id" element={<pages.ProductDetail />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
```

### 4.3 组件级代码分割

```typescript
// 条件加载重组件
function ConditionalLazyLoad() {
  const [showChart, setShowChart] = useState(false);

  // 只在需要时加载图表库（通常很大）
  const Chart = useMemo(
    () => lazy(() => import('./components/HeavyChart')),
    []
  );

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Show Chart
      </button>

      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart />
        </Suspense>
      )}
    </div>
  );
}

// Modal懒加载
function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  // Modal只在打开时加载
  const Modal = useMemo(
    () => lazy(() => import('./components/Modal')),
    []
  );

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <Suspense fallback={null}>
          <Modal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

// Tab内容懒加载
function TabsWithLazyContent() {
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = useMemo(() => ({
    tab1: lazy(() => import('./tabs/Tab1')),
    tab2: lazy(() => import('./tabs/Tab2')),
    tab3: lazy(() => import('./tabs/Tab3')),
  }), []);

  const ActiveTabContent = tabs[activeTab as keyof typeof tabs];

  return (
    <div>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('tab1')}>Tab 1</button>
        <button onClick={() => setActiveTab('tab2')}>Tab 2</button>
        <button onClick={() => setActiveTab('tab3')}>Tab 3</button>
      </div>

      <Suspense fallback={<div>Loading tab content...</div>}>
        <ActiveTabContent />
      </Suspense>
    </div>
  );
}
```

### 4.4 预加载优化

```typescript
// 预加载策略

// 1. 鼠标悬停时预加载
function PreloadOnHover() {
  const ProductDetailPage = lazy(() => import('./pages/ProductDetail'));

  const preloadProductDetail = () => {
    // 触发预加载
    import('./pages/ProductDetail');
  };

  return (
    <div>
      <Link
        to="/product/123"
        onMouseEnter={preloadProductDetail}
      >
        View Product
      </Link>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// 2. 空闲时预加载
function PreloadOnIdle() {
  useEffect(() => {
    // 使用requestIdleCallback在浏览器空闲时预加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('./pages/Dashboard');
        import('./pages/Profile');
        import('./pages/Settings');
      });
    } else {
      // 降级方案
      setTimeout(() => {
        import('./pages/Dashboard');
        import('./pages/Profile');
        import('./pages/Settings');
      }, 1000);
    }
  }, []);

  return <App />;
}

// 3. 可见时预加载（Intersection Observer）
function PreloadOnVisible({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // 提前100px开始加载
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {shouldLoad ? children : <div style={{ height: 400 }} />}
    </div>
  );
}

// 使用示例
function LazyImageGallery() {
  const Gallery = lazy(() => import('./components/Gallery'));

  return (
    <div>
      <h1>My Gallery</h1>
      <PreloadOnVisible>
        <Suspense fallback={<div>Loading gallery...</div>}>
          <Gallery />
        </Suspense>
      </PreloadOnVisible>
    </div>
  );
}

// 4. 智能预加载：基于用户行为
function SmartPreload() {
  useEffect(() => {
    // 分析用户最常访问的页面
    const visitedPages = JSON.parse(
      localStorage.getItem('visitedPages') || '{}'
    );

    // 预加载最常访问的前3个页面
    const topPages = Object.entries(visitedPages)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([page]) => page);

    topPages.forEach(page => {
      import(`./pages/${page}`).catch(() => {
        console.log(`Failed to preload ${page}`);
      });
    });
  }, []);

  return <App />;
}
```

---

## 第五章：列表渲染优化

### 5.1 虚拟滚动

```typescript
// 使用react-window实现虚拟滚动
import { FixedSizeList } from 'react-window';

// ❌ 未优化：渲染10000个item
function HugeListWithoutVirtualization() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`
  }));

  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ height: 50, borderBottom: '1px solid #ccc' }}>
          <h4>{item.name}</h4>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
  // 问题：
  // 1. 创建10000个DOM节点
  // 2. 消耗大量内存
  // 3. 滚动卡顿
}

// ✅ 使用虚拟滚动：只渲染可见的item
function HugeListWithVirtualization() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`
  }));

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <div style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
        <h4>{items[index].name}</h4>
        <p>{items[index].description}</p>
      </div>
    </div>
  );

  return (
    <FixedSizeList
      height={600}        // 容器高度
      itemCount={10000}   // 总item数
      itemSize={50}       // 每个item高度
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
  // 只渲染可见的~12个item，性能大幅提升
}

// 动态高度的虚拟滚动
import { VariableSizeList } from 'react-window';

function VariableHeightList() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    // 随机内容长度
    description: 'Lorem ipsum '.repeat(Math.floor(Math.random() * 10) + 1)
  }));

  const listRef = useRef<VariableSizeList>(null);

  // 计算每个item的高度
  const getItemSize = (index: number) => {
    const baseHeight = 60;
    const descriptionLines = Math.ceil(items[index].description.length / 50);
    return baseHeight + descriptionLines * 20;
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <div style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
        <h4>{items[index].name}</h4>
        <p>{items[index].description}</p>
      </div>
    </div>
  );

  return (
    <VariableSizeList
      ref={listRef}
      height={600}
      itemCount={items.length}
      itemSize={getItemSize}
      width="100%"
    >
      {Row}
    </VariableSizeList>
  );
}

// 自定义虚拟滚动实现（简化版）
function CustomVirtualList({
  items,
  itemHeight,
  containerHeight
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可见范围
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);

  // 只渲染可见item + 缓冲区
  const visibleItems = items.slice(
    Math.max(0, startIndex - 5),
    Math.min(items.length, endIndex + 5)
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.max(0, startIndex - 5) * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, idx) => (
            <div
              key={startIndex + idx}
              style={{ height: itemHeight }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 5.2 无限滚动

```typescript
// 使用Intersection Observer实现无限滚动
function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement>(null);

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const newItems = await fetchItems(page);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(p => p + 1);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // 监听滚动到底部
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}

      {hasMore && (
        <div ref={loaderRef} style={{ padding: 20, textAlign: 'center' }}>
          {loading ? <Spinner /> : 'Scroll for more'}
        </div>
      )}

      {!hasMore && (
        <div style={{ padding: 20, textAlign: 'center' }}>
          No more items
        </div>
      )}
    </div>
  );
}

// 结合虚拟滚动和无限加载
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function VirtualInfiniteList() {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // 判断某个index是否已加载
  const isItemLoaded = (index: number) => {
    return !hasMore || index < items.length;
  };

  // 加载更多item
  const loadMoreItems = async (startIndex: number, stopIndex: number) => {
    const newItems = await fetchItems(Math.floor(startIndex / 20) + 1);

    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    }

    return (
      <div style={style}>
        <ItemCard item={items[index]} />
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={hasMore ? items.length + 20 : items.length}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          ref={ref}
          height={600}
          itemCount={hasMore ? items.length + 20 : items.length}
          itemSize={80}
          onItemsRendered={onItemsRendered}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}
```

### 5.3 列表渲染最佳实践

```typescript
// 1. 使用稳定的key
// ❌ 错误
function BadList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ 正确
function GoodList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// 2. 避免在列表中使用内联对象/函数
// ❌ 每次渲染都创建新对象
function BadListItem({ item }: { item: Item }) {
  return (
    <div>
      {item.tags.map(tag => (
        <span
          key={tag}
          style={{ color: 'red', margin: 5 }}  // 每次都是新对象
          onClick={() => console.log(tag)}      // 每次都是新函数
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ✅ 提取到外部
const tagStyle = { color: 'red', margin: 5 };

const Tag = React.memo(({ tag, onClick }: TagProps) => {
  const handleClick = useCallback(() => {
    onClick(tag);
  }, [tag, onClick]);

  return (
    <span style={tagStyle} onClick={handleClick}>
      {tag}
    </span>
  );
});

function GoodListItem({ item }: { item: Item }) {
  const handleTagClick = useCallback((tag: string) => {
    console.log(tag);
  }, []);

  return (
    <div>
      {item.tags.map(tag => (
        <Tag key={tag} tag={tag} onClick={handleTagClick} />
      ))}
    </div>
  );
}

// 3. 分页优于一次性加载
function PaginatedList() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, loading } = usePaginatedData(page, pageSize);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <ul>
            {data.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>

          <Pagination
            current={page}
            total={data.total}
            pageSize={pageSize}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

// 4. 使用memo优化列表项
const ListItem = React.memo(({
  item,
  onDelete,
  onEdit
}: ListItemProps) => {
  console.log(`ListItem ${item.id} rendered`);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(item.id);
  }, [item.id, onEdit]);

  return (
    <div className="list-item">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});

function OptimizedList({ items }: { items: Item[] }) {
  const [itemList, setItemList] = useState(items);

  const handleDelete = useCallback((id: number) => {
    setItemList(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleEdit = useCallback((id: number) => {
    // 编辑逻辑
    console.log('Edit', id);
  }, []);

  return (
    <div>
      {itemList.map(item => (
        <ListItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
```

---

## 第六章：性能分析工具

### 6.1 React DevTools Profiler

```typescript
// 使用Profiler API
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRenderCallback: ProfilerOnRenderCallback = (
  id,                   // Profiler树的ID
  phase,                // "mount" 或 "update"
  actualDuration,       // 本次更新花费的时间
  baseDuration,         // 不使用memo的情况下渲染整棵树需要的时间
  startTime,            // React开始渲染的时间
  commitTime,           // React提交更新的时间
  interactions          // 本次更新的interactions集合
) => {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);

  // 发送到分析服务
  if (actualDuration > 100) {
    analytics.track('slow-render', {
      component: id,
      duration: actualDuration,
      phase
    });
  }
};

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Router>
        <Profiler id="Navigation" onRender={onRenderCallback}>
          <Navigation />
        </Profiler>

        <Profiler id="MainContent" onRender={onRenderCallback}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Profiler>
      </Router>
    </Profiler>
  );
}

// 生产环境中使用Profiler
const isDev = process.env.NODE_ENV === 'development';

function ConditionalProfiler({
  children,
  id
}: {
  children: React.ReactNode;
  id: string;
}) {
  if (!isDev) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}
```

### 6.2 性能监控Hook

```typescript
// 自定义性能监控Hook
function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
}

function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

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

// 使用示例
function MyComponent({ data, count, onSave }: MyComponentProps) {
  useRenderCount('MyComponent');
  useWhyDidYouUpdate('MyComponent', { data, count, onSave });

  return <div>{/* ... */}</div>;
}

// 测量组件渲染时间
function useRenderTime(componentName: string) {
  const startTime = useRef<number>();

  // 渲染开始
  startTime.current = performance.now();

  useEffect(() => {
    // 渲染结束
    const endTime = performance.now();
    const renderTime = endTime - startTime.current!;

    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

    if (renderTime > 16.67) {
      console.warn(`⚠️ ${componentName} took more than 1 frame to render!`);
    }
  });
}
```

### 6.3 Chrome DevTools

```typescript
// 使用Performance API标记
function PerformanceMarkers() {
  useEffect(() => {
    // 标记组件挂载
    performance.mark('MyComponent-mount-start');

    return () => {
      performance.mark('MyComponent-mount-end');
      performance.measure(
        'MyComponent-mount',
        'MyComponent-mount-start',
        'MyComponent-mount-end'
      );

      // 获取测量结果
      const measures = performance.getEntriesByName('MyComponent-mount');
      console.log('Mount time:', measures[0].duration);
    };
  }, []);

  const handleHeavyOperation = () => {
    performance.mark('heavy-operation-start');

    // 执行耗时操作
    heavyComputation();

    performance.mark('heavy-operation-end');
    performance.measure(
      'heavy-operation',
      'heavy-operation-start',
      'heavy-operation-end'
    );
  };

  return <button onClick={handleHeavyOperation}>Run</button>;
}

// 使用User Timing API
class PerformanceMonitor {
  static startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  static endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];

    // 发送到分析服务
    if (measure.duration > 100) {
      analytics.track('performance-issue', {
        name,
        duration: measure.duration
      });
    }

    return measure.duration;
  }

  static clearMeasures(name: string) {
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  }
}

// 使用示例
function DataFetching() {
  const [data, setData] = useState(null);

  useEffect(() => {
    PerformanceMonitor.startMeasure('data-fetch');

    fetchData()
      .then(result => {
        setData(result);
        const duration = PerformanceMonitor.endMeasure('data-fetch');
        console.log(`Data fetched in ${duration}ms`);
      });
  }, []);

  return <div>{/* render data */}</div>;
}
```

---

## 第七章：并发渲染

### 7.1 Concurrent Mode基础

```typescript
// React 18的并发特性

// 1. useTransition - 标记低优先级更新
function SearchWithTransition() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    // 高优先级：立即更新输入框
    setQuery(newQuery);

    // 低优先级：搜索结果可以延迟更新
    startTransition(() => {
      const filtered = performExpensiveSearch(newQuery);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />

      {isPending && <Spinner />}

      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

// 2. useDeferredValue - 延迟更新值
function DeferredValueExample() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  // input立即更新，deferredInput延迟更新
  // 可以保持输入的流畅性

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {/* 使用延迟的值渲染昂贵的列表 */}
      <ExpensiveList query={deferredInput} />
    </div>
  );
}

// 对比：不使用useDeferredValue
function WithoutDeferred() {
  const [input, setInput] = useState('');

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {/* 每次输入都会导致ExpensiveList重新渲染，造成卡顿 */}
      <ExpensiveList query={input} />
    </div>
  );
}
```

### 7.2 Suspense数据获取

```typescript
// React 18的Suspense支持数据获取

// 创建资源
function createResource<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T;
  let error: Error;

  const suspender = promise.then(
    data => {
      status = 'success';
      result = data;
    },
    err => {
      status = 'error';
      error = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;  // Suspense会捕获这个Promise
      } else if (status === 'error') {
        throw error;
      } else {
        return result;
      }
    }
  };
}

// 使用示例
const userResource = createResource(fetchUser(userId));

function UserProfile() {
  // read()会抛出Promise，被Suspense捕获
  const user = userResource.read();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}

// 实际项目中使用SWR或React Query
import useSWR from 'swr';

function UserProfileWithSWR({ userId }: { userId: number }) {
  const { data: user } = useSWR(`/api/users/${userId}`, fetcher, {
    suspense: true  // 启用Suspense模式
  });

  // user一定有值，因为在loading时会被Suspense捕获
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// 父组件
function App() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfileWithSWR userId={1} />
    </Suspense>
  );
}
```

### 7.3 并发渲染优化策略

```typescript
// 1. 智能分割更新优先级
function SmartPriorityUpdates() {
  const [urgentState, setUrgentState] = useState('');
  const [deferredState, setDeferredState] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleInput = (value: string) => {
    // 紧急：用户输入必须立即响应
    setUrgentState(value);

    // 可延迟：复杂的数据处理可以稍后进行
    startTransition(() => {
      setDeferredState(processComplexData(value));
    });
  };

  return (
    <div>
      <input
        value={urgentState}
        onChange={e => handleInput(e.target.value)}
      />

      {isPending && <InlineSpinner />}

      <ComplexVisualization data={deferredState} />
    </div>
  );
}

// 2. 渐进式渲染
function ProgressiveRendering() {
  const [showDetails, setShowDetails] = useState(false);
  const deferredShow = useDeferredValue(showDetails);

  return (
    <div>
      <button onClick={() => setShowDetails(true)}>
        Show Details
      </button>

      {/* 基础内容立即显示 */}
      <BasicInfo />

      {/* 详细内容延迟渲染，不阻塞基础内容 */}
      {deferredShow && <DetailedInfo />}
    </div>
  );
}

// 3. 时间切片
function TimeSlicedList({ items }: { items: Item[] }) {
  const [displayCount, setDisplayCount] = useState(20);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(() => {
      setDisplayCount(prev => prev + 20);
    });
  };

  return (
    <div>
      <ul>
        {items.slice(0, displayCount).map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {displayCount < items.length && (
        <button onClick={loadMore} disabled={isPending}>
          {isPending ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## 第八章：实战优化案例

### 8.1 电商商品列表优化

```typescript
// 优化前：性能问题
function UnoptimizedProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ category: '', priceRange: [0, 1000] });

  // 问题1：每次渲染都过滤和排序
  const filteredProducts = products
    .filter(p => !filters.category || p.category === filters.category)
    .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    .sort((a, b) => b.rating - a.rating);

  return (
    <div>
      <Filters filters={filters} onChange={setFilters} />

      {/* 问题2：所有商品一次性渲染 */}
      {filteredProducts.map(product => (
        // 问题3：每次都创建新的对象和函数
        <ProductCard
          key={product.id}
          product={product}
          style={{ margin: 10 }}  // 新对象
          onAddToCart={() => addToCart(product.id)}  // 新函数
        />
      ))}
    </div>
  );
}

// 优化后
function OptimizedProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ category: '', priceRange: [0, 1000] });

  // 优化1：使用useMemo缓存过滤结果
  const filteredProducts = useMemo(() => {
    console.log('过滤商品');
    return products
      .filter(p => !filters.category || p.category === filters.category)
      .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      .sort((a, b) => b.rating - a.rating);
  }, [products, filters]);

  // 优化2：使用useCallback稳定回调
  const handleAddToCart = useCallback((productId: number) => {
    addToCart(productId);
  }, []);

  // 优化3：使用虚拟滚动
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = filteredProducts[index];
    return (
      <div style={style}>
        <ProductCard
          product={product}
          onAddToCart={handleAddToCart}
        />
      </div>
    );
  }, [filteredProducts, handleAddToCart]);

  return (
    <div>
      <Filters filters={filters} onChange={setFilters} />

      <FixedSizeList
        height={800}
        itemCount={filteredProducts.length}
        itemSize={200}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}

// ProductCard优化
const cardStyle = { margin: 10, padding: 15 };  // 提取到外部

const ProductCard = React.memo(({
  product,
  onAddToCart
}: ProductCardProps) => {
  console.log(`ProductCard ${product.id} rendered`);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);

  return (
    <div style={cardStyle}>
      <img src={product.image} alt={product.name} loading="lazy" />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
});
```

### 8.2 实时搜索优化

```typescript
// 优化前：输入卡顿
function UnoptimizedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // 问题：每次输入都立即执行搜索，阻塞UI
    const searchResults = expensiveSearch(newQuery);
    setResults(searchResults);
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <SearchResults results={results} />
    </div>
  );
}

// 优化后：流畅输入
function OptimizedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  // 优化1：防抖
  const debouncedQuery = useDebounce(query, 300);

  // 优化2：使用useTransition
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    // 高优先级：立即更新输入框
    setQuery(newQuery);

    // 低优先级：搜索可以延迟
    startTransition(() => {
      const searchResults = expensiveSearch(newQuery);
      setResults(searchResults);
    });
  };

  // 优化3：在服务端搜索
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();

    fetch(`/api/search?q=${debouncedQuery}`, {
      signal: abortController.signal
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => abortController.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <input value={query} onChange={handleChange} />

      {isPending && <InlineSpinner />}

      <Suspense fallback={<ResultsSkeleton />}>
        <SearchResults results={results} />
      </Suspense>
    </div>
  );
}

// useDebounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 8.3 数据表格优化

```typescript
// 大型数据表格优化
function OptimizedDataTable({ data }: { data: TableRow[] }) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // 优化1：缓存排序和过滤结果
  const processedData = useMemo(() => {
    console.log('处理数据');

    let result = [...data];

    // 过滤
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row =>
          String(row[key]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });

    // 排序
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  // 优化2：只渲染当前页
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, page, pageSize]);

  // 优化3：虚拟滚动表格行
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = pageData[index];
    return (
      <div style={style} className="table-row">
        {Object.values(row).map((cell, i) => (
          <div key={i} className="table-cell">
            {cell}
          </div>
        ))}
      </div>
    );
  }, [pageData]);

  return (
    <div>
      <TableFilters filters={filters} onChange={setFilters} />

      <TableHeader
        columns={Object.keys(data[0] || {})}
        sortConfig={sortConfig}
        onSort={setSortConfig}
      />

      <FixedSizeList
        height={600}
        itemCount={pageData.length}
        itemSize={40}
        width="100%"
      >
        {Row}
      </FixedSizeList>

      <Pagination
        current={page}
        total={processedData.length}
        pageSize={pageSize}
        onChange={setPage}
      />
    </div>
  );
}

// Web Worker处理大数据
function useWebWorkerSort(data: any[], sortConfig: SortConfig | null) {
  const [sortedData, setSortedData] = useState(data);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!sortConfig) {
      setSortedData(data);
      return;
    }

    setIsProcessing(true);

    const worker = new Worker(new URL('./sortWorker.ts', import.meta.url));

    worker.postMessage({ data, sortConfig });

    worker.onmessage = (e) => {
      setSortedData(e.data);
      setIsProcessing(false);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [data, sortConfig]);

  return { sortedData, isProcessing };
}

// sortWorker.ts
self.onmessage = (e: MessageEvent) => {
  const { data, sortConfig } = e.data;

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  self.postMessage(sorted);
};
```

### 8.4 性能优化检查清单

```typescript
/*
React性能优化检查清单

✅ 组件优化
  □ 使用React.memo包裹纯组件
  □ 使用useMemo缓存复杂计算
  □ 使用useCallback稳定回调函数
  □ 避免在render中创建新对象/数组/函数
  □ 将状态下移到最小范围
  □ 拆分大组件为小组件

✅ 列表优化
  □ 使用稳定的key（不用index）
  □ 列表项使用React.memo
  □ 长列表使用虚拟滚动
  □ 实现无限滚动代替一次性加载
  □ 使用分页

✅ 代码分割
  □ 路由级代码分割
  □ 重组件懒加载
  □ 第三方库按需引入
  □ 实现预加载策略

✅ 数据获取
  □ 使用SWR/React Query缓存
  □ 实现请求去重
  □ 合并多个请求
  □ 使用Suspense数据获取
  □ 实现乐观更新

✅ 渲染优化
  □ 使用useTransition标记低优先级更新
  □ 使用useDeferredValue延迟更新
  □ 避免阻塞主线程
  □ 使用Web Worker处理耗时计算
  □ 实现时间切片

✅ 资源优化
  □ 图片懒加载
  □ 使用WebP格式
  □ 实现图片CDN
  □ 字体优化
  □ CSS优化

✅ 监控与分析
  □ 使用React DevTools Profiler
  □ 使用Chrome Performance工具
  □ 实现性能监控
  □ 设置性能预算
  □ 持续优化

✅ 构建优化
  □ Tree Shaking
  □ 代码压缩
  □ 分析Bundle大小
  □ 使用生产模式构建
  □ 启用缓存
*/
```

---

## 总结

本指南涵盖了React性能优化的全部内容：

1. **理解原理** - 虚拟DOM、Diff算法、Fiber架构
2. **组件优化** - React.memo、useMemo、useCallback
3. **代码分割** - React.lazy、Suspense、预加载
4. **列表优化** - 虚拟滚动、无限滚动、正确使用key
5. **性能分析** - DevTools、Profiler、自定义监控
6. **并发渲染** - useTransition、useDeferredValue、Suspense
7. **实战案例** - 真实场景的优化方案

记住：**先测量，后优化！**不要过早优化，始终以用户体验为目标。
