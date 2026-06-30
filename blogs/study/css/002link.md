---
title: CSS
date: 2026/06/30
tags:
 - CSS
categories:
 - CSS
---

## link 和 @import 的区别

请介绍一下 `<link>` 和 `@import` 的区别，以及在 Vue 项目中的 `@import`
是否与浏览器原生 `@import` 一样？

#### 1. 所属规范不同

- `<link>` 是 HTML 标签，属于 HTML 规范。
- `@import` 是 CSS 提供的语法，属于 CSS 规范。

```html
<link rel="stylesheet" href="./style.css" />
```

```css
@import "./style.css";
```

#### 2. 加载机制不同（重点）

`<link>` 在浏览器解析 HTML 时即可被发现，并可被浏览器的 **Preload Scanner（预加载扫描器）** 提前发现，因此多个 CSS 往往可以并行下载。

`@import` 必须等待父 CSS 文件下载并解析后，浏览器才能发现并继续请求新的CSS，因此会形成 **依赖链（Dependency Chain）**。

例如：

```text
main.css
   │
解析 CSS
   │
发现 @import
   │
theme.css
```

如果存在多层 `@import`：

```text
main.css
  ↓
a.css
  ↓
b.css
  ↓
c.css
```

容易形成 **Waterfall（瀑布流请求）**，增加网络往返时间（RTT），延长**Critical Rendering Path（关键渲染路径）**，因此性能通常不如 `<link>`。

> 注意：并不是"`@import` 要等页面加载完成才加载"，而是**必须等待父 CSS下载并解析完成后才能继续请求**。

#### 3. 是否阻塞渲染

无论是 `<link>` 还是 `@import`，只要属于渲染所需的 CSS，都需要完成 CSSOM的构建，因此**都会阻塞首次渲染**。

真正的区别在于：

- `<link>` 能更早发现资源，支持更好的并行下载。
- `@import` 会增加 CSS 的依赖链，更容易影响首屏性能。

#### 4. 兼容性

- `<link>` 几乎所有浏览器都支持。
- `@import` 从 IE5 开始支持，现代项目基本无需担心兼容性。

#### 5. 权重问题（常见误区）

很多资料说"`link` 的权重大于 `@import`"，这是不准确的。

真正决定样式覆盖的是 CSS 层叠规则（Cascade）：

- 选择器优先级（Specificity）
- `!important`
- CSS Layers
- 最终声明顺序（Order）

两者不存在"权重高低"，只是最终生成的 CSS 顺序可能不同。

#### 6. Vue 中的 `@import` 一样吗？

例如：

```vue
<style lang="scss">
@import "./theme.scss";
</style>
```

语法相同，但现代 Vue（Vite/Webpack）中的执行机制通常不同。

浏览器原生：

```text
CSS → 解析 → 发现 @import → 再请求 CSS
```

Vue 工程化：

```text
.vue → Vite/Webpack → 解析 @import → 合并/拆分 CSS → 输出最终资源
```

也就是说，大多数 `@import`会在**构建阶段**被处理，而不是浏览器运行时再解析，因此浏览器原生加载机制的差异通常已被弱化。

### Vue 中的 `@import` 和 JavaScript `import` 一样吗？

```js
import "./style.css";
```

```css
@import "./style.css";
```

二者不是同一个概念。

对比项 `import` `@import`

---

所属规范 ES Module CSS
导入资源 JS、CSS、图片、JSON 等 CSS（及预处理器）
处理阶段 构建阶段 浏览器原生或构建阶段
Vue 推荐 推荐 可以使用，但更推荐统一入口或 JS import

### 高频追问

**Q：`<link>` 可以加 `async` 或 `defer` 吗？**

不能。

- `async`、`defer` 仅适用于 `<script>`。
- `<link rel="stylesheet">` 不支持这两个属性。

如果需要优化 CSS 加载，可以考虑：

- `rel="preload"` 后切换为 `stylesheet`
- `media="print"` + `onload`
- 按需拆分 CSS

###  面试总结

> `<link>` 是 HTML 标签，`@import` 是 CSS 语法。两者都会阻塞首次渲染，但`<link>` 能在 HTML 解析阶段更早被发现，并支持更好的并行下载；而`@import` 必须等待父 CSS 下载并解析后才能继续请求新的CSS，容易形成依赖链和瀑布流请求，因此性能通常较差。另外，两者不存在所谓"权重高低"，样式覆盖由CSS 层叠规则决定。在 Vue/Vite/Webpack 中，大多数 `@import`会在构建阶段处理，因此与浏览器原生 `@import` 的加载机制并不完全相同。


