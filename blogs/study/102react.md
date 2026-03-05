---
title: REACT
date: 2026/03/05
tags:
 - REACT
categories:
 - FRAME
---

## 为什么 React 的 useState 返回数组，而 Vue 的 Composition API 返回对象

1. React 的 useState 返回数组：追求命名自由与简单

```js
// 使用方式：
const [count, setCount] = useState(0);
```
设计原因：

+ 命名灵活性：数组解构允许开发者在调用时自由命名状态变量和更新函数，无需像对象那样使用固定的属性名（如 state 和 setState），代码更简洁。
+ 位置确定：useState 返回值固定为两个元素，数组顺序天然表达了“第一个是当前值，第二个是更新函数”的约定。数组解构正好利用位置关系，符合 React Hooks 追求“简单直观”的理念。
+ 底层无关性：React 的状态是不可变快照，每次渲染都有独立的 props 和 state，解构过程与响应式连接无关，因此非常安全。

2. Vue 的 Composition API 返回对象：响应式系统要求

```js
const count = ref(0);               // 返回 { value: 0 }
const state = reactive({ name: 'Vue' }); // 返回 Proxy 对象
const { data, error } = useFetch(); // 自定义组合式函数通常返回对象
```

设计原因：

+ 保持响应式连接：Vue 的响应式数据是通过 ref 或 reactive 创建的“代理对象”。如果直接对 reactive 对象进行 ES6 解构，会切断响应式连接，导致变量失去响应性。因此 Vue 提供了 toRefs 工具来安全地解构，而 ref 本身就返回一个包含 value 属性的对象，解构后仍需通过 .value 访问，时刻提醒开发者这是一个响应式引用。
+ 心智模型一致：返回对象可以让开发者清晰地知道“这是一个包含多个属性的响应式实体”，并且通过属性名访问更符合直觉。Vue 鼓励显式的响应式追踪，而不是依赖调用顺序。

> 总结：React 选择数组是为了命名自由，Vue 选择对象是为了与响应式系统无缝协作，保持响应式连接的完整性。

### React 自定义 Hooks 的返回值风格

React 官方没有强制规定自定义 Hook 必须返回数组，开发者可以根据场景自由选择，但社区形成了一些惯例。

1. 返回数组

+ 适用场景：返回值数量固定且较少（通常是 2-3 个），并且经常一起使用，例如一个状态和几个操作函数。
+ 优点：调用者可以任意命名，写法简洁，类似内置 Hooks 的使用体验。

```js
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return [count, increment, decrement]; // 返回数组
}
// 使用
const [count, inc, dec] = useCounter(10);
```

2. 返回对象

+ 适用场景：返回值较多（超过 3 个），或部分值是可选的，或者希望明确每个值的语义。
+ 优点：属性名自解释，解构时不需要记住顺序，且可以只选取需要的属性。

```js
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const reset = () => setValues(initialValues);
  return { values, handleChange, reset }; // 返回对象
}
// 使用
const { values, handleChange, reset } = useForm({ name: '', email: '' });
```

3. 社区惯例与选择建议
类似于 useState 的一对值（如状态 + 设置函数）适合返回数组。

涉及多个独立但有逻辑关联的属性（如 data、loading、error）适合返回对象。

一些流行库如 react-use 中，useToggle 返回数组 [on, toggle]，而 useAsync 返回对象 { loading, error, value }。

## React 生命周期详解

React 组件的生命周期指的是组件从创建、渲染、更新到卸载的整个过程。

1. 挂载阶段（Mounting）:组件被创建并插入 DOM 中。

```
constructor(props)
组件初始化时调用，用于设置初始 state 和绑定方法。必须调用 super(props)。

static getDerivedStateFromProps(props, state)（新增）
在 render 之前调用，用于根据 props 更新 state。返回一个对象来更新 state，或返回 null 表示不更新。这是一个静态方法，无法访问组件实例。

render()
必须实现的方法，返回 JSX 描述 UI。应该是纯函数，不修改 state。

componentDidMount()
组件挂载后（已插入 DOM）立即调用。适合进行网络请求、添加订阅、操作 DOM 等副作用。
```

2. 更新阶段（Updating）组件的 props 或 state 发生变化时触发。

```
static getDerivedStateFromProps(props, state)
在每次渲染前调用，同样用于根据 props 更新 state。

shouldComponentUpdate(nextProps, nextState)
决定是否重新渲染。默认返回 true。可用于性能优化（如浅比较 props/state 是否变化）。如果返回 false，后续生命周期不会执行。

render()
重新渲染 UI。

getSnapshotBeforeUpdate(prevProps, prevState)（新增）
在最近一次渲染输出（提交到 DOM 之前）调用。它返回一个值，作为 componentDidUpdate 的第三个参数。常用于捕获 DOM 信息（如滚动位置）。

componentDidUpdate(prevProps, prevState, snapshot)
组件更新后立即调用。适合操作更新后的 DOM，或根据 props 变化发起网络请求（需注意条件判断避免死循环）。
```

3. 卸载阶段（Unmounting）:组件从 DOM 中移除。

```
componentWillUnmount()
组件卸载前调用。适合清除定时器、取消网络请求、移除订阅等清理工作。
```

4. 错误处理（Error Handling）:当子组件在渲染、生命周期或构造函数中抛出错误时调用。

```
static getDerivedStateFromError(error)
用于在子组件抛出错误后更新 state，展示降级 UI。在渲染阶段调用，不允许执行副作用。

componentDidCatch(error, info)
用于记录错误信息，可以执行副作用（如将错误发送到监控服务）。
```

### 函数组件模拟生命周期


生命周期阶段	|类组件方法	|函数组件| Hook 实现
-|-|-|-
挂载时执行一次	|componentDidMount	|useEffect(fn, []) |空依赖数组
卸载时清理|	componentWillUnmount|	useEffect |返回的清理函数
更新时执行	|componentDidUpdate	|useEffect(fn, [deps]) |依赖变化时执行；或使用 useRef 记录首次挂载标志
每次渲染后执行|	render 之后	useEffect(fn) |无依赖数组|（每次渲染后执行）
获取更新前的DOM 信息|	getSnapshotBeforeUpdate	|useLayoutEffect + useRef 组合|-
跳过渲染|	shouldComponentUpdate|	React.memo |对 props 浅比较，或 useMemo/useCallback 优化子组件


