# React 工程化与最佳实践

> 项目架构、代码规范、构建优化、测试与CI/CD完整指南

## 目录

- [第一章：项目架构设计](#第一章项目架构设计)
- [第二章：TypeScript最佳实践](#第二章typescript最佳实践)
- [第三章：代码规范与质量](#第三章代码规范与质量)
- [第四章：构建优化](#第四章构建优化)
- [第五章：测试策略](#第五章测试策略)
- [第六章：CI/CD流程](#第六章cicd流程)
- [第七章：监控与错误追踪](#第七章监控与错误追踪)
- [第八章：团队协作](#第八章团队协作)

---

## 第一章：项目架构设计

### 1.1 目录结构设计

```typescript
/*
推荐的项目目录结构（Feature-based）

my-react-app/
├── src/
│   ├── app/                      # 应用入口
│   │   ├── App.tsx
│   │   ├── store.ts             # Redux store配置
│   │   └── routes.tsx           # 路由配置
│   │
│   ├── features/                # 功能模块（按业务划分）
│   │   ├── auth/
│   │   │   ├── components/      # 功能特定组件
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/           # 功能特定Hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── services/        # API服务
│   │   │   │   └── authService.ts
│   │   │   ├── store/           # 状态管理
│   │   │   │   ├── authSlice.ts
│   │   │   │   └── authSelectors.ts
│   │   │   ├── types/           # 类型定义
│   │   │   │   └── auth.types.ts
│   │   │   ├── utils/           # 工具函数
│   │   │   │   └── tokenUtils.ts
│   │   │   └── index.ts         # 导出
│   │   │
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── ...
│   │   │
│   │   └── cart/
│   │       └── ...
│   │
│   ├── shared/                  # 共享资源
│   │   ├── components/          # 通用组件
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── ...
│   │   │
│   │   ├── hooks/               # 通用Hooks
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── ...
│   │   │
│   │   ├── utils/               # 工具函数
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── ...
│   │   │
│   │   ├── constants/           # 常量
│   │   │   ├── api.ts
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   │
│   │   └── types/               # 全局类型
│   │       ├── api.types.ts
│   │       └── common.types.ts
│   │
│   ├── layouts/                 # 布局组件
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── pages/                   # 页面组件
│   │   ├── HomePage/
│   │   ├── ProductsPage/
│   │   └── ...
│   │
│   ├── styles/                  # 全局样式
│   │   ├── theme.ts
│   │   ├── global.css
│   │   └── variables.ts
│   │
│   └── lib/                     # 第三方库配置
│       ├── axios.ts
│       ├── reactQuery.ts
│       └── ...
│
├── public/                      # 静态资源
├── tests/                       # 测试配置和工具
│   ├── setup.ts
│   ├── mocks/
│   └── utils/
│
├── scripts/                     # 构建脚本
├── .env.development
├── .env.production
├── package.json
├── tsconfig.json
├── vite.config.ts (or webpack.config.js)
└── README.md
*/
```

### 1.2 分层架构

```typescript
/*
分层架构设计：

┌─────────────────────────────────────────────┐
│  Presentation Layer (表现层)                │
│  • React Components                         │
│  • Hooks                                    │
│  • Pages/Layouts                            │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  Business Logic Layer (业务逻辑层)          │
│  • Custom Hooks                             │
│  • State Management (Redux/Zustand)         │
│  • Domain Logic                             │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  Service Layer (服务层)                     │
│  • API Services                             │
│  • Data Transformation                      │
│  • External Integrations                    │
└─────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  Data Layer (数据层)                        │
│  • HTTP Client (Axios)                      │
│  • Local Storage                            │
│  • Cache (React Query)                      │
└─────────────────────────────────────────────┘
*/

// 实例：产品功能的分层实现

// 1. Data Layer - API Client
// src/lib/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class APIClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // 处理未授权
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T, T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T, T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T, T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T, T>(url, config);
  }
}

export const apiClient = new APIClient(process.env.REACT_APP_API_URL!);

// 2. Service Layer - 产品服务
// src/features/products/services/productService.ts
import { apiClient } from '@/lib/axios';
import { Product, ProductFilters, PaginatedResponse } from '../types';

class ProductService {
  private readonly basePath = '/products';

  async getProducts(
    filters: ProductFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Product>> {
    const params = {
      ...filters,
      page,
      limit,
    };

    return apiClient.get<PaginatedResponse<Product>>(this.basePath, { params });
  }

  async getProduct(id: string): Promise<Product> {
    return apiClient.get<Product>(`${this.basePath}/${id}`);
  }

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    return apiClient.post<Product>(this.basePath, data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return apiClient.put<Product>(`${this.basePath}/${id}`, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`${this.basePath}/search`, {
      params: { q: query },
    });
  }
}

export const productService = new ProductService();

// 3. Business Logic Layer - 自定义Hooks
// src/features/products/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { Product, ProductFilters } from '../types';

const QUERY_KEYS = {
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  search: (query: string) => ['products', 'search', query] as const,
};

export function useProducts(filters: ProductFilters, page: number = 1) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, filters, page],
    queryFn: () => productService.getProducts(filters, page),
    staleTime: 5 * 60 * 1000, // 5分钟
    cacheTime: 10 * 60 * 1000, // 10分钟
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      // 刷新产品列表
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // 更新缓存
      queryClient.setQueryData(QUERY_KEYS.product(variables.id), data);
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => productService.searchProducts(query),
    enabled: query.length >= 3, // 至少3个字符才搜索
    staleTime: 30 * 1000, // 30秒
  });
}

// 4. Presentation Layer - React组件
// src/features/products/components/ProductList.tsx
import React, { useState } from 'react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { ProductFilters } from '../types';
import { ProductCard } from './ProductCard';
import { ProductFiltersForm } from './ProductFiltersForm';
import { Pagination } from '@/shared/components/Pagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useProducts(filters, page);
  const deleteProduct = useDeleteProduct();

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1); // 重置到第一页
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个产品吗？')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <div className="product-list">
      <ProductFiltersForm filters={filters} onChange={handleFilterChange} />

      <div className="products-grid">
        {data.items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### 1.3 状态管理架构

```typescript
// Redux Toolkit + React Query 混合架构

/*
状态分类：

1. 服务端状态（Server State）
   → 使用 React Query
   • API数据
   • 缓存
   • 自动刷新

2. 客户端状态（Client State）
   → 使用 Redux Toolkit / Zustand
   • 用户认证
   • UI状态
   • 应用配置

3. URL状态（URL State）
   → 使用 React Router
   • 路由参数
   • 查询字符串

4. 表单状态（Form State）
   → 使用 React Hook Form
   • 表单输入
   • 验证
*/

// Redux Toolkit配置
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Slices
import authReducer from '@/features/auth/store/authSlice';
import uiReducer from '@/features/ui/store/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略特定action
        ignoredActions: ['auth/setTimestamp'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// TypeScript hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth Slice
// src/features/auth/store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { User, LoginCredentials } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
```

---

## 第二章：TypeScript最佳实践

### 2.1 类型定义规范

```typescript
// 1. 接口 vs 类型别名
// ✅ 使用interface定义对象形状
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// ✅ 使用type定义联合类型、交叉类型
type Status = 'idle' | 'loading' | 'success' | 'error';
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// 2. 泛型组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// 使用
<List<User>
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
/>

// 3. 高级类型工具
// Pick - 选择部分属性
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - 排除部分属性
type UserWithoutPassword = Omit<User, 'password'>;

// Partial - 所有属性可选
type PartialUser = Partial<User>;

// Required - 所有属性必填
type RequiredUser = Required<User>;

// Record - 定义对象类型
type UserRoles = Record<string, User[]>;

// 自定义工具类型
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 4. 组件Props类型
// ✅ 好的实践
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className || ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

// 5. Hooks类型
// 自定义Hook返回值类型
function useAuth(): {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} {
  // ...实现
}

// 泛型Hook
function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  // ...实现
}

// 6. 事件类型
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}

function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log('Button clicked');
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

// 7. Context类型
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 8. API类型定义
// API请求/响应类型
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// 统一的API返回类型
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

// 9. 枚举 vs 联合类型
// ❌ 避免使用enum（会增加bundle大小）
enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

// ✅ 使用const断言
const Color = {
  Red: 'red',
  Green: 'green',
  Blue: 'blue',
} as const;

type Color = (typeof Color)[keyof typeof Color];

// 10. 类型守卫
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  );
}

function processValue(value: User | string) {
  if (isUser(value)) {
    console.log(value.name); // TypeScript知道这是User
  } else {
    console.log(value.toUpperCase()); // TypeScript知道这是string
  }
}
```

### 2.2 严格类型检查

```json
// tsconfig.json - 严格配置
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",

    // 严格模式
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // 额外检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    // 模块解析
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/shared/components/*"],
      "@/hooks/*": ["src/shared/hooks/*"],
      "@/utils/*": ["src/shared/utils/*"]
    },

    // 其他
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "build", "dist"]
}
```

---

## 第三章：代码规范与质量

### 3.1 ESLint配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier', // 必须放在最后
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],

    // React
    'react/react-in-jsx-scope': 'off', // React 17+不需要
    'react/prop-types': 'off', // 使用TypeScript
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Import
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
    'import/no-cycle': 'warn',

    // 通用
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
```

### 3.2 Prettier配置

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed"
}
```

### 3.3 Git Hooks (Husky + lint-staged)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档变更
        'style',    // 代码格式
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试
        'chore',    // 构建/工具
        'revert',   // 回滚
      ],
    ],
    'subject-case': [0],
  },
};

// 提交消息格式：
// feat: 添加用户登录功能
// fix: 修复购物车计算错误
// docs: 更新API文档
```

---

## 第四章：构建优化

### 4.1 Vite优化配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Gzip压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Bundle分析
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/shared/components'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
    },
  },

  build: {
    // 生产环境移除console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
      },
    },

    // 代码分割
    rollupOptions: {
      output: {
        // 分离vendor
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd', '@mui/material'],
          'utils-vendor': ['lodash-es', 'dayjs', 'axios'],
        },
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // chunk大小警告阈值
    chunkSizeWarningLimit: 1000,

    // 启用CSS代码分割
    cssCodeSplit: true,

    // SourceMap（生产环境关闭）
    sourcemap: mode !== 'production',
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env'],
  },
}));
```

### 4.2 代码分割策略

```typescript
// 1. 路由级代码分割
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@/shared/components';

// 懒加载页面
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 2. 组件级代码分割
// 重组件懒加载
const HeavyChart = lazy(() => import('@/components/HeavyChart'));
const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>

      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// 3. 预加载优化
import { lazy, Suspense, useEffect } from 'react';

// 创建带预加载的lazy组件
function lazyWithPreload<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);
  return Object.assign(LazyComponent, {
    preload: importFn,
  });
}

const ProductDetailPage = lazyWithPreload(
  () => import('@/pages/ProductDetailPage')
);

// 鼠标悬停时预加载
function ProductCard({ product }) {
  const handleMouseEnter = () => {
    ProductDetailPage.preload();
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link to={`/products/${product.id}`}>{product.name}</Link>
    </div>
  );
}

// 空闲时预加载
function HomePage() {
  useEffect(() => {
    // 在浏览器空闲时预加载其他页面
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        ProductsPage.preload();
        CartPage.preload();
      });
    }
  }, []);

  return <div>{/* Home content */}</div>;
}
```

### 4.3 资源优化

```typescript
// 图片优化
// 1. 使用WebP格式
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img src="/image.jpg" alt="Description" />
</picture>

// 2. 响应式图片
<img
  srcSet="
    /image-320w.jpg 320w,
    /image-640w.jpg 640w,
    /image-1280w.jpg 1280w
  "
  sizes="(max-width: 320px) 280px,
         (max-width: 640px) 600px,
         1200px"
  src="/image-640w.jpg"
  alt="Description"
/>

// 3. 懒加载图片
import { useEffect, useRef, useState } from 'react';

function LazyImage({ src, alt, ...props }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      { rootMargin: '100px' } // 提前100px加载
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc || '/placeholder.jpg'}
      alt={alt}
      {...props}
    />
  );
}

// 字体优化
// 1. 使用font-display
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/my-font.woff2') format('woff2');
  font-display: swap; /* 或fallback */
  font-weight: 400;
  font-style: normal;
}

// 2. 预加载字体
<link
  rel="preload"
  href="/fonts/my-font.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

// CSS优化
// 1. Critical CSS（首屏CSS内联）
// vite-plugin-critical
import critical from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    critical({
      inline: true,
      minify: true,
      dimensions: [
        { width: 375, height: 667 },
        { width: 1920, height: 1080 },
      ],
    }),
  ],
});

// 2. CSS Modules + Tree Shaking
// styles.module.css
.button {
  padding: 10px 20px;
}

// Component.tsx
import styles from './styles.module.css';

function Button() {
  return <button className={styles.button}>Click</button>;
}

// JS优化
// 1. Tree Shaking - 使用命名导入
// ✅ 好
import { debounce } from 'lodash-es';

// ❌ 坏（导入整个库）
import _ from 'lodash';

// 2. 动态导入
async function handleExport() {
  const { exportToExcel } = await import('@/utils/excel');
  exportToExcel(data);
}
```

---

## 第五章：测试策略

### 5.1 单元测试 (Jest + Testing Library)

```typescript
// 组件测试
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

// Hook测试
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});

// API测试
// productService.test.ts
import { productService } from './productService';
import { apiClient } from '@/lib/axios';

jest.mock('@/lib/axios');

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    (apiClient.get as jest.Mock).mockResolvedValue({
      items: mockProducts,
      total: 2,
    });

    const result = await productService.getProducts({}, 1, 20);

    expect(apiClient.get).toHaveBeenCalledWith('/products', {
      params: { page: 1, limit: 20 },
    });
    expect(result.items).toEqual(mockProducts);
  });

  it('handles errors', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(productService.getProducts({}, 1, 20)).rejects.toThrow(
      'Network error'
    );
  });
});
```

### 5.2 集成测试

```typescript
// ProductList集成测试
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from './ProductList';
import { productService } from '../services/productService';

jest.mock('../services/productService');

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('ProductList', () => {
  it('loads and displays products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    (productService.getProducts as jest.Mock).mockResolvedValue({
      items: mockProducts,
      total: 2,
      totalPages: 1,
    });

    renderWithProviders(<ProductList />);

    // 显示loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (productService.getProducts as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    renderWithProviders(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### 5.3 E2E测试 (Playwright)

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('successful login', async ({ page }) => {
    await page.goto('/login');

    // 填写表单
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');

    // 点击登录
    await page.click('button[type="submit"]');

    // 验证重定向到首页
    await expect(page).toHaveURL('/');

    // 验证用户菜单显示
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // 验证错误消息
    await expect(page.locator('.error-message')).toContainText(
      'Invalid credentials'
    );
  });
});

// 购物流程测试
test.describe('Shopping Flow', () => {
  test('add to cart and checkout', async ({ page }) => {
    // 1. 访问产品页
    await page.goto('/products');

    // 2. 点击第一个产品
    await page.click('[data-testid="product-card"]:first-child');

    // 3. 添加到购物车
    await page.click('[data-testid="add-to-cart"]');

    // 4. 验证购物车数量
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');

    // 5. 访问购物车
    await page.click('[data-testid="cart-icon"]');

    // 6. 验证产品在购物车中
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);

    // 7. 进入结账
    await page.click('[data-testid="checkout-button"]');

    // 8. 验证在结账页面
    await expect(page).toHaveURL('/checkout');
  });
});
```

---

## 第六章：CI/CD流程

### 6.1 GitHub Actions配置

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # 代码质量检查
  lint:
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

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier
        run: npm run format:check

      - name: Type check
        run: npm run type-check

  # 测试
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

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # E2E测试
  e2e:
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

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # 构建
  build:
    needs: [lint, test]
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

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  # 部署到Staging
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v3

      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  # 部署到Production
  deploy-production:
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v3

      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist

      - name: Deploy to Production
        run: |
          # 部署脚本
          echo "Deploying to production..."

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

---

## 第七章：监控与错误追踪

### 7.1 Sentry集成

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // 过滤敏感信息
        if (event.request) {
          delete event.request.cookies;
        }
        return event;
      },
    });
  }
}

// 使用
// App.tsx
import { initSentry } from './lib/sentry';

initSentry();

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <AppRoutes />
    </Sentry.ErrorBoundary>
  );
}
```

### 7.2 性能监控

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // 发送到分析服务
  analytics.track('web-vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 总结

本指南涵盖了React工程化的全部内容：

1. **项目架构** - Feature-based结构、分层架构
2. **TypeScript** - 严格类型、最佳实践
3. **代码规范** - ESLint、Prettier、Husky
4. **构建优化** - 代码分割、资源优化
5. **测试策略** - 单元测试、集成测试、E2E测试
6. **CI/CD** - 自动化流程、部署策略
7. **监控** - 错误追踪、性能监控
8. **团队协作** - Git工作流、代码审查

**关键收获：**
- 良好的架构是可维护性的基础
- 类型安全和代码规范提升代码质量
- 自动化测试保证代码可靠性
- CI/CD加速开发和部署
- 监控帮助及时发现和解决问题

建立完善的工程化体系需要团队共同努力和持续改进！
