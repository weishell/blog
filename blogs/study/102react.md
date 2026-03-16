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

## 描述一下 react render的全流程
React 的 render 全流程是从「状态 / 属性变化」到「页面最终更新」的完整链路，核心分为 调度（Scheduler）、协调（Reconciliation）、渲染（Commit） 三大阶段

::: tip render触发场景
1. 组件自身：setState/useState 更新状态、useReducer 派发 action；
2. 父组件：父组件重新 render（即使子组件 props 没变化，默认子组件也会跟着 render）；
3. 强制触发：forceUpdate（类组件）、ReactDOM.flushSync（同步更新）；
4. 上下文：组件消费的 Context.Provider 值变化；
5. 其他：useState/useReducer 的更新函数依赖变化（如 useState(() => xxx) 仅初始化执行，不算）。
:::

1、 阶段 1：调度阶段（Scheduler）—— 决定「什么时候开始计算更新」

核心作用：给更新任务分优先级，避免高优任务被低优任务阻塞（比如输入框打字时，滚动节流的更新不会打断输入）。

+ 优先级划分（React 内部优先级，开发者无需手动设置）：
  - 高优：用户交互（点击、输入）、动画 → 同步 / 高优先级；
  - 中优：网络请求完成后的状态更新 → 中优先级；
  - 低优：滚动 / 窗口 resize、懒加载 → 低优先级（可被打断）。
+ 调度逻辑：
  - 触发更新后，React 不会立即开始计算，而是先交给 Scheduler；
  - Scheduler 基于「requestIdleCallback + 时间切片（Time Slicing）」自己实现 MessageChannel 或 setTimeout 进行时间切片，模拟浏览器空闲时段，从而支持高优任务打断低优任务。在浏览器空闲时执行更新计算；
  - 若有更高优先级任务进来（比如用户突然点击按钮），当前低优任务会被暂停，等高优任务执行完再恢复。
 
2. 阶段 2：协调阶段（Reconciliation）计算「要更新什么」（核心：虚拟 DOM 对比 / Fiber 树）

这是 React 最核心的阶段，也叫「Reconcile 阶段」或「渲染阶段」（注意：此阶段不操作真实 DOM，纯内存计算）。

+ 核心概念：Fiber 架构React 16 后用「Fiber 树」替代了旧的「虚拟 DOM 树」，Fiber 是一个对象，包含：
  - 组件信息（类型、props、state）；
  - DOM 节点信息（对应的真实 DOM）；
  - 副作用标记（比如「需要插入 DOM」「需要删除 DOM」「需要更新属性」）；
  - 链表指针（父、子 、 兄弟 Fiber，方便中断 、 恢复计算）。
+ 协调流程（Fiber 树对比）：
  - 「当前 Fiber 树」：对应页面已渲染的 DOM 结构（旧树）；
  - 「工作 Fiber 树」：基于新状态 、 Props 构建的临时树（新树）；
+ React 从根组件开始，深度优先遍历，逐个对比新旧 Fiber 节点：
  - ✅ 节点类型相同（如都是 `<div>` 都是自定义组件 `<MyComp>`）：复用节点，仅更新 props/state，标记「更新属性」副作用；
  - ✅ 节点类型不同：标记「删除旧节点 + 插入新节点」副作用，不再对比子节点（直接销毁旧子树）；
  - ✅ 列表节点（如 map 生成的节点）：通过 key 对比，避免错位更新（这也是为什么列表必须加 key）。
对比过程中，若有更高优先级任务进来，React 会暂停对比，等优先级高的任务执行完再继续（并发渲染的核心）。
+ 关键优化：Diff 算法React 的 Diff 是「同层对比」（不跨层级对比，比如不会把 `<div><span/></div> 和 <span><div/></span>` 对比），时间复杂度从 O (n³) 降到 O (n)，核心规则：
  - 同层节点：按类型 /key 对比；
  - 列表节点：key 是唯一标识，无 key 会导致全量更新（性能差）；
  - 组件节点：若 props 没变化（且没依赖 Context），可通过 React.memo/PureComponent 跳过对比（避免无用的协调）。

3. 阶段 3：渲染阶段（Commit）—— 执行「真正的更新」（操作 DOM + 执行副作用）

协调阶段完成后，React 会把「副作用标记」一次性批量执行，这个阶段不可中断（保证 DOM 更新的原子性），分 3 个子步骤：
+ 子步骤 1：Before Mutations（DOM 更新前）
  - 执行 getSnapshotBeforeUpdate（类组件）；
  - 读取 DOM 状态（如滚动位置），为后续恢复做准备；
  - 触发 useLayoutEffect 的清理函数（上一轮的）。
+ 子步骤 2：Mutations（DOM 更新）
  - 执行协调阶段标记的 DOM 操作：插入 / 删除 / 更新真实 DOM 节点；
  - 这一步是「真正修改 DOM」的环节，执行完后 DOM 就更新了，但浏览器还没绘制（paint）。
+ 子步骤 3：Layout（DOM 更新后，浏览器绘制前）
  - 执行 useLayoutEffect 的回调函数（同步执行，阻塞浏览器绘制）；
  - 更新类组件的 refs、执行 componentDidUpdate（类组件）；
  - 计算 DOM 布局（如元素的宽高、位置），可同步获取最新 DOM 状态。
+ 子步骤 4：Commit 完成后（异步）
  - 执行 useEffect 的清理函数（上一轮的） + 回调函数（异步执行，不阻塞浏览器绘制）；
  - 触发 useInsertionEffect（CSS-in-JS 框架用，比 useLayoutEffect 更早）；
  - 更新 React 内部的状态快照（如 useRef 的值、state 的最新值）。

### 为什么 useEffect 是异步的，useLayoutEffect 是同步的？
useLayoutEffect：在 DOM 更新后、浏览器绘制前执行，同步阻塞绘制，适合「修改 DOM 样式、读取 DOM 布局」（比如调整滚动位置）；
useEffect：在浏览器绘制后异步执行，不阻塞页面渲染，适合「网络请求、订阅 / 取消订阅」等不依赖 DOM 布局的操作。

###  为什么父组件 render，子组件默认也会 render？
协调阶段中，父组件 Fiber 节点对比后标记「需要更新」，React 会递归对比所有子节点（即使子组件 props 没变化）。解决方法：
函数组件：用 React.memo 包裹子组件（浅对比 props）；
类组件：继承 PureComponent（浅对比 state/props）或重写 shouldComponentUpdate；
配合 useMemo/useCallback 缓存 props（避免父组件每次传新的函数 / 对象，导致 React.memo 失效）。

##  React 协调算法是什么实现的，为什么需要 Fiber
React 协调算法（Reconciliation） 是 React 用来比较前后两棵虚拟 DOM 树，找出实际需要更新的节点的算法。它的核心目标是以最小代价高效地更新真实 DOM。

传统实现（Stack Reconciler）：
1. 在 React 16 之前，协调算法采用基于递归的 Stack Reconciler。递归遍历组件树时，一旦开始更新就无法中断，必须同步执行完整棵树。这种模式的问题在于：
2. 当组件树庞大时，递归更新会长时间占用浏览器主线程（如超过 16ms），导致页面无法响应用户交互（如点击、输入），造成卡顿和掉帧。
3. 缺乏优先级控制：无法区分紧急更新（如动画）和非紧急更新（如后台数据加载），所有更新同等重要，高优先级任务可能被阻塞。

#### 为什么需要 Fiber？
为了解决 Stack Reconciler 的局限性，React 团队重新设计了协调算法，即 Fiber 架构。Fiber 的核心需求是：

可中断的异步更新：将渲染工作拆分成多个小单元，允许在必要时暂停、恢复或终止任务，避免阻塞主线程。

优先级调度：为不同类型的更新分配优先级（如用户交互 > 网络请求 > 数据预取），高优先级任务可打断低优先级任务，保证响应性。

并发渲染能力：为未来支持并发特性（如 Suspense、Transition）奠定基础。

## 什么是 Fiber 架构？空闲渲染有了解吗？

Fiber 架构 是 React 16 引入的新协调引擎，它从底层重新实现了虚拟 DOM 的比较和更新机制。其核心概念如下：

Fiber 节点：

每个组件对应一个 Fiber 节点，它保存了组件的类型、状态、副作用等信息，并通过 child、sibling、return 指针构成链表树结构。

这种链表结构使遍历变得可中断：只需记住当前节点，下次可从中断处继续。

双缓冲机制（workInProgress 树）：

React 在内存中构建一棵 workInProgress 树（表示下一次要渲染的虚拟 DOM），与当前显示的 current 树进行对比。所有更新操作都在 workInProgress 树上进行，完成后一次性提交到 current 树，保证视图一致性。

任务分片与时间切片（Time Slicing）：

渲染过程被拆分为多个小任务单元（每个 Fiber 节点的处理）。React 会在每一帧的空闲时间（通过 requestIdleCallback 或模拟机制）执行这些小任务，若时间不够则让出控制权，等待下一帧继续。

优先级调度：

每种更新（如点击、输入、动画、数据请求）都有不同优先级（Lane 模型）。高优先级任务可打断低优先级任务，确保用户交互得到即时响应。

空闲渲染（Idle Rendering） 指的是利用浏览器空闲时段执行非紧急更新的策略。例如：

通过 requestIdleCallback API 或 React 内置的调度器，在浏览器主线程完成必要工作（如事件处理、绘制）后的空闲时间，执行低优先级的渲染任务（如后台数据预取、日志上报）。

React 的 useDeferredValue 和 startTransition 就是基于这种思想，允许开发者将某些更新标记为“可延迟”，使其在空闲时执行，避免阻塞紧急更新。

Fiber 带来的收益：

解决了长时间渲染导致的卡顿问题。

实现了并发模式，支持 Suspense 的异步渲染和错误边界。

为未来更灵活的渲染策略（如服务器组件）打下基础。

总之，Fiber 通过链表结构、可中断的单元工作和优先级调度，使 React 的更新过程从同步阻塞变为异步可中断，大幅提升了复杂应用的用户体验。
